/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { chatAPI } from '../services/api';
import { initSocket, startTyping, stopTyping, sendMessage as emitMessage } from '../services/socket';

const ChatContext = createContext();

const getChatKey = (userId1, userId2) => {
  const ids = [userId1, userId2].sort();
  return `chat_${ids[0]}_${ids[1]}`;
};

const readSavedMessages = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

export function ChatProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [unread] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const loadUsers = useCallback(async () => {
    try {
      const res = await chatAPI.getUsers();
      setUsers(res.data || []);
      setError('');
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Server offline. Using cached data.');

      const cached = localStorage.getItem(`users_${user?.id}`);
      if (cached) setUsers(JSON.parse(cached));
    }
  }, [user?.id]);

  const loadMessages = useCallback(async (chatId) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const res = await chatAPI.getMessages(chatId);
      const loadedMessages = res.data || [];

      const chatKey1 = getChatKey(user.id, chatId);
      const chatKey2 = getChatKey(chatId, user.id);
      const saved1 = localStorage.getItem(chatKey1);
      const saved2 = localStorage.getItem(chatKey2);
      const allSaved = saved1 ? readSavedMessages(chatKey1) : [];

      if (saved2 && saved2 !== saved1) {
        allSaved.push(...readSavedMessages(chatKey2));
      }

      const merged = [...new Set([...allSaved, ...loadedMessages].map((message) => JSON.stringify(message)))]
        .map((message) => JSON.parse(message))
        .sort((a, b) => new Date(a.timestamp || a.createdAt) - new Date(b.timestamp || b.createdAt));

      setMessages(merged);
      setError('');
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('Server offline. Showing cached messages.');

      const chatKey = getChatKey(user.id, chatId);
      const saved = localStorage.getItem(chatKey);
      setMessages(saved ? readSavedMessages(chatKey) : []);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user && !authLoading) {
      const newSocket = initSocket(
        user.id,
        (usersList) => {
          setUsers(usersList);
          setError('');
        },
        (onlineList) => setOnlineUsers(new Set(onlineList)),
        (message) => {
          setMessages((prev) => {
            const newMessages = [...prev, message];
            const chatKey1 = getChatKey(user.id, message.from);
            const chatKey2 = getChatKey(message.from, message.to);
            localStorage.setItem(chatKey1, JSON.stringify(newMessages));

            if (message.to === user.id) {
              localStorage.setItem(chatKey2, JSON.stringify(newMessages));
            }

            return newMessages;
          });
        },
        (typingData) => {
          if (typingData.typing) {
            setTypingUsers((prev) => new Set([...prev, typingData.from]));
          } else {
            setTypingUsers((prev) => {
              const newSet = new Set(prev);
              newSet.delete(typingData.from);
              return newSet;
            });
          }
        }
      );

      newSocket.on('connect', () => setSocketConnected(true));
      newSocket.on('disconnect', () => setSocketConnected(false));
      newSocket.on('connect_error', () => setError('Connection lost. Retrying...'));

      loadUsers();

      return () => {
        newSocket.disconnect();
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      };
    }

    return undefined;
  }, [user, authLoading, loadUsers]);

  useEffect(() => {
    if (activeChat && user) {
      loadMessages(activeChat.id);
    }
  }, [activeChat, user, loadMessages]);

  const sendMessage = useCallback((text) => {
    if (activeChat && socketConnected && text.trim()) {
      const message = {
        from: user.id,
        to: activeChat.id,
        text: text.trim(),
        timestamp: new Date().toISOString(),
      };
      const tempId = Date.now();
      const optimisticMessage = { ...message, tempId, pending: true };

      setMessages((prev) => {
        const newMessages = [...prev, optimisticMessage];
        const chatKey = getChatKey(user.id, activeChat.id);
        localStorage.setItem(chatKey, JSON.stringify(newMessages));
        return newMessages;
      });

      emitMessage(message);
    } else if (!socketConnected) {
      setError('Server offline. Message not sent.');
    }
  }, [activeChat, user, socketConnected]);

  const handleTyping = useCallback(() => {
    if (activeChat && typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    if (activeChat) {
      startTyping(activeChat.id);
      typingTimeoutRef.current = setTimeout(() => stopTyping(activeChat.id), 1500);
    }
  }, [activeChat]);

  const clearError = () => setError('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const value = {
    users,
    onlineUsers,
    typingUsers,
    unread,
    activeChat,
    setActiveChat,
    messages,
    sendMessage,
    loading,
    error,
    socketConnected,
    handleTyping,
    clearError,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
      <div ref={messagesEndRef} />
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
}

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { chatAPI } from '../services/api';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(`users_${user?.id}`);
    return saved ? JSON.parse(saved) : [
      { id: 'user2', name: 'John Doe', lastSeen: Date.now() },
      { id: 'user3', name: 'Jane Smith', lastSeen: Date.now() - 3600000 },
      { id: 'user4', name: 'Bob Johnson', lastSeen: Date.now() }
    ];
  });
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [unread, setUnread] = useState({});

  useEffect(() => {
    if (user) {
      // Persist users
      localStorage.setItem(`users_${user.id}`, JSON.stringify(users));
      
      // Simulate online status
      const interval = setInterval(() => {
        const now = Date.now();
        const online = users.filter(u => Math.random() > 0.3 || u.id === 'user2').map(u => u.id);
        setOnlineUsers(new Set(online));
        setUsers(users.map(u => ({ ...u, lastSeen: now })));
      }, 10000);

      // Load chat history
      if (activeChat) {
        const savedMessages = localStorage.getItem(`chat_${user.id}_${activeChat.id}`);
        if (savedMessages) setMessages(JSON.parse(savedMessages));
      }

      return () => clearInterval(interval);
    }
  }, [user]);

  const sendMessage = useCallback((text) => {
    if (activeChat) {
      const message = {
        from: user.id,
        to: activeChat.id,
        text,
        timestamp: new Date().toISOString()
      };
      if (socket) socket.emit('send_message', message);
      setMessages((prev) => [...prev, message]);
    }
  }, [socket, activeChat, user]);

  const value = {
    users,
    onlineUsers,
    activeChat,
    setActiveChat,
    messages,
    sendMessage
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
}



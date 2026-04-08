import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { chatAPI } from '../services/api';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([
    { id: 'user2', name: 'John Doe' },
    { id: 'user3', name: 'Jane Smith' },
    { id: 'user4', name: 'Bob Johnson' }
  ]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set(['user2', 'user4']));

  useEffect(() => {
    if (user) {
      // Mock fetch users
      // chatAPI.getUsers().then(res => setUsers(res.data));

      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      newSocket.emit('join', user.id);
      newSocket.on('online_users', (onlineList) => setOnlineUsers(new Set(onlineList)));
      newSocket.on('receive_message', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => newSocket.close();
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



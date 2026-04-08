import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { chatAPI } from '../services/api';
import { initSocket } from '../services/socket';

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}


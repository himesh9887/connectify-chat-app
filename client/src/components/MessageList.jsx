import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { useChat } from '../context/ChatContext';
import '../App.css';

function MessageList({ messages }) {
  const { activeChat } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg} isOwn={msg.from === activeChat?.id} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;


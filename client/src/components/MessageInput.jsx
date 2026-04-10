import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import '../App.css';

function MessageInput() {
  const [text, setText] = useState('');
  const { sendMessage } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      sendMessage(text.trim());
      setText('');
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        rows="1"
      />
      <button type="submit" className="send-btn">➤</button>
    </form>
  );
}

export default MessageInput;


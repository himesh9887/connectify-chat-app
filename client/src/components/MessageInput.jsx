import { useState } from 'react';
import { useChat } from '../context/ChatContext';
import '../App.css';

function MessageInput() {
  const [text, setText] = useState('');
  const { sendMessage, handleTyping, socketConnected } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      sendMessage(text.trim());
      setText('');
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    handleTyping();
  };

  return (
    <form className="message-input-container" onSubmit={handleSubmit}>
      <input
        className="message-input"
        value={text}
        onChange={handleChange}
        placeholder={socketConnected ? 'Type a message' : 'Waiting for connection'}
        aria-label="Message"
      />
      <button className="send-btn" type="submit" disabled={!text.trim()}>
        Send
      </button>
    </form>
  );
}

export default MessageInput;

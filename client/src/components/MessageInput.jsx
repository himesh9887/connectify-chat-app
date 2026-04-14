import { useState } from 'react';
import { useChat } from '../context/ChatContext';
import '../App.css';

function MessageInput() {
  const [text, setText] = useState('');
  const { sendMessage, handleTyping, socketConnected } = useChat();
  const messageLimit = 600;

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
      <div className="composer-field">
        <input
          className="message-input"
          value={text}
          onChange={handleChange}
          placeholder={socketConnected ? 'Type a message' : 'Waiting for connection'}
          aria-label="Message"
          maxLength={messageLimit}
        />
        <span className="composer-hint">
          {text.length ? `${text.length}/${messageLimit}` : socketConnected ? 'Enter to send' : 'Reconnecting'}
        </span>
      </div>
      <button className="send-btn" type="submit" disabled={!text.trim()}>
        Send
      </button>
    </form>
  );
}

export default MessageInput;

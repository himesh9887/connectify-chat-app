import { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { startTyping, stopTyping } from '../services/socket';
import '../App.css';

function MessageInput() {
  const [text, setText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const { sendMessage, activeChat } = useChat();
  const inputRef = useRef(null);
  const typingTimerRef = useRef(null);

  const handleTyping = () => {
    if (activeChat) {
      startTyping(activeChat.id);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => stopTyping(activeChat.id), 1000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && activeChat) {
      sendMessage(text.trim());
      setText('');
      stopTyping(activeChat.id);
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <button type="button" className="attach-btn">📎</button>
      <button 
        type="button" 
        className="emoji-btn"
        onClick={() => setShowEmojis(!showEmojis)}
      >
        😀
      </button>
      <input
        ref={inputRef}
        type="text"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleTyping}
        rows="1"
      />
      <button type="submit" className="send-btn">Send</button>
      {showEmojis && (
        <div className="emoji-picker">
          😊 😂 ❤️ 🔥 📷
        </div>
      )}
    </form>
  );
}

export default MessageInput;


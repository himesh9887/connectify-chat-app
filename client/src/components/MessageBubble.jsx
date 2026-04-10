import React from 'react';
import '../App.css';

function MessageBubble({ message, isOwn }) {
  const bubbleClass = isOwn ? 'message-bubble own' : 'message-bubble other';
  const contentClass = isOwn ? 'message-content own' : 'message-content';

  const time = new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  return (
    <div className={bubbleClass}>
      <div className={contentClass}>
        <p>{message.text}</p>
        <div className="message-time">{time}</div>
      </div>
    </div>
  );
}

export default MessageBubble;


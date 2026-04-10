import React from 'react';
import MessageBubble from './MessageBubble';
import '../App.css';

function MessageList({ messages, currentUserId }) {
  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id || index}
          message={message}
          isOwn={message.from === currentUserId}
        />
      ))}
    </div>
  );
}

export default MessageList;


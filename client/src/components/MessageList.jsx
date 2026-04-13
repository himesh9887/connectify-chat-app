import MessageBubble from './MessageBubble';
import '../App.css';

function MessageList({ messages, currentUserId }) {
  if (!messages.length) {
    return (
      <div className="message-list">
        <div className="message-empty">No messages yet. Say hello.</div>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id || message.tempId || index}
          message={message}
          isOwn={message.from === currentUserId}
        />
      ))}
    </div>
  );
}

export default MessageList;

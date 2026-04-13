import '../App.css';

function MessageBubble({ message, isOwn }) {
  const timestamp = message.timestamp || message.createdAt;
  const date = timestamp ? new Date(timestamp) : null;
  const time = date && !Number.isNaN(date.getTime())
    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={isOwn ? 'message sent' : 'message received'}>
      <div className="message-bubble">
        <p className="message-text">{message.text}</p>
        <span className="message-time">
          {time}
          {message.pending && <span className="pending-label">Sending</span>}
        </span>
      </div>
    </div>
  );
}

export default MessageBubble;

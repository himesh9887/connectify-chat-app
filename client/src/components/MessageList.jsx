import { Fragment, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import '../App.css';

const isSameDay = (left, right) =>
  left.getFullYear() === right.getFullYear()
  && left.getMonth() === right.getMonth()
  && left.getDate() === right.getDate();

const getMessageDate = (message) => {
  const timestamp = message.timestamp || message.createdAt;
  const date = timestamp ? new Date(timestamp) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const getDayLabel = (date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  const options = date.getFullYear() === today.getFullYear()
    ? { month: 'short', day: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' };

  return date.toLocaleDateString([], options);
};

function MessageList({ messages, currentUserId, activeChat }) {
  const endRef = useRef(null);
  const senderInitial = activeChat?.name?.charAt(0).toUpperCase() || 'C';

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  if (!messages.length) {
    return (
      <div className="message-list" role="log" aria-live="polite">
        <div className="message-empty">
          <span className="message-empty-icon" aria-hidden="true">C</span>
          <strong>No messages yet.</strong>
          <span>Say hello and start the thread.</span>
        </div>
        <div ref={endRef} />
      </div>
    );
  }

  return (
    <div className="message-list" role="log" aria-live="polite">
      {messages.map((message, index) => {
        const date = getMessageDate(message);
        const dayKey = date.toDateString();
        const previousDate = index > 0 ? getMessageDate(messages[index - 1]) : null;
        const showDivider = !previousDate || dayKey !== previousDate.toDateString();
        const messageKey = message.id || message.tempId || index;

        return (
          <Fragment key={messageKey}>
            {showDivider && (
              <div className="message-day-divider">
                <span>{getDayLabel(date)}</span>
              </div>
            )}
            <MessageBubble
              message={message}
              isOwn={message.from === currentUserId}
              senderInitial={senderInitial}
            />
          </Fragment>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}

export default MessageList;

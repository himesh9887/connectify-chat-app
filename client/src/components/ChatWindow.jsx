import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import '../App.css';

function ChatWindow({ activeChat }) {
  const { user } = useAuth();
  const { messages, loading, onlineUsers, typingUsers } = useChat();

  if (!activeChat) {
    return (
      <main className="chat-window no-chat">
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">C</div>
          <h2>Your chats are ready.</h2>
          <p>Select a person from the list and start a conversation.</p>
        </div>
      </main>
    );
  }

  const isOnline = onlineUsers.has(activeChat.id);
  const isTyping = typingUsers.has(activeChat.id);

  return (
    <main className="chat-window">
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="avatar avatar-large" aria-hidden="true">
            {activeChat.name.charAt(0).toUpperCase()}
          </div>
          <div className="chat-title-block">
            <span className="chat-user-name">{activeChat.name}</span>
            <span className={isOnline ? 'chat-user-status online' : 'chat-user-status'}>
              {isTyping ? 'Typing...' : isOnline ? 'Online now' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <MessageList messages={messages} currentUserId={user.id} />
      {loading && <div className="loading">Loading messages...</div>}
      <MessageInput />
    </main>
  );
}

export default ChatWindow;

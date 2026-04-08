import { useChat } from '../context/ChatContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import '../App.css';

function ChatWindow({ activeChat, messages }) {
  if (!activeChat) {
    return (
      <div className="chat-window no-chat">
        <div>Select a user to start chatting</div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="avatar">{activeChat.name.charAt(0).toUpperCase()}</div>
          <span>{activeChat.name}</span>
        </div>
      </div>
      <MessageList messages={messages} />
      <MessageInput />
    </div>
  );
}

export default ChatWindow;


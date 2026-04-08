import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import UserList from '../components/UserList';
import ChatWindow from '../components/ChatWindow';
import '../App.css';

function Chat() {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const { users, onlineUsers, activeChat, setActiveChat, messages } = useChat();
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) && u.id !== user.id
  );

  return (
    <div className="chat-app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Connectify</h2>
          <div className="user-info">
            <span>{user?.name}</span>
            <button onClick={logout}>Logout</button>
            <button onClick={toggleDarkMode}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
        <div className="search">
          <input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <UserList users={filteredUsers} onlineUsers={onlineUsers} onSelect={setActiveChat} />
      </div>
      <ChatWindow activeChat={activeChat} messages={messages} />
    </div>
  );
}

export default Chat;


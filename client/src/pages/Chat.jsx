import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import UserList from '../components/UserList';
import ChatWindow from '../components/ChatWindow';
import '../App.css';

function Chat() {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const {
    users,
    onlineUsers,
    activeChat,
    setActiveChat,
    error,
    clearError,
    socketConnected,
  } = useChat();
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter((candidate) =>
    candidate.name.toLowerCase().includes(search.toLowerCase()) && candidate.id !== user.id
  );

  return (
    <div className="chat-app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-lockup">
            <span className="brand-mark brand-mark-small" aria-hidden="true">C</span>
            <div>
              <h2>Connectify</h2>
              <span className={socketConnected ? 'connection-status online' : 'connection-status offline'}>
                {socketConnected ? 'Connected' : 'Offline mode'}
              </span>
            </div>
          </div>

          <div className="user-actions">
            <span className="user-chip" title={user?.email || user?.name}>{user?.name}</span>
            <button className="ghost-button" type="button" onClick={toggleDarkMode}>
              {darkMode ? 'Light' : 'Dark'}
            </button>
            <button className="ghost-button" type="button" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <div className="search">
          <label>
            <span>Search users</span>
            <input
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>

        {error && (
          <div className="connection-banner">
            <span>{error}</span>
            <button type="button" onClick={clearError}>Dismiss</button>
          </div>
        )}

        <UserList
          users={filteredUsers}
          onlineUsers={onlineUsers}
          activeChat={activeChat}
          onSelect={setActiveChat}
          currentUserId={user.id}
        />
      </aside>

      <ChatWindow activeChat={activeChat} />
    </div>
  );
}

export default Chat;

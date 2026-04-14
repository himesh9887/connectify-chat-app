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

  const currentUserId = user?.id;
  const people = users.filter((candidate) => candidate.id !== currentUserId);
  const onlineCount = people.filter((candidate) => onlineUsers.has(candidate.id)).length;
  const userInitial = user?.name?.charAt(0).toUpperCase() || 'U';

  const filteredUsers = users.filter((candidate) =>
    (candidate.name || '').toLowerCase().includes(search.toLowerCase()) && candidate.id !== currentUserId
  );

  return (
    <div className="chat-app">
      <aside className="sidebar" aria-label="Conversations">
        <div className="sidebar-header">
          <div className="sidebar-topline">
            <div className="brand-lockup">
              <span className="brand-mark brand-mark-small" aria-hidden="true">C</span>
              <div>
                <h2>Connectify</h2>
                <span className={socketConnected ? 'connection-status online' : 'connection-status offline'}>
                  {socketConnected ? 'Connected' : 'Offline mode'}
                </span>
              </div>
            </div>

            <div className="sidebar-controls">
              <button className="ghost-button compact-button" type="button" onClick={toggleDarkMode}>
                {darkMode ? 'Light' : 'Dark'}
              </button>
              <button className="ghost-button compact-button" type="button" onClick={logout}>
                Logout
              </button>
            </div>
          </div>

          <div className="account-strip">
            <span className="avatar self-avatar" aria-hidden="true">{userInitial}</span>
            <div className="account-copy">
              <span className="account-name" title={user?.name}>{user?.name}</span>
              <span className="account-email" title={user?.email || user?.name}>{user?.email || 'Ready to chat'}</span>
            </div>
          </div>

          <div className="chat-overview" aria-label="Chat overview">
            <div>
              <span className="overview-number">{people.length}</span>
              <span className="overview-label">People</span>
            </div>
            <div>
              <span className="overview-number">{onlineCount}</span>
              <span className="overview-label">Online</span>
            </div>
          </div>
        </div>

        <div className="search">
          <label>
            <span>Search people</span>
            <div className="search-input-wrap">
              <input
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </label>
        </div>

        {error && (
          <div className="connection-banner">
            <span>{error}</span>
            <button type="button" onClick={clearError}>Dismiss</button>
          </div>
        )}

        <div className="sidebar-section-title">
          <span>Direct messages</span>
          <span>{filteredUsers.length}</span>
        </div>

        <UserList
          users={filteredUsers}
          onlineUsers={onlineUsers}
          activeChat={activeChat}
          onSelect={setActiveChat}
          currentUserId={currentUserId}
        />
      </aside>

      <ChatWindow activeChat={activeChat} />
    </div>
  );
}

export default Chat;

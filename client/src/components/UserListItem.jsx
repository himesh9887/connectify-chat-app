import React from 'react';
import '../App.css';

function UserListItem({ user, isOnline, onClick, active = false }) {
  const statusClass = isOnline ? 'online' : 'offline';
  const itemClass = active ? 'user-item active' : 'user-item';

  return (
    <div className={itemClass} onClick={onClick}>
      <div className="user-avatar">
        <span>{user.name.charAt(0).toUpperCase()}</span>
        <span className={`online-status ${statusClass}`}></span>
      </div>
      <div className="user-details">
        <div className="user-name">{user.name}</div>
        <div className="user-status">
          {isOnline ? 'Online' : `Last seen ${new Date(user.lastSeen).toLocaleTimeString()}`}
        </div>
      </div>
    </div>
  );
}

export default UserListItem;


import React from 'react';
import UserListItem from './UserListItem';
import '../App.css';

function UserList({ users, onlineUsers, activeChat, onSelect, currentUserId }) {
  return (
    <div className="user-list">
      {users
        .filter(u => u.id !== currentUserId)
        .map((user) => (
          <UserListItem
            key={user.id}
            user={user}
            isOnline={onlineUsers.has(user.id)}
            active={activeChat?.id === user.id}
            onClick={() => onSelect(user)}
          />
        ))}
    </div>
  );
}

export default UserList;


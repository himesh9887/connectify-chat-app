import UserListItem from './UserListItem';
import '../App.css';

function UserList({ users, onlineUsers, activeChat, onSelect, currentUserId }) {
  const visibleUsers = users.filter((user) => user.id !== currentUserId);

  if (!visibleUsers.length) {
    return (
      <div className="user-list empty-list">
        <p>No matching users.</p>
      </div>
    );
  }

  return (
    <div className="user-list">
      {visibleUsers.map((user) => (
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

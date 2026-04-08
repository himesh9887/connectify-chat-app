import UserListItem from './UserListItem';

function UserList({ users, onlineUsers, onSelect }) {
  return (
    <div className="user-list">
      {users.map((user) => (
        <UserListItem
          key={user.id}
          user={user}
          isOnline={onlineUsers.has(user.id)}
          onClick={() => onSelect(user)}
        />
      ))}
    </div>
  );
}

export default UserList;


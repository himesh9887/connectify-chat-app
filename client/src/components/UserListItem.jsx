function UserListItem({ user, isOnline, onClick }) {
  return (
    <div className="user-item" onClick={onClick}>
      <div className="user-avatar">
        <div className={`online-status ${isOnline ? 'online' : 'offline'}`} />
        <span>{user.name.charAt(0).toUpperCase()}</span>
      </div>
      <div className="user-details">
        <div className="user-name">{user.name}</div>
        <div className="user-status">{isOnline ? 'Online' : 'Offline'}</div>
      </div>
    </div>
  );
}

export default UserListItem;


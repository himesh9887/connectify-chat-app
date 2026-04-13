import '../App.css';

function UserListItem({ user, isOnline, onClick, active = false }) {
  const statusClass = isOnline ? 'online' : 'offline';
  const itemClass = active ? 'user-item active' : 'user-item';
  const initial = user.name.charAt(0).toUpperCase();

  const getStatusText = () => {
    if (isOnline) return 'Online now';
    if (!user.lastSeen) return 'Offline';

    const lastSeen = new Date(user.lastSeen);
    if (Number.isNaN(lastSeen.getTime())) return 'Offline';

    return `Last seen ${lastSeen.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <button className={itemClass} type="button" onClick={onClick} aria-pressed={active}>
      <span className="user-avatar">
        <span className="avatar-initial">{initial}</span>
        <span className={`online-status ${statusClass}`} aria-label={isOnline ? 'Online' : 'Offline'}></span>
      </span>
      <span className="user-details">
        <span className="user-name">{user.name}</span>
        <span className="user-status">{getStatusText()}</span>
      </span>
    </button>
  );
}

export default UserListItem;

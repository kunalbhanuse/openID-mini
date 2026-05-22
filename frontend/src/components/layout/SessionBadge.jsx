import { useNavigate } from "react-router-dom";

export default function SessionBadge({ user, onLogout }) {
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="session-badge guest">
        <span>Guest session</span>
        <button onClick={() => navigate("/login")}>Sign in</button>
      </div>
    );
  }

  return (
    <div className="session-badge">
      <div className="avatar">{user.name?.slice(0, 2).toUpperCase()}</div>
      <div>
        <strong>{user.name}</strong>
        <span>{user.email}</span>
      </div>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

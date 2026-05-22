import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { API_BASE } from "../../config/api";
import { navItems } from "../../constants/navItems";
import { getPageTitle } from "../../constants/pageTitles";
import SessionBadge from "./SessionBadge";

export default function Shell({ children, user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => navigate("/")}>
          <span className="brand-mark">OM</span>
          <span>
            <strong>OpenID Mini</strong>
            <small>Project by Kunal Bhanuse</small>
          </span>
        </button>

        <nav aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) => (isActive ? "active" : "")}
              key={item.path}
              to={item.path}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-panel">
          <span className="mini-label">Provider endpoint</span>
          <strong>{API_BASE.replace("http://", "")}</strong>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <span className="eyebrow">Identity Provider</span>
            <h1>{pageTitle}</h1>
          </div>
          <SessionBadge user={user} onLogout={onLogout} />
        </header>

        {children}
      </main>
    </div>
  );
}

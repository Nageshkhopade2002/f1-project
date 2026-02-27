import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import "./admin-layout.css";

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="admin-brand">
          {!collapsed ? (
            <>
              F1 <span>ADMIN</span>
            </>
          ) : (
            <span>F1</span>
          )}
        </div>

        <button 
          className="sidebar-toggle" 
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? '›' : '‹'}
        </button>

        <nav className="admin-nav">
          <NavLink to="/admin" className="admin-link" title="Dashboard">
            <span className="icon">📊</span>
            {!collapsed && <span className="label">Dashboard</span>}
          </NavLink>

          <NavLink to="/admin/users" className="admin-link" title="Manage Users">
            <span className="icon">👥</span>
            {!collapsed && <span className="label">Users</span>}
          </NavLink>

          <NavLink to="/admin/news" className="admin-link" title="Manage News">
            <span className="icon">📰</span>
            {!collapsed && <span className="label">News</span>}
          </NavLink>

          <NavLink to="/admin/schedule" className="admin-link" title="Manage Schedule">
            <span className="icon">📅</span>
            {!collapsed && <span className="label">Schedule</span>}
          </NavLink>

          <NavLink to="/admin/circuits" className="admin-link" title="Manage Circuits">
            <span className="icon">🏁</span>
            {!collapsed && <span className="label">Circuits</span>}
          </NavLink>

          <NavLink to="/admin/sessions" className="admin-link" title="Manage Sessions">
            <span className="icon">⏱</span>
            {!collapsed && <span className="label">Sessions</span>}
          </NavLink>

          <NavLink to="/admin/teams" className="admin-link" title="Manage Teams">
            <span className="icon">🏎</span>
            {!collapsed && <span className="label">Teams</span>}
          </NavLink>

          <NavLink to="/admin/drivers" className="admin-link" title="Manage Drivers">
            <span className="icon">🏆</span>
            {!collapsed && <span className="label">Drivers</span>}
          </NavLink>

          <NavLink to="/admin/tikit" className="admin-link" title="Manage Tickets">
            <span className="icon">🎫</span>
            {!collapsed && <span className="label">Tickets</span>}
          </NavLink>

          <NavLink to="/admin/bookings" className="admin-link" title="Manage Bookings">
            <span className="icon">📋</span>
            {!collapsed && <span className="label">Bookings</span>}
          </NavLink>
        </nav>

        <button className="admin-logout" onClick={logout}>
          {!collapsed ? 'Logout' : '⏻'}
        </button>
      </aside>

      <main className={`admin-main ${collapsed ? 'expanded' : ''}`}>
        {children}
      </main>
    </>
  );
}

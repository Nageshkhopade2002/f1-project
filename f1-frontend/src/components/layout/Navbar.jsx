import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { useState } from "react";
import { API_BASE_URL } from "../../config/api";
import "./navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (user && user.role === "ADMIN") return null;

  return (
    <nav className="f1-navbar">
      <NavLink to="/" className="f1-brand-link">
        <div className="f1-brand">
          <img
            src={`${API_BASE_URL}/uploads/F1HUB_logo2.png`}
            alt="F1 HUB"
            className="f1-logo"
          />
        </div>
      </NavLink>

      <button 
        className={`f1-hamburger ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`f1-menu ${menuOpen ? 'active' : ''}`}>
        <NavLink to="/" className="f1-link" onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/schedule/2026" className="f1-link" onClick={() => setMenuOpen(false)}>Schedule</NavLink>
        <NavLink to="/teams" className="f1-link" onClick={() => setMenuOpen(false)}>Teams</NavLink>
        <NavLink to="/drivers" className="f1-link" onClick={() => setMenuOpen(false)}>Drivers</NavLink>
        <NavLink to="/tickets" className="f1-link" onClick={() => setMenuOpen(false)}>Tickets</NavLink>
        <NavLink to="/news" className="f1-link" onClick={() => setMenuOpen(false)}>News</NavLink>

        {user && user.role === "USER" && (
          <NavLink to="/my-bookings" className="f1-link my-bookings" onClick={() => setMenuOpen(false)}>
            My Tickets
          </NavLink>
        )}

        {!user && (
          <NavLink to="/login" className="f1-btn" onClick={() => setMenuOpen(false)}>
            Login
          </NavLink>
        )}

        {user && user.role === "USER" && (
          <button className="f1-logout" onClick={() => { logout(); setMenuOpen(false); }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

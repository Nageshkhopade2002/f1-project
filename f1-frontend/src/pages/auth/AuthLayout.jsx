import { NavLink, Outlet } from "react-router-dom";
import "./auth.css";

export default function AuthLayout() {
  return (
    <div className="auth-page">
      {/* TOP TABS */}
      <div className="auth-tabs">
        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive ? "auth-tab active" : "auth-tab"
          }
        >
          Sign in
        </NavLink>

        <NavLink
          to="/register"
          className={({ isActive }) =>
            isActive ? "auth-tab active" : "auth-tab"
          }
        >
          Register
        </NavLink>
      </div>

      {/* CONTENT */}
      <div className="auth-container">
        <Outlet />
      </div>
    </div>
  );
}

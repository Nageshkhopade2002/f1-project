import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthProvider";
import "./login-animated.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });

      const token =
        res.data && typeof res.data === "object" && res.data.token
          ? res.data.token
          : res.data;

      if (!token) throw new Error("No token received");

      login(token);

      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      );

      const role = payload?.role || payload?.roles;

      if (role === "ADMIN") navigate("/admin");
      else navigate("/user");
    } catch (e) {
      console.error(e);
      setErr("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="login-animated-root">
      <div className="login-animated-wrap">
        <div className="login-card shadow-lg p-4 rounded">
          <h3 className="text-center mb-3 text-danger fw-bold">
            Welcome to F1 HUB
          </h3>

          {err && <div className="alert alert-danger">{err}</div>}

          <input
            className="form-control mb-2"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            className="form-control mb-3"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button
            className="btn btn-danger w-100"
            onClick={handle}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <div className="d-flex justify-content-between mt-3">
            <a href="/signup">Create account</a>
            <a href="/forgot">Forgot password?</a>
          </div>
        </div>
      </div>
    </div>
  );
} 

 
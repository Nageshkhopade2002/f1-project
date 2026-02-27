import React, { useState } from "react";
import api from "../../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleForgot = async () => {
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setMsg("Reset link sent to your email ✅");
    } catch (e) {
      setErr("Email not found ❌");
    }
    setLoading(false);
  };

  return (
    <div className="login-animated-root">
      <div className="login-card p-4">
        <h4 className="text-center text-danger fw-bold">
          Forgot Password
        </h4>

        {msg && <div className="alert alert-success">{msg}</div>}
        {err && <div className="alert alert-danger">{err}</div>}

        <input
          className="form-control mb-3"
          placeholder="Enter registered email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <button
          className="btn btn-danger w-100"
          onClick={handleForgot}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </div>
    </div>
  );
}

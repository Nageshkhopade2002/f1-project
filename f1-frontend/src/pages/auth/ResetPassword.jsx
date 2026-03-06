import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (password !== confirm) {
      setErr("Passwords do not match ❌");
      return;
    }

    setLoading(true);
    setErr(null);

    try {
      await api.post("/auth/reset-password", {
        token,
        password,
      });
      navigate("/");
    } catch (e) {
      setErr("Invalid or expired link ❌");
    }
    setLoading(false);
  };

  return (
    <div className="login-animated-root">
      <div className="login-card p-4">
        <h4 className="text-center text-danger fw-bold">
          Reset Password
        </h4>

        {err && <div className="alert alert-danger">{err}</div>}

        <input
          type="password"
          className="form-control mb-2"
          placeholder="New Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Confirm Password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />

        <button
          className="btn btn-danger w-100"
          onClick={handleReset}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}

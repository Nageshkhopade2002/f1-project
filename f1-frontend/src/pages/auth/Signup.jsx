// src/pages/Signup.js
import React, { useState } from "react";
import api from "../../services/api";

import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);

  const register = async () => {
    setMsg(null);
    try {
      await api.post("/auth/register", { name, email, password });
      setMsg({ type: "success", text: "Registered successfully. Redirecting to login..." });
      setTimeout(() => navigate("/"), 1200);
    } catch (e) {
      console.error(e);
      setMsg({ type: "danger", text: e?.response?.data || "Registration failed" });
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520, marginTop: 80 }}>
      <div className="card shadow p-4">
        <h4 className="mb-3">Create an account</h4>
        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        <input className="form-control mb-2" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
        <input className="form-control mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="form-control mb-3" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

        <button className="btn btn-danger w-100" onClick={register}>Sign up</button>
        <div className="text-center mt-3">
          <small>Already have an account? <a href="/">Login</a></small>
        </div>
      </div>
    </div>
  );
}

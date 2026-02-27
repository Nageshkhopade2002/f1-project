// src/context/AuthProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { parseJwt, isTokenExpired } from "../utils/jwt";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      const t = localStorage.getItem("token");
      const raw = t ? (() => { try { return JSON.parse(t).token ? JSON.parse(t).token : t; } catch { return t; } })() : null;
      return raw ? parseJwt(raw) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (token) {
      const raw = (() => {
        try {
          const parsed = JSON.parse(token);
          return parsed && parsed.token ? parsed.token : token;
        } catch { return token; }
      })();
      if (isTokenExpired(raw)) {
        logout();
      } else {
        setUser(parseJwt(raw));
      }
    } else {
      setUser(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = (respToken) => {
    // respToken may be a raw string or an object { token: '...' }
    const store = (typeof respToken === "string") ? respToken : JSON.stringify(respToken);
    localStorage.setItem("token", store);
    setToken(store);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/", { replace: true });
  };

  const value = { token, user, login, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

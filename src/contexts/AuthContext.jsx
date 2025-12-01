import React, { createContext, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [userId, setUserId] = useState(() => localStorage.getItem("user_id"));

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");

    if (role) localStorage.setItem("role", role);
    else localStorage.removeItem("role");

    if (userId) localStorage.setItem("user_id", userId);
    else localStorage.removeItem("user_id");
  }, [token, role, userId]);

  const login = ({ token: t, role: r, user_id }) => {
    setToken(t);
    setRole(r);
    setUserId(user_id?.toString?.() ?? user_id);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);
    // simple redirect to login
    window.location.replace("/");
  };

  return (
    <AuthContext.Provider value={{ token, role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

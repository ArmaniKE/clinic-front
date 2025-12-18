import { createContext, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const getStoredToken = () => {
    const stored = localStorage.getItem("token");
    return stored && stored.trim().length > 0 ? stored : null;
  };

  const [token, setToken] = useState(getStoredToken);
  const [role, setRole] = useState(() => {
    const storedToken = getStoredToken();
    const storedRole = localStorage.getItem("role");
    return storedToken ? storedRole : null;
  });
  const [userId, setUserId] = useState(() => {
    const storedToken = getStoredToken();
    const storedUserId = localStorage.getItem("user_id");
    return storedToken ? storedUserId : null;
  });
  const [fullName, setFullName] = useState(() => {
    const storedToken = getStoredToken();
    const storedFullName = localStorage.getItem("full_name");
    return storedToken ? storedFullName : null;
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken || storedToken.trim().length === 0) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user_id");
      localStorage.removeItem("full_name");
      setToken(null);
      setRole(null);
      setUserId(null);
      setFullName(null);
    }
  }, []);

  useEffect(() => {
    if (token && token.trim().length > 0) {
      localStorage.setItem("token", token);
      if (role) localStorage.setItem("role", role);
      if (userId) localStorage.setItem("user_id", userId);
      if (fullName) localStorage.setItem("full_name", fullName);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user_id");
      localStorage.removeItem("full_name");
      setRole(null);
      setUserId(null);
      setFullName(null);
    }
  }, [token, role, userId, fullName]);

  const login = ({ token: t, role: r, user_id, full_name }) => {
    setToken(t);
    setRole(r);
    setUserId(user_id?.toString?.() ?? user_id);
    setFullName(full_name || null);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);
    setFullName(null);
    window.location.replace("/");
  };

  return (
    <AuthContext.Provider value={{ token, role, userId, fullName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem("adminData");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (adminData, token) => {
    localStorage.setItem("adminData", JSON.stringify(adminData));
    localStorage.setItem("adminToken", token);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem("adminData");
    localStorage.removeItem("adminToken");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
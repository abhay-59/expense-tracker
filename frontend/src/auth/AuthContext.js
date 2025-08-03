// src/auth/AuthContext.js

import { createContext, useContext, useState } from 'react';

// ✅ Create a context to store authentication data
const AuthContext = createContext();

// ✅ AuthProvider component that wraps around your app
export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage if present
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem('user');
    return localUser ? JSON.parse(localUser) : null;
  });

  // ✅ Modified login function to include setUser
  const login = (data) => {
    setUser(data); // <-- Set user in context
    localStorage.setItem('user', JSON.stringify(data)); // Persist to localStorage
  };

  // ✅ Logout function clears context and storage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    // ✅ Now also exporting setUser for Login.js to use
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for components to access auth context easily
export const useAuth = () => useContext(AuthContext);

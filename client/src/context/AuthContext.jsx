/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const getSavedUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

const getSavedTheme = () => localStorage.getItem('darkMode') === 'true';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);
  const [loading] = useState(false);
  const [darkMode, setDarkMode] = useState(getSavedTheme);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : '');
  }, [darkMode]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const toggleDarkMode = () => setDarkMode((current) => !current);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

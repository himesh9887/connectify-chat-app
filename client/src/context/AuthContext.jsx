import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedTheme = localStorage.getItem('darkMode');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedTheme === 'true') {
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    setLoading(false);
  }, []);

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

  const toggleDarkMode = () => setDarkMode(!darkMode);

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


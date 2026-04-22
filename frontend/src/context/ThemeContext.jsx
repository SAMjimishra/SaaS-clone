/**
 * ╔══════════════════════════════════════════════╗
 * ║   PAIA — Theme Context                       ║
 * ║   Day/Night mode with localStorage persist   ║
 * ╚══════════════════════════════════════════════╝
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Read saved preference, default to dark
    return localStorage.getItem('paia-theme') || 'dark';
  });

  // Apply theme attribute to <html> whenever it changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    // Update color-scheme for native elements
    root.style.colorScheme = theme;
    localStorage.setItem('paia-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export default useTheme;

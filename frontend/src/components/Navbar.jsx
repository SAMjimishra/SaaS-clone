import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut, Sun, Moon, Menu } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import useTheme from '../context/ThemeContext';

const Navbar = ({ onMenuClick }) => {
  const { user, logout, getInitials } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="app-topbar">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button className="mobile-menu-toggle" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
        
        <Link to="/dashboard" className="topbar-logo">
          <div className="topbar-logo-box">
            <Shield size={14} color="#fff" strokeWidth={2.2} />
          </div>

          <div className="topbar-brand-wrap">
            <span className="topbar-brand">PAIA</span>
            <span className="topbar-sub">Security Platform</span>
          </div>
        </Link>
      </div>

      <div className="topbar-right">
        {/* Day/Night Toggle */}
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Day Mode' : 'Switch to Night Mode'}
          aria-label="Toggle theme"
        >
          <div className="theme-toggle-track">
            <div className={`theme-toggle-thumb ${isDark ? 'night' : 'day'}`}>
              {isDark ? <Moon size={12} /> : <Sun size={12} />}
            </div>
            <Sun size={9} className="theme-icon-sun" />
            <Moon size={9} className="theme-icon-moon" />
          </div>
        </button>

        {/* User Profile Card */}
        <div className="user-profile-card">
          <Link to="/profile" className="user-info-section">
            <div className="user-avatar">
              {getInitials(user?.name)}
            </div>

            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </Link>

          <div className="user-card-sep" />

          <button className="user-logout-btn" onClick={handleLogout} title="Sign out">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

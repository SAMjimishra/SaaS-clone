import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ScanLine, FileText, Shield, Users,
  BrainCircuit, Globe, X, LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';

const NavItem = ({ to, icon: Icon, label, badge, badgeClass, disabled = false, onClick }) => {
  const content = (
    <div 
      className={`nav-link-inner ${disabled ? 'disabled' : ''}`}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
    >
      <div className="nav-link-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Icon size={15} /><span>{label}</span></div>
      {badge && <span className={`nav-badge ${badgeClass || (disabled ? 'soon' : '')}`}>{badge}</span>}
    </div>
  );

  if (disabled) {
    return <div className="nav-link disabled">{content}</div>;
  }
  return (
    <NavLink 
      to={to} 
      onClick={onClick}
      className={({ isActive }) => `nav-link${isActive ? ' nav-active active hover-lift' : ''}`} 
      style={{ display: 'block' }}
    >
      {content}
    </NavLink>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, getInitials } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
    if (onClose) onClose();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : ''}`} style={{ zIndex: 9999 }}>
      {/* Mobile Header */}
      <div className="sidebar-mobile-header">
        <div className="sidebar-mobile-logo">PAIA</div>
        <button className="sidebar-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="sidebar-scroll-area">
        
        {/* Workspace */}
        <div className="sidebar-group">
          <div className="sidebar-section-title">Workspace</div>
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={onClose} />
        </div>

        {/* Operations */}
        <div className="sidebar-group">
          <div className="sidebar-section-title">Operations</div>
          <NavItem to="/scans" icon={ScanLine} label="Scan Center" onClick={onClose} />
          <NavItem to="/ai-agent" icon={BrainCircuit} label="AI Agent" badge="AI" onClick={onClose} />
          <NavItem to="/threat-intel" icon={Globe} label="Threat Intel" onClick={onClose} />
        </div>

        {/* Intelligence */}
        <div className="sidebar-group">
          <div className="sidebar-section-title">Intelligence</div>
          <NavItem to="/reports" icon={FileText} label="Reports" onClick={onClose} />
          <NavItem to="/profile" icon={Shield} label="Security" onClick={onClose} />
        </div>

        {user?.role === 'admin' && (
          <div className="sidebar-group">
            <div className="sidebar-section-title">Admin</div>
            <NavItem to="/admin/users" icon={Users} label="User Mgmt" disabled badge="Soon" badgeClass="soon" />
          </div>
        )}
      </div>

      {/* User Section at Bottom */}
      <div className="sidebar-footer">
        <div className="sidebar-user-info">
          <div className="sidebar-user-avatar">{getInitials(user?.username || user?.name || 'US')}</div>
          <div className="sidebar-user-details">
            <div className="sidebar-username">{user?.username || user?.name || 'User'}</div>
            <div className="sidebar-user-role">{user?.role || 'Guest'}</div>
          </div>
        </div>
        <button className="sidebar-logout-btn" onClick={handleLogout} title="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

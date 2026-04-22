/**
 * ╔══════════════════════════════════════════════╗
 * ║   PAIA — Layout Wrapper (GOD-TIER v4)       ║
 * ║   CyberBackground + Navbar + Sidebar + Main ║
 * ╚══════════════════════════════════════════════╝
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar          from './Navbar';
import Sidebar         from './Sidebar';
import CyberBackground from './CyberBackground';

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <CyberBackground />
      <Navbar onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
      
      <div style={{ display: 'flex', flex: 1, position: 'relative', zIndex: 1 }}>
        <div 
          className={`sidebar-backdrop ${isSidebarOpen ? 'show' : ''}`} 
          onClick={() => setSidebarOpen(false)} 
        />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="main-content" style={{ width: '100%' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
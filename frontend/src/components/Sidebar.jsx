import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, BookOpen, FileText, Sparkles, Calendar, Scale, User, Sun, Moon, LogOut, GraduationCap } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-logo">
          <GraduationCap size={22} />
        </div>
        <div className="brand-title">PrepPortal</div>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/" end className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/applications" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
          <Briefcase size={18} />
          <span>Applications</span>
        </NavLink>

        <NavLink to="/ai-prep" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
          <Sparkles size={18} />
          <span>AI Interview Prep</span>
        </NavLink>

        <NavLink to="/calendar" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
          <Calendar size={18} />
          <span>Schedule Calendar</span>
        </NavLink>

        <NavLink to="/offer-compare" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
          <Scale size={18} />
          <span>Offer Comparison</span>
        </NavLink>

        <NavLink to="/resources" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
          <BookOpen size={18} />
          <span>Prep Resources</span>
        </NavLink>

        <NavLink to="/resume-builder" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
          <FileText size={18} />
          <span>Resume Builder</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={toggleSidebar}>
          <User size={18} />
          <span>User Profile</span>
        </NavLink>
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button className="menu-item" onClick={toggleTheme} style={{ width: '100%', justifyContent: 'flex-start' }}>
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#06C3B4" />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button className="menu-item" onClick={logout} style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--danger)' }}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

import React, { useContext } from 'react';
import { Menu, Sun, Moon, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = ({ toggleSidebar, title }) => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={toggleSidebar}
          style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
          className="mobile-menu-btn"
        >
          <Menu size={24} />
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{title || 'Dashboard'}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={toggleTheme}
          className="btn btn-secondary btn-sm"
          title="Toggle Theme"
          style={{ borderRadius: '50%', width: '38px', height: '38px', padding: 0, justifyContent: 'center' }}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0.8rem', background: 'var(--bg-surface-hover)', borderRadius: '9999px', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

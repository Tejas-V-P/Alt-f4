import React, { useState } from 'react';
import { X, Github, CheckCircle2, User, Mail, ShieldCheck } from 'lucide-react';

const SocialAuthModal = ({ isOpen, onClose, provider, onAuthenticate }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const isGoogle = provider === 'google';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setSubmitting(true);
      const computedName = name.trim() || email.split('@')[0].replace('.', ' ');
      const formattedName = computedName.charAt(0).toUpperCase() + computedName.slice(1);

      await onAuthenticate({
        email: email.trim(),
        name: formattedName,
        [isGoogle ? 'googleId' : 'githubId']: `${provider}_${Date.now()}`,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email.trim()}`
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '440px',
          background: isGoogle ? 'var(--bg-card)' : 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {isGoogle ? (
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            ) : (
              <Github size={24} />
            )}
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>
              {isGoogle ? 'Google Account Chooser' : 'GitHub OAuth Sign In'}
            </span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ borderRadius: '50%', padding: '0.4rem' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ background: 'var(--bg-surface-hover)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
          <ShieldCheck size={18} color="var(--success)" />
          <span>Select or enter your {isGoogle ? 'Google' : 'GitHub'} email to authenticate directly.</span>
        </div>

        {/* Quick Accounts Preset Options */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Choose an account:</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.4rem' }}>
            {[
              { label: 'Student Account', defaultEmail: 'student@gmail.com', defaultName: 'Student User' },
              { label: 'College Account', defaultEmail: 'placement.prep@college.edu', defaultName: 'Placement Candidate' }
            ].map((acc) => (
              <button
                key={acc.defaultEmail}
                type="button"
                className="menu-item"
                style={{
                  width: '100%',
                  justify: 'space-between',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface)',
                  padding: '0.65rem 0.85rem'
                }}
                onClick={() => {
                  setEmail(acc.defaultEmail);
                  setName(acc.defaultName);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isGoogle ? '#ea4335' : '#24292e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>
                    {acc.defaultName.charAt(0)}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{acc.defaultName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{acc.defaultEmail}</div>
                  </div>
                </div>
                <CheckCircle2 size={16} color={email === acc.defaultEmail ? 'var(--primary)' : 'var(--text-subtle)'} />
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{isGoogle ? 'Google Email *' : 'GitHub Email *'}</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder={isGoogle ? 'your.name@gmail.com' : 'username@github.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name (Optional)</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="e.g. Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !email.trim()}
              style={{
                backgroundColor: isGoogle ? '#4285F4' : '#24292e',
                color: '#fff'
              }}
            >
              {submitting ? 'Authenticating...' : `Continue with ${isGoogle ? 'Google' : 'GitHub'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SocialAuthModal;

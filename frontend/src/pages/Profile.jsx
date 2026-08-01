import React, { useContext, useState, useEffect } from 'react';
import { User, Mail, Calendar, LogOut, ShieldCheck, Award, Briefcase, Linkedin, Github, ExternalLink, Edit3, Save, CheckCircle2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

const Profile = () => {
  const { user, updateUser, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalApplied: 0, totalOffers: 0 });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    linkedinUrl: user?.linkedinUrl || '',
    githubUrl: user?.githubUrl || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        linkedinUrl: user.linkedinUrl || '',
        githubUrl: user.githubUrl || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await axiosClient.get('/applications');
        if (res.data.stats) {
          setStats({
            totalApplied: res.data.stats.totalApplied || 0,
            totalOffers: res.data.stats.totalOffers || 0
          });
        }
      } catch (err) {
        console.error('Error fetching user stats:', err);
      }
    };
    fetchUserStats();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await axiosClient.put('/auth/profile', formData);
      updateUser(res.data.user);
      setSuccessMsg('Profile links updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Student Profile</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
          Manage your personal placement details and professional links.
        </p>
      </div>

      {successMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          {successMsg}
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="card cursor-target" style={{ marginBottom: '1.5rem', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), #05AC9E)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{user?.name || 'Student User'}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              <Mail size={16} />
              <span>{user?.email}</span>
            </div>

            {/* Quick Action Profile Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.65rem', background: 'var(--success-light)', color: 'var(--success)', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                <ShieldCheck size={14} /> Verified Student Account
              </div>

              {user?.linkedinUrl && (
                <a
                  href={user.linkedinUrl.startsWith('http') ? user.linkedinUrl : `https://${user.linkedinUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.65rem', background: '#0077b515', color: '#0077b5', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}
                >
                  <Linkedin size={14} /> LinkedIn <ExternalLink size={11} />
                </a>
              )}

              {user?.githubUrl && (
                <a
                  href={user.githubUrl.startsWith('http') ? user.githubUrl : `https://${user.githubUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.65rem', background: 'var(--bg-surface-hover)', color: 'var(--text-main)', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', border: '1px solid var(--border-color)' }}
                >
                  <Github size={14} /> GitHub <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="card cursor-target" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--blue-light)', color: 'var(--blue)' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Applications Submitted</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.totalApplied}</div>
          </div>
        </div>

        <div className="card cursor-target" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--success-light)', color: 'var(--success)' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Offers Received</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.totalOffers}</div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="card cursor-target" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Edit3 size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Professional Profile Links</h3>
        </div>

        <form onSubmit={handleProfileSave}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">LinkedIn Profile URL</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Linkedin size={20} color="#0077b5" />
              <input
                type="text"
                className="form-input"
                placeholder="https://linkedin.com/in/yourname"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">GitHub Profile URL</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Github size={20} color="var(--text-main)" />
              <input
                type="text"
                className="form-input"
                placeholder="https://github.com/yourusername"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={18} />
              {saving ? 'Saving Links...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Logout Card */}
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Need to sign out of your account on this device?
        </p>
        <button className="btn btn-danger" onClick={logout}>
          <LogOut size={18} />
          Sign Out of Account
        </button>
      </div>
    </div>
  );
};

export default Profile;

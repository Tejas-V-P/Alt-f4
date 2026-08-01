import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, Award, XCircle, Plus, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import StatusBadge from '../components/StatusBadge';
import ChartSection from '../components/ChartSection';
import ApplicationModal from '../components/ApplicationModal';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalApplied: 0,
    totalActive: 0,
    totalOffers: 0,
    totalRejected: 0,
    byStatus: {
      'Applied': 0,
      'Online Assessment': 0,
      'Technical Interview': 0,
      'HR Interview': 0,
      'Selected': 0,
      'Rejected': 0
    }
  });

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/applications');
      setApplications(res.data.applications || []);
      if (res.data.stats) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddApplication = async (formData) => {
    await axiosClient.post('/applications', formData);
    fetchDashboardData();
  };

  return (
    <div>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Your placement season, summarised.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add Application
        </button>
      </div>

      {/* Mandatory Requirements Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="stat-card blue">
          <div className="stat-info">
            <div className="stat-label">Total Applied</div>
            <div className="stat-value">{stats.totalApplied}</div>
          </div>
          <div className="stat-icon blue">
            <Briefcase size={24} />
          </div>
        </div>

        <div className="stat-card amber">
          <div className="stat-info">
            <div className="stat-label">Active Applications</div>
            <div className="stat-value">{stats.totalActive}</div>
          </div>
          <div className="stat-icon amber">
            <Clock size={24} />
          </div>
        </div>

        <div className="stat-card emerald">
          <div className="stat-info">
            <div className="stat-label">Total Offers</div>
            <div className="stat-value">{stats.totalOffers}</div>
          </div>
          <div className="stat-icon emerald">
            <Award size={24} />
          </div>
        </div>

        <div className="stat-card rose">
          <div className="stat-info">
            <div className="stat-label">Rejected</div>
            <div className="stat-value">{stats.totalRejected}</div>
          </div>
          <div className="stat-icon rose">
            <XCircle size={24} />
          </div>
        </div>
      </div>

      {/* Middle Grid: Charts & Recent Applications */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Visual Chart Breakdown (Bonus Feature) */}
        <div>
          <ChartSection stats={stats} />
        </div>

        {/* Quick Tips / Quick Actions Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'var(--success-light)', color: 'var(--success)' }}>
                <Sparkles size={18} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Placement Preparation Pro-Tip</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Maintain detailed notes for each interview round! Reviewing past technical questions before your next interview round improves success rates by up to 40%.
            </p>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/applications" className="btn btn-secondary btn-sm">
              View All Applications
              <ArrowRight size={14} />
            </Link>
            <Link to="/resources" className="btn btn-primary btn-sm">
              Explore Prep Resources
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Applications</h3>
          <Link to="/applications" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>
            View All →
          </Link>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>Loading recent applications...</p>
        ) : applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
            <Briefcase size={36} style={{ opacity: 0.4, marginBottom: '0.75rem' }} />
            <p style={{ fontWeight: 600 }}>No company applications recorded yet.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Click "Add Application" to get started.</p>
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map((app) => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: 700 }}>{app.companyName}</td>
                    <td>{app.role}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{app.applicationDate}</td>
                    <td><StatusBadge status={app.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Creation Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddApplication}
      />
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Download, Edit, Trash2, Star, Calendar, MapPin, DollarSign, FileText, CalendarPlus } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import StatusBadge from '../components/StatusBadge';
import ApplicationModal from '../components/ApplicationModal';
import { exportToCSV } from '../utils/exportCsv';
import { buildGoogleCalendarUrl } from '../utils/calendarUtils';

const STATUS_FILTERS = [
  'All',
  'Applied',
  'Online Assessment',
  'Technical Interview',
  'HR Interview',
  'Selected',
  'Rejected'
];

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [onlyWishlist, setOnlyWishlist] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (onlyWishlist) params.wishlist = '1';

      const res = await axiosClient.get('/applications', { params });
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchApplications();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedStatus, onlyWishlist]);

  const handleCreateOrUpdate = async (formData) => {
    if (editingApp) {
      await axiosClient.put(`/applications/${editingApp.id}`, formData);
    } else {
      await axiosClient.post('/applications', formData);
    }
    fetchApplications();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company application?')) {
      try {
        await axiosClient.delete(`/applications/${id}`);
        fetchApplications();
      } catch (err) {
        alert('Failed to delete application.');
      }
    }
  };

  const handleToggleWishlist = async (app) => {
    try {
      await axiosClient.put(`/applications/${app.id}`, {
        isWishlist: !app.isWishlist
      });
      fetchApplications();
    } catch (err) {
      console.error('Failed to update wishlist status', err);
    }
  };

  const openAddModal = () => {
    setEditingApp(null);
    setIsModalOpen(true);
  };

  const openEditModal = (app) => {
    setEditingApp(app);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Company Application Tracker</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Manage and monitor all your campus job applications in one place.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => exportToCSV(applications)}>
            <Download size={18} />
            Export CSV
          </button>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} />
            Add Application
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Search by company name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '200px' }}>
            <Filter size={18} color="var(--text-muted)" />
            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {STATUS_FILTERS.map((st) => (
                <option key={st} value={st}>
                  {st === 'All' ? 'All Statuses' : st}
                </option>
              ))}
            </select>
          </div>

          {/* Wishlist Toggle */}
          <button
            className={`btn ${onlyWishlist ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setOnlyWishlist(!onlyWishlist)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Star size={16} fill={onlyWishlist ? '#fff' : 'none'} />
            Starred Only
          </button>
        </div>
      </div>

      {/* Applications Table View */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading company applications...
          </div>
        ) : applications.length === 0 ? (
          <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Search size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>No matching applications found</h4>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}></th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Notes / Location</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <button
                        onClick={() => handleToggleWishlist(app)}
                        style={{ color: app.isWishlist ? '#f59e0b' : 'var(--text-subtle)', cursor: 'pointer' }}
                        title={app.isWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <Star size={18} fill={app.isWishlist ? '#f59e0b' : 'none'} />
                      </button>
                    </td>
                    <td style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      {app.companyName}
                    </td>
                    <td style={{ fontWeight: 500 }}>{app.role}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={14} />
                        {app.applicationDate}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '250px' }}>
                      {app.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginBottom: '0.2rem' }}>
                          <MapPin size={12} /> {app.location}
                        </div>
                      )}
                      {app.notes ? (
                        <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {app.notes}
                        </span>
                      ) : (
                        <span style={{ fontStyle: 'italic', color: 'var(--text-subtle)' }}>No notes added</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        {['Technical Interview', 'HR Interview', 'Online Assessment'].includes(app.status) && (
                          <a
                            href={buildGoogleCalendarUrl({
                              title: `${app.status} - ${app.role}`,
                              companyName: app.companyName,
                              eventType: app.status,
                              eventDate: app.applicationDate,
                              time: '10:00 AM',
                              notes: app.notes,
                              location: app.location
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary btn-sm"
                            title="Add to Google Calendar"
                            style={{ color: 'var(--primary)' }}
                          >
                            <CalendarPlus size={14} />
                          </a>
                        )}
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEditModal(app)}
                          title="Edit application"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(app.id)}
                          title="Delete application"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateOrUpdate}
        application={editingApp}
      />
    </div>
  );
};

export default Applications;

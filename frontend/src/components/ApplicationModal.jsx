import React, { useState, useEffect } from 'react';
import { X, Building, Briefcase, Calendar, FileText, Star, MapPin, DollarSign } from 'lucide-react';

const STATUS_OPTIONS = [
  'Applied',
  'Online Assessment',
  'Technical Interview',
  'HR Interview',
  'Selected',
  'Rejected'
];

const ApplicationModal = ({ isOpen, onClose, onSave, application }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    applicationDate: new Date().toISOString().split('T')[0],
    status: 'Applied',
    notes: '',
    isWishlist: false,
    salary: '',
    location: ''
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (application) {
      setFormData({
        companyName: application.companyName || '',
        role: application.role || '',
        applicationDate: application.applicationDate || new Date().toISOString().split('T')[0],
        status: application.status || 'Applied',
        notes: application.notes || '',
        isWishlist: Boolean(application.isWishlist),
        salary: application.salary || '',
        location: application.location || ''
      });
    } else {
      setFormData({
        companyName: '',
        role: '',
        applicationDate: new Date().toISOString().split('T')[0],
        status: 'Applied',
        notes: '',
        isWishlist: false,
        salary: '',
        location: ''
      });
    }
    setError('');
  }, [application, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.role.trim() || !formData.applicationDate) {
      setError('Company Name, Role, and Application Date are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{application ? 'Edit Application' : 'Add New Application'}</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ borderRadius: '50%', padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Company Name *</label>
            <input
              type="text"
              name="companyName"
              className="form-input"
              placeholder="e.g. Google, Microsoft, Amazon"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Role / Position *</label>
              <input
                type="text"
                name="role"
                className="form-input"
                placeholder="e.g. Software Engineer, SDE-1"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Application Date *</label>
              <input
                type="date"
                name="applicationDate"
                className="form-input"
                value={formData.applicationDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Current Status *</label>
              <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location (Optional)</label>
              <input
                type="text"
                name="location"
                className="form-input"
                placeholder="e.g. Bengaluru, Remote"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Salary / CTC (Optional)</label>
              <input
                type="text"
                name="salary"
                className="form-input"
                placeholder="e.g. 18 LPA"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ justifyContent: 'center' }}>
              <label className="form-label" style={{ visibility: 'hidden' }}>Wishlist</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  name="isWishlist"
                  checked={formData.isWishlist}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                <Star size={16} color={formData.isWishlist ? '#f59e0b' : 'var(--text-muted)'} fill={formData.isWishlist ? '#f59e0b' : 'none'} />
                <span>Mark as Starred Wishlist</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes & Interview Preparation Stages</label>
            <textarea
              name="notes"
              className="form-textarea"
              rows={3}
              placeholder="e.g. Round 1 scheduled on Friday, topics: Graphs & System Design..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : application ? 'Update Application' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;

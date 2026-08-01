import React, { useState } from 'react';
import { X } from 'lucide-react';

const CATEGORY_OPTIONS = [
  'DSA',
  'Aptitude',
  'Resume',
  'Interview Experience',
  'Core Subjects'
];

const ResourceModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'DSA',
    link: '',
    description: ''
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.link.trim()) {
      setError('Title and Link are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onSave(formData);
      setFormData({ title: '', category: 'DSA', link: '', description: '' });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save resource.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add Preparation Resource</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ borderRadius: '50%', padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Resource Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. Striver's SDE Sheet, NeetCode 150, OS Cheat Sheet"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">URL Link *</label>
            <input
              type="url"
              name="link"
              className="form-input"
              placeholder="https://..."
              value={formData.link}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              name="description"
              className="form-textarea"
              rows={3}
              placeholder="Brief description or key topics covered..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceModal;

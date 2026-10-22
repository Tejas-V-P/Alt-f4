import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Trash2, Clock, MapPin, CheckCircle2, X, ExternalLink, CalendarPlus, Download } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { buildGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarUtils';

const EVENT_TYPES = [
  'Online Assessment',
  'Technical Interview',
  'HR Interview',
  'Application Deadline'
];

const PlacementCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [syncToGoogleOnSave, setSyncToGoogleOnSave] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    eventType: 'Technical Interview',
    eventDate: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    notes: ''
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/prep/events');
      setEvents(res.data.events || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.companyName.trim() || !formData.eventDate) return;

    try {
      const payload = { ...formData };
      await axiosClient.post('/prep/events', payload);
      
      // If user opted to add to Google Calendar in real time, open Google Calendar immediately
      if (syncToGoogleOnSave) {
        const gcalUrl = buildGoogleCalendarUrl(payload);
        window.open(gcalUrl, '_blank', 'noopener,noreferrer');
      }

      setFormData({
        title: '',
        companyName: '',
        eventType: 'Technical Interview',
        eventDate: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        notes: ''
      });
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      alert('Failed to add event.');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Delete this calendar event?')) {
      try {
        await axiosClient.delete(`/prep/events/${id}`);
        fetchEvents();
      } catch (err) {
        alert('Failed to delete event.');
      }
    }
  };

  const getEventBadgeColor = (type) => {
    switch (type) {
      case 'Online Assessment':
        return { bg: 'var(--blue-light)', color: 'var(--blue)' };
      case 'Technical Interview':
        return { bg: 'var(--purple-light)', color: 'var(--purple)' };
      case 'HR Interview':
        return { bg: 'var(--warning-light)', color: 'var(--warning)' };
      case 'Application Deadline':
        return { bg: 'var(--danger-light)', color: 'var(--danger)' };
      default:
        return { bg: 'var(--primary-light)', color: 'var(--primary)' };
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Placement Schedule & Calendar</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Never miss an Online Assessment test, interview slot, or application deadline.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add Schedule Event
        </button>
      </div>

      {/* Events Timeline List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading schedule...
        </div>
      ) : events.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <CalendarIcon size={44} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>No scheduled events yet</h4>
          <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Click "Add Schedule Event" to log upcoming test dates or interviews.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {events.map((ev) => {
            const badge = getEventBadgeColor(ev.eventType);
            return (
              <div key={ev.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '9999px', background: badge.bg, color: badge.color, textTransform: 'uppercase' }}>
                      {ev.eventType}
                    </span>
                    <button onClick={() => handleDeleteEvent(ev.id)} style={{ color: 'var(--text-subtle)', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                    {ev.title}
                  </h3>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.85rem' }}>
                    {ev.companyName}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CalendarIcon size={14} />
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{ev.eventDate}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={14} />
                      <span>{ev.time}</span>
                    </div>
                  </div>

                  {ev.notes && (
                    <p style={{ marginTop: '0.85rem', fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem' }}>
                      {ev.notes}
                    </p>
                  )}
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    title="Download .ics file (Outlook, Apple Calendar)"
                    onClick={() => downloadIcsFile(ev)}
                    style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                  >
                    <Download size={14} />
                    .ICS
                  </button>
                  <a
                    href={buildGoogleCalendarUrl(ev)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                  >
                    <CalendarPlus size={14} />
                    Google Calendar
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add Schedule Event</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setIsModalOpen(false)} style={{ borderRadius: '50%', padding: '0.4rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddEvent}>
              <div className="form-group">
                <label className="form-label">Event Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Round 1 Online Coding Assessment"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Google"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Event Type *</label>
                  <select
                    className="form-select"
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Event Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="10:00 AM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Instructions, meeting links, or topics to prepare..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              {/* Real-time Google Calendar Option */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer'
                }}
                onClick={() => setSyncToGoogleOnSave(!syncToGoogleOnSave)}
              >
                <input
                  type="checkbox"
                  id="syncGoogleCal"
                  checked={syncToGoogleOnSave}
                  onChange={(e) => setSyncToGoogleOnSave(e.target.checked)}
                  style={{ width: '1.1rem', height: '1.1rem', cursor: 'pointer' }}
                  onClick={(e) => e.stopPropagation()}
                />
                <label htmlFor="syncGoogleCal" style={{ cursor: 'pointer', margin: 0, fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 600, display: 'block', color: 'var(--text-main)' }}>
                    Add directly to Google Calendar in real time
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Automatically opens Google Calendar with event details, reminders, and date/time pre-filled upon saving.
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementCalendar;

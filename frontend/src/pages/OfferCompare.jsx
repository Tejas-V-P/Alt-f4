import React, { useState, useEffect } from 'react';
import { Scale, Award, Plus, Trash2, CheckCircle2, DollarSign, MapPin, Building, Briefcase, X } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const OfferCompare = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newOffer, setNewOffer] = useState({
    company: '',
    role: '',
    ctc: '',
    base: '',
    stocks: '',
    joiningBonus: '',
    location: '',
    workMode: 'Hybrid',
    rating: '4.5 / 5'
  });

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/offers');
      setOffers(res.data.offers || []);
    } catch (err) {
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleAddOffer = async (e) => {
    e.preventDefault();
    if (!newOffer.company.trim() || !newOffer.role.trim() || !newOffer.ctc.trim()) return;

    try {
      await axiosClient.post('/offers', newOffer);
      setNewOffer({
        company: '',
        role: '',
        ctc: '',
        base: '',
        stocks: '',
        joiningBonus: '',
        location: '',
        workMode: 'Hybrid',
        rating: '4.5 / 5'
      });
      setShowAddForm(false);
      fetchOffers();
    } catch (err) {
      alert('Failed to save offer.');
    }
  };

  const handleDeleteOffer = async (id) => {
    if (window.confirm('Delete this offer from comparison matrix?')) {
      try {
        await axiosClient.delete(`/offers/${id}`);
        fetchOffers();
      } catch (err) {
        alert('Failed to delete offer.');
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Offer Comparison Matrix</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Compare multiple job offers side-by-side to evaluate compensation, location, and perks.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={18} />
          {showAddForm ? 'Close Form' : 'Add Offer to Matrix'}
        </button>
      </div>

      {/* Add Offer Form Card */}
      {showAddForm && (
        <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Add New Offer Details</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowAddForm(false)} style={{ borderRadius: '50%', padding: '0.4rem' }}>
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleAddOffer}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input type="text" className="form-input" placeholder="e.g. Google, Microsoft" value={newOffer.company} onChange={e => setNewOffer({ ...newOffer, company: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Role Title *</label>
                <input type="text" className="form-input" placeholder="e.g. SDE-1" value={newOffer.role} onChange={e => setNewOffer({ ...newOffer, role: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Total CTC *</label>
                <input type="text" className="form-input" placeholder="e.g. 22 LPA" value={newOffer.ctc} onChange={e => setNewOffer({ ...newOffer, ctc: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Base Salary</label>
                <input type="text" className="form-input" placeholder="e.g. 16 LPA" value={newOffer.base} onChange={e => setNewOffer({ ...newOffer, base: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Stocks / RSUs</label>
                <input type="text" className="form-input" placeholder="e.g. 4 Lakhs" value={newOffer.stocks} onChange={e => setNewOffer({ ...newOffer, stocks: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Joining Bonus</label>
                <input type="text" className="form-input" placeholder="e.g. 2 Lakhs" value={newOffer.joiningBonus} onChange={e => setNewOffer({ ...newOffer, joiningBonus: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input type="text" className="form-input" placeholder="e.g. Bengaluru" value={newOffer.location} onChange={e => setNewOffer({ ...newOffer, location: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Work Mode</label>
                <select className="form-select" value={newOffer.workMode} onChange={e => setNewOffer({ ...newOffer, workMode: e.target.value })}>
                  <option value="Full Remote">Full Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save to Matrix</button>
            </div>
          </form>
        </div>
      )}

      {/* Comparison Grid Matrix */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading offer matrix...
        </div>
      ) : offers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <Scale size={44} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>No offers to compare</h4>
          <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Click "Add Offer to Matrix" to add and save job offers.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`, gap: '1.5rem' }}>
          {offers.map((off, index) => (
            <div
              key={off.id}
              className="card cursor-target"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                border: index === 0 ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                boxShadow: index === 0 ? '0 8px 24px rgba(6, 195, 180, 0.2)' : 'var(--shadow-sm)',
                padding: '1.75rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    {index === 0 && (
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: 'linear-gradient(135deg, #06C3B4, #05AC9E)',
                          color: '#ffffff',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.725rem',
                          fontWeight: 800,
                          letterSpacing: '0.04em',
                          marginBottom: '0.6rem',
                          boxShadow: '0 2px 8px rgba(6, 195, 180, 0.4)'
                        }}
                      >
                        <Award size={13} /> TOP CTC OFFER
                      </div>
                    )}
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>{off.company}</h3>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, marginTop: '0.1rem' }}>{off.role}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteOffer(off.id)}
                    style={{ color: 'var(--text-subtle)', cursor: 'pointer', background: 'none', border: 'none', padding: '0.2rem' }}
                    title="Remove Offer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ padding: '1rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>Total Compensation</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.1rem' }}>{off.ctc}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Base Salary:</span>
                    <span style={{ fontWeight: 700 }}>{off.base || 'N/A'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Stocks / RSUs:</span>
                    <span style={{ fontWeight: 700 }}>{off.stocks || 'N/A'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Joining Bonus:</span>
                    <span style={{ fontWeight: 700 }}>{off.joiningBonus || 'N/A'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                    <span style={{ fontWeight: 700 }}>{off.location || 'N/A'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Work Mode:</span>
                    <span style={{ fontWeight: 700 }}>{off.workMode || 'Hybrid'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfferCompare;

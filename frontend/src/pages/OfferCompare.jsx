import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Award, 
  Plus, 
  Trash2, 
  Clock, 
  Building2, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  X, 
  ArrowRightLeft,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import axiosClient from '../api/axiosClient';

// Helper to reliably parse currency / salary inputs (e.g. "22 LPA", "1800000", "22.5L", "$120,000", "24")
export const parseSalaryToNumber = (val) => {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return val;

  const raw = String(val).trim().toUpperCase();
  if (!raw) return 0;

  // Check for LPA / L / Lakhs pattern: e.g. "22 LPA", "22.5L", "22 LAKHS"
  const lpaMatch = raw.match(/([\d,.]+)\s*(?:LPA|LAKHS?|L\b)/);
  if (lpaMatch) {
    const num = parseFloat(lpaMatch[1].replace(/,/g, ''));
    return isNaN(num) ? 0 : num * 100000;
  }

  // Check for Cr / Crores: e.g. "1.2 CR"
  const crMatch = raw.match(/([\d,.]+)\s*(?:CR|CRORES?)/);
  if (crMatch) {
    const num = parseFloat(crMatch[1].replace(/,/g, ''));
    return isNaN(num) ? 0 : num * 10000000;
  }

  // Check for K: e.g. "120K"
  const kMatch = raw.match(/([\d,.]+)\s*K/);
  if (kMatch) {
    const num = parseFloat(kMatch[1].replace(/,/g, ''));
    return isNaN(num) ? 0 : num * 1000;
  }

  // Otherwise clean out all non-digits except decimal point
  const cleanNum = parseFloat(raw.replace(/[^0-9.]/g, ''));
  if (isNaN(cleanNum)) return 0;

  // If someone entered just e.g. 24 or 15 thinking in LPA:
  // Usually if < 150, it is LPA
  if (cleanNum > 0 && cleanNum <= 150) {
    return cleanNum * 100000;
  }

  return cleanNum;
};

// Formats number into readable LPA or INR string
export const formatSalaryDisplay = (numVal, rawFallback = '') => {
  const num = typeof numVal === 'number' ? numVal : parseSalaryToNumber(numVal);
  if (!num || isNaN(num)) return rawFallback || 'N/A';

  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} LPA`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
};

// Calculate daily working hours from "09:00 AM" to "06:00 PM"
export const calculateWorkHours = (startStr = '09:00 AM', endStr = '06:00 PM') => {
  try {
    const parseTime = (tStr) => {
      if (!tStr) return 9 * 60;
      // If 24hr "09:00" or 12hr "09:00 AM"
      const match12 = tStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (match12) {
        let hrs = parseInt(match12[1], 10);
        const mins = parseInt(match12[2], 10);
        const mer = match12[3]?.toUpperCase();
        if (mer === 'PM' && hrs < 12) hrs += 12;
        if (mer === 'AM' && hrs === 12) hrs = 0;
        return hrs * 60 + mins;
      }
      return 9 * 60;
    };

    const startMins = parseTime(startStr);
    const endMins = parseTime(endStr);
    let diff = endMins - startMins;
    if (diff < 0) diff += 24 * 60; // Over-midnight shifts
    const hrs = (diff / 60).toFixed(1);
    return `${hrs.replace('.0', '')} hrs/day`;
  } catch (err) {
    return '8-9 hrs/day';
  }
};

const OfferCompare = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Selected companies/roles for 1-to-1 deep comparison
  const [selectedOfferAId, setSelectedOfferAId] = useState('');
  const [selectedOfferBId, setSelectedOfferBId] = useState('');

  const [newOffer, setNewOffer] = useState({
    company: '',
    role: '',
    ctc: '',
    base: '',
    stocks: '',
    joiningBonus: '',
    location: '',
    workMode: 'Hybrid',
    workTimingStart: '09:00 AM',
    workTimingEnd: '06:00 PM'
  });

  const fetchOffers = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await axiosClient.get('/offers');
      const loaded = res.data.offers || [];
      setOffers(loaded);

      // Default select first two for side-by-side comparison if available
      if (loaded.length >= 2) {
        setSelectedOfferAId(prev => prev || loaded[0].id || loaded[0]._id);
        setSelectedOfferBId(prev => prev || loaded[1].id || loaded[1]._id);
      } else if (loaded.length === 1) {
        setSelectedOfferAId(prev => prev || loaded[0].id || loaded[0]._id);
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers(true);
  }, []);

  const handleAddOffer = async (e) => {
    e.preventDefault();
    if (!newOffer.company.trim() || !newOffer.role.trim() || !newOffer.ctc) return;

    try {
      setSubmitting(true);
      const res = await axiosClient.post('/offers', newOffer);
      const created = res.data?.offer;

      if (created) {
        setOffers(prev => [created, ...prev]);
        if (!selectedOfferAId) setSelectedOfferAId(created.id || created._id);
        else if (!selectedOfferBId && selectedOfferAId !== (created.id || created._id)) {
          setSelectedOfferBId(created.id || created._id);
        }
      } else {
        fetchOffers(false);
      }

      setNewOffer({
        company: '',
        role: '',
        ctc: '',
        base: '',
        stocks: '',
        joiningBonus: '',
        location: '',
        workMode: 'Hybrid',
        workTimingStart: '09:00 AM',
        workTimingEnd: '06:00 PM'
      });
      setShowAddForm(false);
    } catch (err) {
      alert('Failed to save offer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOffer = async (id) => {
    if (!window.confirm('Delete this offer from comparison matrix?')) return;

    try {
      // Optimistically remove from state immediately
      setOffers(prev => prev.filter(o => o.id !== id && o._id !== id));
      if (selectedOfferAId === id) setSelectedOfferAId('');
      if (selectedOfferBId === id) setSelectedOfferBId('');
      await axiosClient.delete(`/offers/${id}`);
    } catch (err) {
      alert('Failed to delete offer.');
      fetchOffers(false);
    }
  };

  // Sort offers by highest numerical CTC for ranking
  const sortedOffers = [...offers].sort((a, b) => {
    return parseSalaryToNumber(b.ctc) - parseSalaryToNumber(a.ctc);
  });

  const offerA = offers.find(o => (o.id || o._id) === selectedOfferAId);
  const offerB = offers.find(o => (o.id || o._id) === selectedOfferBId);

  const ctcA = offerA ? parseSalaryToNumber(offerA.ctc) : 0;
  const ctcB = offerB ? parseSalaryToNumber(offerB.ctc) : 0;
  const baseA = offerA ? parseSalaryToNumber(offerA.base) : 0;
  const baseB = offerB ? parseSalaryToNumber(offerB.base) : 0;

  const ctcDiff = Math.abs(ctcA - ctcB);
  const ctcWinner = ctcA > ctcB ? 'A' : ctcB > ctcA ? 'B' : 'TIE';

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Offer Comparison Matrix</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Compare multiple job offers side-by-side to evaluate compensation breakdown, work timings, and perks.
          </p>
        </div>
        <button 
          type="button"
          className="btn btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={18} />
          {showAddForm ? 'Close Form' : 'Add Offer to Matrix'}
        </button>
      </div>

      {/* Add Offer Form Card */}
      {showAddForm && (
        <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={20} color="var(--primary)" />
              Add New Offer Details
            </h3>
            <button 
              type="button"
              className="btn btn-secondary btn-sm" 
              onClick={() => setShowAddForm(false)} 
              style={{ borderRadius: '50%', padding: '0.4rem' }}
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleAddOffer}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {/* Company */}
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Google, Microsoft" 
                  value={newOffer.company} 
                  onChange={e => setNewOffer({ ...newOffer, company: e.target.value })} 
                  required 
                />
              </div>

              {/* Role */}
              <div className="form-group">
                <label className="form-label">Role Title *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. SDE-1 / Product Analyst" 
                  value={newOffer.role} 
                  onChange={e => setNewOffer({ ...newOffer, role: e.target.value })} 
                  required 
                />
              </div>

              {/* Total CTC */}
              <div className="form-group">
                <label className="form-label">Total CTC (Annual INR) *</label>
                <input 
                  type="number" 
                  min="0"
                  step="1000"
                  className="form-input" 
                  placeholder="e.g. 2400000 or 24 LPA" 
                  value={newOffer.ctc} 
                  onChange={e => setNewOffer({ ...newOffer, ctc: e.target.value })} 
                  required 
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
                  {newOffer.ctc ? `Preview: ${formatSalaryDisplay(newOffer.ctc)}` : 'Enter amount in numbers (e.g. 2200000)'}
                </span>
              </div>

              {/* Base Salary */}
              <div className="form-group">
                <label className="form-label">Base Salary (Annual)</label>
                <input 
                  type="number" 
                  min="0"
                  step="1000"
                  className="form-input" 
                  placeholder="e.g. 1800000" 
                  value={newOffer.base} 
                  onChange={e => setNewOffer({ ...newOffer, base: e.target.value })} 
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
                  {newOffer.base ? `Preview: ${formatSalaryDisplay(newOffer.base)}` : 'Fixed component'}
                </span>
              </div>

              {/* Stocks */}
              <div className="form-group">
                <label className="form-label">Stocks / RSUs (Vested / Year)</label>
                <input 
                  type="number" 
                  min="0"
                  step="1000"
                  className="form-input" 
                  placeholder="e.g. 400000" 
                  value={newOffer.stocks} 
                  onChange={e => setNewOffer({ ...newOffer, stocks: e.target.value })} 
                />
              </div>

              {/* Joining Bonus */}
              <div className="form-group">
                <label className="form-label">Joining / Relocation Bonus</label>
                <input 
                  type="number" 
                  min="0"
                  step="1000"
                  className="form-input" 
                  placeholder="e.g. 200000" 
                  value={newOffer.joiningBonus} 
                  onChange={e => setNewOffer({ ...newOffer, joiningBonus: e.target.value })} 
                />
              </div>

              {/* Location */}
              <div className="form-group">
                <label className="form-label">Location</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Bengaluru / Hyderabad / Remote" 
                  value={newOffer.location} 
                  onChange={e => setNewOffer({ ...newOffer, location: e.target.value })} 
                />
              </div>

              {/* Work Mode */}
              <div className="form-group">
                <label className="form-label">Work Mode</label>
                <select 
                  className="form-select" 
                  value={newOffer.workMode} 
                  onChange={e => setNewOffer({ ...newOffer, workMode: e.target.value })}
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="Full Remote">Full Remote</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>

              {/* Work Timings: Shift Start */}
              <div className="form-group">
                <label className="form-label">
                  <Clock size={13} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: '-1px' }} />
                  Shift Start Time
                </label>
                <select 
                  className="form-select" 
                  value={newOffer.workTimingStart} 
                  onChange={e => setNewOffer({ ...newOffer, workTimingStart: e.target.value })}
                >
                  <option value="08:00 AM">08:00 AM</option>
                  <option value="08:30 AM">08:30 AM</option>
                  <option value="09:00 AM">09:00 AM (Standard)</option>
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="10:00 AM">10:00 AM (Flexible)</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM (Noon Shift)</option>
                  <option value="01:00 PM">01:00 PM (European / Mid Shift)</option>
                  <option value="06:00 PM">06:00 PM (US Shift)</option>
                  <option value="Flexible">Flexible Timings</option>
                </select>
              </div>

              {/* Work Timings: Shift End */}
              <div className="form-group">
                <label className="form-label">
                  <Clock size={13} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: '-1px' }} />
                  Shift End Time
                </label>
                <select 
                  className="form-select" 
                  value={newOffer.workTimingEnd} 
                  onChange={e => setNewOffer({ ...newOffer, workTimingEnd: e.target.value })}
                >
                  <option value="05:00 PM">05:00 PM</option>
                  <option value="05:30 PM">05:30 PM</option>
                  <option value="06:00 PM">06:00 PM (Standard)</option>
                  <option value="06:30 PM">06:30 PM</option>
                  <option value="07:00 PM">07:00 PM</option>
                  <option value="07:30 PM">07:30 PM</option>
                  <option value="08:00 PM">08:00 PM</option>
                  <option value="10:00 PM">10:00 PM</option>
                  <option value="03:00 AM">03:00 AM (US Shift)</option>
                  <option value="Flexible">Flexible Exit</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Save to Matrix'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Side-by-Side 1-to-1 Head Comparison Tool (When at least 2 offers exist) */}
      {offers.length >= 2 && (
        <div className="card" style={{ marginBottom: '2.5rem', padding: '1.75rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(6, 195, 180, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <ArrowRightLeft size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Side-by-Side Head-to-Head Comparison</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Pick any two companies or job roles to contrast compensation, base, and working hours directly.
                </p>
              </div>
            </div>

            {/* Selectors for Offer A & B */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <select 
                className="form-select" 
                style={{ width: '200px', fontWeight: 600 }}
                value={selectedOfferAId} 
                onChange={e => setSelectedOfferAId(e.target.value)}
              >
                {offers.map(o => (
                  <option key={o.id || o._id} value={o.id || o._id}>
                    {o.company} ({o.role})
                  </option>
                ))}
              </select>
              <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>VS</span>
              <select 
                className="form-select" 
                style={{ width: '200px', fontWeight: 600 }}
                value={selectedOfferBId} 
                onChange={e => setSelectedOfferBId(e.target.value)}
              >
                {offers.map(o => (
                  <option key={o.id || o._id} value={o.id || o._id}>
                    {o.company} ({o.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {offerA && offerB ? (
            <div>
              {/* Verdict Banner */}
              <div 
                style={{ 
                  padding: '1rem 1.25rem', 
                  borderRadius: 'var(--radius-md)', 
                  background: ctcWinner === 'TIE' ? 'var(--bg-secondary)' : 'rgba(6, 195, 180, 0.1)', 
                  border: '1px solid var(--border-color)', 
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={20} color="var(--primary)" />
                  <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                    {ctcWinner === 'A' && (
                      <span style={{ color: 'var(--primary)' }}>
                        {offerA.company} ({offerA.role}) pays {formatSalaryDisplay(ctcDiff)} (+{((ctcDiff / (ctcB || 1)) * 100).toFixed(1)}%) higher Total CTC than {offerB.company}!
                      </span>
                    )}
                    {ctcWinner === 'B' && (
                      <span style={{ color: 'var(--primary)' }}>
                        {offerB.company} ({offerB.role}) pays {formatSalaryDisplay(ctcDiff)} (+{((ctcDiff / (ctcA || 1)) * 100).toFixed(1)}%) higher Total CTC than {offerA.company}!
                      </span>
                    )}
                    {ctcWinner === 'TIE' && 'Both offers offer an identical Total CTC amount!'}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Compare Base, RSUs & Timings below
                </div>
              </div>

              {/* Comparison Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
                      <th style={{ padding: '0.85rem 1rem', width: '25%', fontWeight: 700, color: 'var(--text-muted)' }}>Comparison Metric</th>
                      <th style={{ padding: '0.85rem 1rem', width: '37.5%', fontWeight: 800, color: ctcWinner === 'A' ? 'var(--primary)' : 'var(--text-main)', fontSize: '1.05rem' }}>
                        {offerA.company} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>({offerA.role})</span>
                      </th>
                      <th style={{ padding: '0.85rem 1rem', width: '37.5%', fontWeight: 800, color: ctcWinner === 'B' ? 'var(--primary)' : 'var(--text-main)', fontSize: '1.05rem' }}>
                        {offerB.company} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>({offerB.role})</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Total CTC */}
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total CTC (Annual)</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '1.15rem', color: ctcWinner === 'A' ? 'var(--primary)' : 'inherit' }}>
                        {formatSalaryDisplay(ctcA, offerA.ctc)}
                        {ctcWinner === 'A' && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>HIGHER</span>}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '1.15rem', color: ctcWinner === 'B' ? 'var(--primary)' : 'inherit' }}>
                        {formatSalaryDisplay(ctcB, offerB.ctc)}
                        {ctcWinner === 'B' && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>HIGHER</span>}
                      </td>
                    </tr>

                    {/* Base Salary */}
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Base Salary (Fixed)</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{formatSalaryDisplay(baseA, offerA.base)}</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{formatSalaryDisplay(baseB, offerB.base)}</td>
                    </tr>

                    {/* Stocks / RSUs */}
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Stocks / RSUs</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{formatSalaryDisplay(offerA.stocks, offerA.stocks)}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{formatSalaryDisplay(offerB.stocks, offerB.stocks)}</td>
                    </tr>

                    {/* Joining Bonus */}
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Joining Bonus</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{formatSalaryDisplay(offerA.joiningBonus, offerA.joiningBonus)}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{formatSalaryDisplay(offerB.joiningBonus, offerB.joiningBonus)}</td>
                    </tr>

                    {/* Daily Working Timings */}
                    <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(6, 195, 180, 0.03)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>
                        <Clock size={15} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: '-2px' }} />
                        Daily Work Timings
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                        <div>{offerA.workTimingStart || '09:00 AM'} - {offerA.workTimingEnd || '06:00 PM'}</div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                          ({calculateWorkHours(offerA.workTimingStart, offerA.workTimingEnd)})
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                        <div>{offerB.workTimingStart || '09:00 AM'} - {offerB.workTimingEnd || '06:00 PM'}</div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                          ({calculateWorkHours(offerB.workTimingStart, offerB.workTimingEnd)})
                        </span>
                      </td>
                    </tr>

                    {/* Location */}
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Location</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{offerA.location || 'N/A'}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{offerB.location || 'N/A'}</td>
                    </tr>

                    {/* Work Mode */}
                    <tr>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Work Mode</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{offerA.workMode || 'Hybrid'}</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{offerB.workMode || 'Hybrid'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
              Select two offers from the dropdown above to view direct comparison.
            </div>
          )}
        </div>
      )}

      {/* Grid of All Saved Offers */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>All Saved Offers ({sortedOffers.length})</h3>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Ranked automatically by Highest CTC
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading offer matrix...
        </div>
      ) : sortedOffers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <Scale size={44} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>No offers to compare</h4>
          <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Click "Add Offer to Matrix" to add and compare job offers.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(310px, 1fr))`, gap: '1.5rem' }}>
          {sortedOffers.map((off, index) => {
            const ctcNum = parseSalaryToNumber(off.ctc);
            const baseNum = parseSalaryToNumber(off.base);
            const isHighest = index === 0;

            return (
              <div
                key={off.id || off._id}
                className="card cursor-target"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isHighest ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  boxShadow: isHighest ? '0 8px 24px rgba(6, 195, 180, 0.2)' : 'var(--shadow-sm)',
                  padding: '1.75rem',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      {isHighest && (
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
                      type="button"
                      onClick={() => handleDeleteOffer(off.id || off._id)}
                      style={{ color: 'var(--text-subtle)', cursor: 'pointer', background: 'none', border: 'none', padding: '0.2rem' }}
                      title="Remove Offer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* CTC Banner */}
                  <div style={{ padding: '1rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>Total Compensation</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.1rem' }}>
                      {formatSalaryDisplay(ctcNum, off.ctc)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Base Salary:</span>
                      <span style={{ fontWeight: 700 }}>{formatSalaryDisplay(baseNum, off.base)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Stocks / RSUs:</span>
                      <span style={{ fontWeight: 700 }}>{formatSalaryDisplay(off.stocks, off.stocks)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Joining Bonus:</span>
                      <span style={{ fontWeight: 700 }}>{formatSalaryDisplay(off.joiningBonus, off.joiningBonus)}</span>
                    </div>

                    {/* Daily Working Timings */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={14} color="var(--primary)" />
                        Work Timings:
                      </span>
                      <span style={{ fontWeight: 700, textAlign: 'right' }}>
                        {off.workTimingStart || '09:00 AM'} - {off.workTimingEnd || '06:00 PM'}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                          ({calculateWorkHours(off.workTimingStart, off.workTimingEnd)})
                        </div>
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                      <span style={{ fontWeight: 700 }}>{off.location || 'N/A'}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Work Mode:</span>
                      <span style={{ fontWeight: 700 }}>{off.workMode || 'Hybrid'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OfferCompare;

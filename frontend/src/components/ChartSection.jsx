import React from 'react';
import { PieChart, TrendingUp } from 'lucide-react';

const STATUS_COLORS = {
  'Applied': '#4f46e5',
  'Online Assessment': '#06b6d4',
  'Technical Interview': '#8b5cf6',
  'HR Interview': '#f59e0b',
  'Selected': '#10b981',
  'Rejected': '#ef4444'
};

const ChartSection = ({ stats }) => {
  const total = stats.totalApplied || 1; // avoid divide by zero

  const items = [
    { label: 'Applied', count: stats.byStatus['Applied'] || 0, color: STATUS_COLORS['Applied'] },
    { label: 'Online Assessment', count: stats.byStatus['Online Assessment'] || 0, color: STATUS_COLORS['Online Assessment'] },
    { label: 'Technical Interview', count: stats.byStatus['Technical Interview'] || 0, color: STATUS_COLORS['Technical Interview'] },
    { label: 'HR Interview', count: stats.byStatus['HR Interview'] || 0, color: STATUS_COLORS['HR Interview'] },
    { label: 'Selected', count: stats.byStatus['Selected'] || 0, color: STATUS_COLORS['Selected'] },
    { label: 'Rejected', count: stats.byStatus['Rejected'] || 0, color: STATUS_COLORS['Rejected'] }
  ];

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <TrendingUp size={18} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Application Pipeline Breakdown</h3>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            {stats.totalApplied} Total
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item) => {
            const percentage = stats.totalApplied > 0 ? Math.round((item.count / total) * 100) : 0;
            return (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  <span>{item.label}</span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {item.count} ({percentage}%)
                  </span>
                </div>
                <div style={{ height: '8px', width: '100%', background: 'var(--bg-surface-hover)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${percentage}%`,
                      backgroundColor: item.color,
                      borderRadius: '9999px',
                      transition: 'width 0.5s ease-in-out'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChartSection;

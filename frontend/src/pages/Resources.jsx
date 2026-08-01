import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, ExternalLink, Trash2, Search, Code, FileText, Brain, UserCheck, Layers } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import ResourceModal from '../components/ResourceModal';

const CATEGORIES = ['All', 'DSA', 'Aptitude', 'Resume', 'Interview Experience', 'Core Subjects'];

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;

      const res = await axiosClient.get('/resources', { params });
      setResources(res.data.resources || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchResources();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [selectedCategory, searchTerm]);

  const handleAddResource = async (formData) => {
    await axiosClient.post('/resources', formData);
    fetchResources();
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await axiosClient.delete(`/resources/${id}`);
        fetchResources();
      } catch (err) {
        alert('Failed to delete resource.');
      }
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'DSA':
        return <Code size={18} color="var(--primary)" />;
      case 'Aptitude':
        return <Brain size={18} color="var(--warning)" />;
      case 'Resume':
        return <FileText size={18} color="var(--info)" />;
      case 'Interview Experience':
        return <UserCheck size={18} color="var(--purple)" />;
      case 'Core Subjects':
        return <Layers size={18} color="var(--success)" />;
      default:
        return <BookOpen size={18} color="var(--primary)" />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Placement Preparation Resources</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Curate algorithms, aptitude tests, core subject guides, and interview experiences.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add Resource
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '9999px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search resources by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Resource Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading preparation resources...
        </div>
      ) : resources.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <BookOpen size={44} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>No resources found</h4>
          <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Click "Add Resource" to save useful learning links for campus placements.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {resources.map((res) => (
            <div key={res.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ padding: '0.35rem', background: 'var(--bg-surface-hover)', borderRadius: '6px' }}>
                      {getCategoryIcon(res.category)}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', uppercase: 'true' }}>
                      {res.category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteResource(res.id)}
                    style={{ color: 'var(--text-subtle)', cursor: 'pointer' }}
                    title="Delete resource"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: '1.4', marginBottom: '0.5rem' }}>
                  {res.title}
                </h3>

                {res.description && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.5' }}>
                    {res.description}
                  </p>
                )}
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', marginTop: '1rem' }}>
                <a
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Visit Resource
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resource Modal */}
      <ResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddResource}
      />
    </div>
  );
};

export default Resources;

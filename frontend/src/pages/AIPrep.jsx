import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Search, Bookmark, CheckCircle2, ChevronRight, HelpCircle, Lightbulb, Trash2, FileText } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack';

const COMPANY_PRESETS = ['Google', 'Amazon', 'Microsoft', 'Generic', 'Meta', 'TCS', 'Infosys', 'Uber'];
const ROLE_PRESETS = ['Software Engineer', 'SDE-1', 'Frontend Developer', 'Full Stack Engineer', 'Data Engineer'];

const AIPrep = () => {
  const [selectedCompany, setSelectedCompany] = useState('Google');
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [questions, setQuestions] = useState([]);
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedBookmarks, setSavedBookmarks] = useState([]);
  const [savedSuccess, setSavedSuccess] = useState('');
  const [openAnswerIndex, setOpenAnswerIndex] = useState(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/prep/questions', {
        params: { company: selectedCompany, role: selectedRole }
      });
      setQuestions(res.data.questions || []);
      setSource(res.data.source || 'Gemini AI');
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const res = await axiosClient.get('/prep/bookmarks');
      setSavedBookmarks(res.data.bookmarks || []);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchBookmarks();
  }, [selectedCompany, selectedRole]);

  const handleBookmark = async (q) => {
    try {
      await axiosClient.post('/prep/bookmarks', {
        companyName: selectedCompany,
        role: selectedRole,
        category: q.category,
        question: q.question,
        answerKey: q.answerKey
      });
      setSavedSuccess(`Saved question to notebook!`);
      fetchBookmarks();
      setTimeout(() => setSavedSuccess(''), 3000);
    } catch (err) {
      alert('Failed to bookmark question.');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
          <Sparkles size={18} />
          <span>AI-POWERED INTERVIEW PREPARATION</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Company-Specific Question Generator</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
          Generate tailored coding, system design, and behavioral questions for top tech firms.
        </p>
      </div>

      {savedSuccess && <div className="alert alert-success">{savedSuccess}</div>}

      {/* Selectors Toolbar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Target Company</label>
            <select
              className="form-select"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              {COMPANY_PRESETS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Target Role</label>
            <select
              className="form-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {ROLE_PRESETS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
            <button className="btn btn-primary" onClick={fetchQuestions} style={{ width: '100%', height: '42px' }}>
              <Brain size={18} />
              Generate Questions
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Generated Questions & Bookmarked Notebook */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1fr) minmax(280px, 340px)', gap: '1.5rem' }}>
        
        {/* Questions List */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
              {selectedCompany} ({selectedRole}) Questions
            </h3>
            {source && (
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '9999px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Sparkles size={12} />
                {source}
              </span>
            )}
          </div>

          {loading ? (
            <div className="paper-bin-loader">
              <div className="paper-bin-stage">
                <FileText className="paper-sheet paper-sheet-1" size={28} />
                <FileText className="paper-sheet paper-sheet-2" size={26} />
                <FileText className="paper-sheet paper-sheet-3" size={24} />
                <Trash2 className="paper-bin-icon" size={54} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                Drafting & Tossing Questions into Bin...
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Curating {selectedCompany} ({selectedRole}) interview challenges.
              </p>
            </div>
          ) : (
            <ScrollStack
              itemDistance={30}
              itemScale={0.02}
              itemStackDistance={15}
              baseScale={0.94}
              onActiveCardChange={(activeIdx) => {
                if (openAnswerIndex !== null && openAnswerIndex < activeIdx) {
                  setOpenAnswerIndex(null);
                }
              }}
            >
              {questions.map((q, idx) => (
                <ScrollStackItem key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.775rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '9999px', background: 'var(--primary-light)', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      {q.category || 'Technical'}
                    </span>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleBookmark(q)}
                      title="Bookmark Question"
                    >
                      <Bookmark size={14} />
                      Save Question
                    </button>
                  </div>

                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: '1.5', color: 'var(--text-main)', marginBottom: '1.25rem' }}>
                    {q.question}
                  </h4>

                  <button
                    onClick={() => setOpenAnswerIndex(openAnswerIndex === idx ? null : idx)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      cursor: 'pointer',
                      background: 'var(--primary-light)',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Lightbulb size={16} />
                    {openAnswerIndex === idx ? 'Hide Model Answer' : 'View Structured Answer Guide'}
                  </button>

                  {openAnswerIndex === idx && (
                    <div style={{
                      marginTop: '1.25rem',
                      padding: '1.25rem 1.5rem',
                      background: 'var(--bg-surface-hover)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.9rem',
                      color: 'var(--text-main)'
                    }}>
                      <div style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '0.85rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Brain size={16} /> Key Approach & Implementation Guide:
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {q.answerKey.split(/(?<=[.?!])\s+/).map((sentence, sIdx) => (
                          sentence.trim() ? (
                            <div key={sIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', lineHeight: '1.75' }}>
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', marginTop: '0.6rem', flexShrink: 0 }} />
                              <span>{sentence.trim()}</span>
                            </div>
                          ) : null
                        ))}
                      </div>
                    </div>
                  )}
                </ScrollStackItem>
              ))}
            </ScrollStack>
          )}
        </div>

        {/* Bookmarked Questions Notebook Sidebar */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Bookmark size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Saved Question Notebook</h3>
            </div>

            {savedBookmarks.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem 0' }}>
                No saved questions yet. Click "Save" on any question to add it to your revision list.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '450px', overflowY: 'auto' }}>
                {savedBookmarks.map((b) => (
                  <div key={b.id} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      {b.companyName} • {b.category}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: '1.3' }}>
                      {b.question}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIPrep;

import React, { useState, useEffect, useContext } from 'react';
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe, Plus, Trash2, Save, Printer, Palette, Eye, Edit3, CheckCircle2 } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext';

const ACCENT_COLORS = ['#4f46e5', '#2563eb', '#0284c7', '#059669', '#d97706', '#7c3aed', '#dc2626'];

const ResumeBuilder = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: {
      languages: '',
      frameworks: '',
      tools: '',
      coreSubjects: ''
    },
    certifications: [],
    themeColor: '#4f46e5'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [mobileView, setMobileView] = useState('editor'); // 'editor' or 'preview'

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/resume');
        if (res.data.resume && res.data.resume.personalInfo?.fullName) {
          setFormData(res.data.resume);
        }
      } catch (err) {
        console.error('Failed to fetch existing resume', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await axiosClient.post('/resume', formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save resume details.');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper change handlers
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value }
    }));
  };

  const handleSkillsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, [name]: value }
    }));
  };

  // Education array handlers
  const handleEduChange = (index, field, value) => {
    const updated = [...formData.education];
    updated[index][field] = value;
    setFormData({ ...formData, education: updated });
  };
  const addEdu = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { institution: '', degree: '', fieldOfStudy: '', gradYear: '', cgpa: '' }]
    });
  };
  const removeEdu = (index) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index)
    });
  };

  // Experience array handlers
  const handleExpChange = (index, field, value) => {
    const updated = [...formData.experience];
    updated[index][field] = value;
    setFormData({ ...formData, experience: updated });
  };
  const addExp = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { company: '', role: '', startDate: '', endDate: '', description: '' }]
    });
  };
  const removeExp = (index) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index)
    });
  };

  // Projects array handlers
  const handleProjChange = (index, field, value) => {
    const updated = [...formData.projects];
    updated[index][field] = value;
    setFormData({ ...formData, projects: updated });
  };
  const addProj = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { title: '', techStack: '', link: '', description: '' }]
    });
  };
  const removeProj = (index) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index)
    });
  };

  // Certifications array handlers
  const handleCertChange = (index, value) => {
    const updated = [...formData.certifications];
    updated[index] = value;
    setFormData({ ...formData, certifications: updated });
  };
  const addCert = () => {
    setFormData({ ...formData, certifications: [...formData.certifications, ''] });
  };
  const removeCert = (index) => {
    setFormData({ ...formData, certifications: formData.certifications.filter((_, i) => i !== index) });
  };

  return (
    <div>
      {/* Top Header & Actions Toolbar */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>ATS Resume Builder</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Fill in your details to auto-generate a professional, print-ready 1-page resume.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {saveSuccess && (
            <span style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} /> Saved!
            </span>
          )}

          <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>
            <Save size={18} />
            {saving ? 'Saving...' : 'Save to Account'}
          </button>

          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={18} />
            Print / Download PDF
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1fr) minmax(400px, 1fr)', gap: '1.5rem' }}>
        
        {/* LEFT COLUMN: EDITOR FORM */}
        <div className="resume-editor-col no-print">
          {/* Navigation Tabs for Form */}
          <div className="card" style={{ padding: '0.75rem', marginBottom: '1.25rem', display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
            {[
              { id: 'personal', label: 'Personal' },
              { id: 'summary', label: 'Summary' },
              { id: 'education', label: 'Education' },
              { id: 'experience', label: 'Experience' },
              { id: 'projects', label: 'Projects' },
              { id: 'skills', label: 'Skills' },
              { id: 'certs', label: 'Certifications' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: '9999px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content Cards */}
          <div className="card">
            
            {/* 1. PERSONAL INFO TAB */}
            {activeTab === 'personal' && (
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Personal & Contact Details</h3>
                
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input type="text" name="fullName" className="form-input" value={formData.personalInfo.fullName} onChange={handlePersonalInfoChange} placeholder="Alex Johnson" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input type="email" name="email" className="form-input" value={formData.personalInfo.email} onChange={handlePersonalInfoChange} placeholder="alex@college.edu" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input type="text" name="phone" className="form-input" value={formData.personalInfo.phone} onChange={handlePersonalInfoChange} placeholder="+91 9876543210" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Location (City, Country)</label>
                    <input type="text" name="location" className="form-input" value={formData.personalInfo.location} onChange={handlePersonalInfoChange} placeholder="Bengaluru, India" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">LinkedIn Profile</label>
                    <input type="text" name="linkedin" className="form-input" value={formData.personalInfo.linkedin} onChange={handlePersonalInfoChange} placeholder="linkedin.com/in/username" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">GitHub Profile</label>
                    <input type="text" name="github" className="form-input" value={formData.personalInfo.github} onChange={handlePersonalInfoChange} placeholder="github.com/username" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Portfolio Website</label>
                    <input type="text" name="portfolio" className="form-input" value={formData.personalInfo.portfolio} onChange={handlePersonalInfoChange} placeholder="alex.dev" />
                  </div>
                </div>

                {/* Accent Color Customizer */}
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label className="form-label">Accent Theme Color</label>
                  <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.4rem' }}>
                    {ACCENT_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, themeColor: color })}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: color,
                          border: formData.themeColor === color ? '3px solid var(--text-main)' : 'none',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. SUMMARY TAB */}
            {activeTab === 'summary' && (
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Professional Summary</h3>
                <div className="form-group">
                  <label className="form-label">Objective / Summary Bio</label>
                  <textarea
                    className="form-textarea"
                    rows={6}
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Brief 2-3 sentence overview highlighting your core strengths and career objectives..."
                  />
                </div>
              </div>
            )}

            {/* 3. EDUCATION TAB */}
            {activeTab === 'education' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Education History</h3>
                  <button className="btn btn-secondary btn-sm" onClick={addEdu}>
                    <Plus size={14} /> Add College
                  </button>
                </div>

                {formData.education.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>No education history added yet.</p>
                    <button className="btn btn-primary btn-sm" onClick={addEdu}>
                      <Plus size={14} /> Add Education Entry
                    </button>
                  </div>
                ) : (
                  formData.education.map((edu, index) => (
                    <div key={index} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', background: 'var(--bg-surface)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Institution #{index + 1}</span>
                        <button onClick={() => removeEdu(index)} style={{ color: 'var(--danger)', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">College / University Name</label>
                        <input type="text" className="form-input" value={edu.institution} onChange={(e) => handleEduChange(index, 'institution', e.target.value)} placeholder="e.g. NIT Trichy" />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                          <label className="form-label">Degree</label>
                          <input type="text" className="form-input" value={edu.degree} onChange={(e) => handleEduChange(index, 'degree', e.target.value)} placeholder="B.Tech" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Field of Study</label>
                          <input type="text" className="form-input" value={edu.fieldOfStudy} onChange={(e) => handleEduChange(index, 'fieldOfStudy', e.target.value)} placeholder="Computer Science" />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                          <label className="form-label">Graduation Year</label>
                          <input type="text" className="form-input" value={edu.gradYear} onChange={(e) => handleEduChange(index, 'gradYear', e.target.value)} placeholder="2026" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">CGPA / Percentage</label>
                          <input type="text" className="form-input" value={edu.cgpa} onChange={(e) => handleEduChange(index, 'cgpa', e.target.value)} placeholder="8.8 / 10" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 4. EXPERIENCE TAB */}
            {activeTab === 'experience' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Work / Internship Experience</h3>
                  <button className="btn btn-secondary btn-sm" onClick={addExp}>
                    <Plus size={14} /> Add Experience
                  </button>
                </div>

                {formData.experience.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>No work experience added yet.</p>
                    <button className="btn btn-primary btn-sm" onClick={addExp}>
                      <Plus size={14} /> Add Experience Entry
                    </button>
                  </div>
                ) : (
                  formData.experience.map((exp, index) => (
                    <div key={index} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', background: 'var(--bg-surface)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Experience #{index + 1}</span>
                        <button onClick={() => removeExp(index)} style={{ color: 'var(--danger)', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                          <label className="form-label">Company Name</label>
                          <input type="text" className="form-input" value={exp.company} onChange={(e) => handleExpChange(index, 'company', e.target.value)} placeholder="Google, Microsoft, Startup" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Role / Position</label>
                          <input type="text" className="form-input" value={exp.role} onChange={(e) => handleExpChange(index, 'role', e.target.value)} placeholder="Software Development Intern" />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                          <label className="form-label">Start Date</label>
                          <input type="text" className="form-input" value={exp.startDate} onChange={(e) => handleExpChange(index, 'startDate', e.target.value)} placeholder="May 2025" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">End Date / Present</label>
                          <input type="text" className="form-input" value={exp.endDate} onChange={(e) => handleExpChange(index, 'endDate', e.target.value)} placeholder="Jul 2025 or Present" />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Key Responsibilities & Achievements</label>
                        <textarea className="form-textarea" rows={3} value={exp.description} onChange={(e) => handleExpChange(index, 'description', e.target.value)} placeholder="Built REST APIs using Express.js. Reduced latency by 20%..." />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 5. PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Key Projects</h3>
                  <button className="btn btn-secondary btn-sm" onClick={addProj}>
                    <Plus size={14} /> Add Project
                  </button>
                </div>

                {formData.projects.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>No projects added yet.</p>
                    <button className="btn btn-primary btn-sm" onClick={addProj}>
                      <Plus size={14} /> Add Project Entry
                    </button>
                  </div>
                ) : (
                  formData.projects.map((proj, index) => (
                    <div key={index} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', background: 'var(--bg-surface)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Project #{index + 1}</span>
                        <button onClick={() => removeProj(index)} style={{ color: 'var(--danger)', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                          <label className="form-label">Project Title</label>
                          <input type="text" className="form-input" value={proj.title} onChange={(e) => handleProjChange(index, 'title', e.target.value)} placeholder="Placement Prep Portal" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Technologies Used</label>
                          <input type="text" className="form-input" value={proj.techStack} onChange={(e) => handleProjChange(index, 'techStack', e.target.value)} placeholder="React, Express, MongoDB" />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Project / GitHub URL Link</label>
                        <input type="text" className="form-input" value={proj.link} onChange={(e) => handleProjChange(index, 'link', e.target.value)} placeholder="https://github.com/user/repo" />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Description & Highlights</label>
                        <textarea className="form-textarea" rows={3} value={proj.description} onChange={(e) => handleProjChange(index, 'description', e.target.value)} placeholder="Implemented JWT auth and dashboard metrics..." />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 6. SKILLS TAB */}
            {activeTab === 'skills' && (
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Technical Skills</h3>
                
                <div className="form-group">
                  <label className="form-label">Programming Languages</label>
                  <input type="text" name="languages" className="form-input" value={formData.skills.languages} onChange={handleSkillsChange} placeholder="C++, Java, JavaScript, Python, SQL" />
                </div>

                <div className="form-group">
                  <label className="form-label">Frameworks & Libraries</label>
                  <input type="text" name="frameworks" className="form-input" value={formData.skills.frameworks} onChange={handleSkillsChange} placeholder="React.js, Node.js, Express.js, HTML5/CSS3" />
                </div>

                <div className="form-group">
                  <label className="form-label">Tools & Databases</label>
                  <input type="text" name="tools" className="form-input" value={formData.skills.tools} onChange={handleSkillsChange} placeholder="Git, VS Code, MongoDB, PostgreSQL, SQLite" />
                </div>

                <div className="form-group">
                  <label className="form-label">Core CS Concepts</label>
                  <input type="text" name="coreSubjects" className="form-input" value={formData.skills.coreSubjects} onChange={handleSkillsChange} placeholder="DSA, OOPs, DBMS, Operating Systems, Computer Networks" />
                </div>
              </div>
            )}

            {/* 7. CERTIFICATIONS TAB */}
            {activeTab === 'certs' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Certifications & Achievements</h3>
                  <button className="btn btn-secondary btn-sm" onClick={addCert}>
                    <Plus size={14} /> Add Certification
                  </button>
                </div>

                {formData.certifications.map((cert, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={cert}
                      onChange={(e) => handleCertChange(index, e.target.value)}
                      placeholder="e.g. AWS Certified Cloud Practitioner"
                    />
                    <button onClick={() => removeCert(index)} style={{ color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: LIVE REAL-TIME PAPER PREVIEW */}
        <div style={{ overflowY: 'auto' }}>
          <div className="resume-paper" style={{ '--accent-color': formData.themeColor }}>
            
            {/* Header Section */}
            <div className="resume-header">
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: formData.themeColor, marginBottom: '0.25rem' }}>
                {formData.personalInfo.fullName || 'YOUR NAME'}
              </h1>
              
              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', fontSize: '0.8rem', color: '#475569', fontWeight: 500 }}>
                {formData.personalInfo.email && <span>📧 {formData.personalInfo.email}</span>}
                {formData.personalInfo.phone && <span>📞 {formData.personalInfo.phone}</span>}
                {formData.personalInfo.location && <span>📍 {formData.personalInfo.location}</span>}
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', fontSize: '0.8rem', color: '#2563eb', marginTop: '0.2rem', fontWeight: 600 }}>
                {formData.personalInfo.linkedin && <span>🔗 {formData.personalInfo.linkedin}</span>}
                {formData.personalInfo.github && <span>💻 {formData.personalInfo.github}</span>}
                {formData.personalInfo.portfolio && <span>🌐 {formData.personalInfo.portfolio}</span>}
              </div>
            </div>

            {/* Summary */}
            {formData.summary && (
              <div>
                <div className="resume-section-title">Professional Summary</div>
                <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.5' }}>
                  {formData.summary}
                </p>
              </div>
            )}

            {/* Education */}
            {formData.education.length > 0 && (
              <div>
                <div className="resume-section-title">Education</div>
                {formData.education.map((edu, idx) => (
                  <div key={idx} style={{ marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700 }}>
                      <span>{edu.institution}</span>
                      <span>{edu.gradYear}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569' }}>
                      <span>{edu.degree} in {edu.fieldOfStudy}</span>
                      {edu.cgpa && <span>CGPA: {edu.cgpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Experience */}
            {formData.experience.length > 0 && (
              <div>
                <div className="resume-section-title">Experience</div>
                {formData.experience.map((exp, idx) => (
                  <div key={idx} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700 }}>
                      <span>{exp.role} — <span style={{ fontWeight: 600, color: formData.themeColor }}>{exp.company}</span></span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{exp.startDate} - {exp.endDate}</span>
                    </div>
                    {exp.description && (
                      <p style={{ fontSize: '0.825rem', color: '#334155', marginTop: '0.2rem', whiteSpace: 'pre-line' }}>
                        • {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {formData.projects.length > 0 && (
              <div>
                <div className="resume-section-title">Projects</div>
                {formData.projects.map((proj, idx) => (
                  <div key={idx} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700 }}>
                      <span>{proj.title} {proj.techStack && <span style={{ fontWeight: 500, fontSize: '0.775rem', color: '#64748b' }}>({proj.techStack})</span>}</span>
                      {proj.link && <span style={{ fontSize: '0.775rem', color: '#2563eb' }}>{proj.link}</span>}
                    </div>
                    {proj.description && (
                      <p style={{ fontSize: '0.825rem', color: '#334155', marginTop: '0.2rem' }}>
                        • {proj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Technical Skills */}
            {(formData.skills.languages || formData.skills.frameworks || formData.skills.tools || formData.skills.coreSubjects) && (
              <div>
                <div className="resume-section-title">Technical Skills</div>
                <div style={{ fontSize: '0.825rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {formData.skills.languages && <div><strong>Languages:</strong> {formData.skills.languages}</div>}
                  {formData.skills.frameworks && <div><strong>Frameworks & Web:</strong> {formData.skills.frameworks}</div>}
                  {formData.skills.tools && <div><strong>Tools & DBs:</strong> {formData.skills.tools}</div>}
                  {formData.skills.coreSubjects && <div><strong>Core CS:</strong> {formData.skills.coreSubjects}</div>}
                </div>
              </div>
            )}

            {/* Certifications */}
            {formData.certifications.length > 0 && (
              <div>
                <div className="resume-section-title">Certifications & Achievements</div>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.825rem', color: '#334155' }}>
                  {formData.certifications.map((cert, idx) => (
                    cert ? <li key={idx}>{cert}</li> : null
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default ResumeBuilder;

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // Form State with about initialized
  const [formData, setFormData] = useState({
    about: { name: '', title: '', summary: '' },
    skills: [],
    education: [],
    experience: [],
    projects: [],
    publications: [],
    certifications: [],
    training: []
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    async function initAdmin() {
      try {
        const authRes = await fetch('/api/auth/verify');
        if (!authRes.ok) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        const res = await fetch('/api/portfolio');
        const data = await res.json();
        
        // Safely coerce and set state
        setFormData({
          about: data.about || { name: '', title: '', summary: '' },
          skills: Array.isArray(data.skills) ? data.skills : (typeof data.skills === 'string' ? [data.skills] : []),
          education: Array.isArray(data.education) ? data.education : [],
          experience: Array.isArray(data.experience) ? data.experience : [],
          projects: Array.isArray(data.projects) ? data.projects : [],
          publications: Array.isArray(data.publications) ? data.publications : [],
          certifications: Array.isArray(data.certifications) ? data.certifications : [],
          training: Array.isArray(data.training) ? data.training : []
        });
      } catch (err) {
        console.error('Failed to initialize admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    initAdmin();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });
      const result = await res.json();
      if (result.success) {
        setIsAuthenticated(true);
        window.location.reload();
      } else {
        alert(result.error || 'Incorrect username or password!');
      }
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
    window.location.reload();
  };

  // Update About Section Fields
  const updateAboutField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      about: { ...prev.about, [field]: value }
    }));
  };

  // Generic Array Item Handlers
  const addItem = (section, template) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), template]
    }));
  };

  const removeItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const updateItemField = (section, index, field, value) => {
    const updated = [...formData[section]];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, [section]: updated }));
  };

  // Skills handlers
  const addSkill = () => {
    if (!skillInput.trim()) return;
    setFormData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
    setSkillInput('');
  };

  const removeSkill = (index) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error);
      alert('Portfolio updated successfully!');
    } catch (err) {
      alert('Error saving changes: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/portfolio/upload-pdf', { method: 'POST', body: form });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error);
      alert('PDF processed successfully!');
      window.location.reload();
    } catch (err) {
      alert('PDF upload failed: ' + err.message);
    } finally {
      setUploadingPdf(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-900 border border-slate-800 p-8 rounded-xl max-w-md w-full space-y-4">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Username</label>
            <input type="text" value={usernameInput} onChange={e => setUsernameInput(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white" required />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Password</label>
            <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white" required />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-medium">Login</button>
        </form>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold">Portfolio Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg">View Live ↗</Link>
            <button onClick={handleLogout} className="text-sm bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg">Logout</button>
          </div>
        </div>

        {/* PDF Upload */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Upload Resume PDF</h2>
            <p className="text-sm text-slate-400">Quick parse fallback text</p>
          </div>
          <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-sm font-medium px-5 py-2.5 rounded-xl">
            {uploadingPdf ? 'Processing...' : 'Upload PDF 📄'}
            <input type="file" accept="application/pdf" onChange={handlePdfUpload} disabled={uploadingPdf} className="hidden" />
          </label>
        </div>

        {/* ABOUT / HEADER SECTION */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-semibold text-indigo-400">About / Header Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Your Full Name</label>
              <input 
                type="text" 
                value={formData.about?.name || ''} 
                onChange={e => updateAboutField('name', e.target.value)} 
                placeholder="Anjan Boro" 
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-sm" 
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Professional Title / Tagline</label>
              <input 
                type="text" 
                value={formData.about?.title || ''} 
                onChange={e => updateAboutField('title', e.target.value)} 
                placeholder="Full-Stack Developer & Cloud Enthusiast" 
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-sm" 
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Professional Summary / Bio</label>
            <textarea 
              value={formData.about?.summary || ''} 
              onChange={e => updateAboutField('summary', e.target.value)} 
              placeholder="Building and deploying modern, high-performance web applications..." 
              rows={3} 
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-sm" 
            />
          </div>
        </section>

        {/* EDUCATION SECTION */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-indigo-400">Education</h2>
            <button type="button" onClick={() => addItem('education', { degree: '', institution: '', period: '', description: '' })} className="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg">+ Add Education</button>
          </div>
          {formData.education && formData.education.map((item, index) => (
            <div key={index} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
              <button type="button" onClick={() => removeItem('education', index)} className="absolute top-3 right-3 text-red-400 text-xs">Remove</button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" placeholder="Degree / Program" value={item.degree || ''} onChange={e => updateItemField('education', index, 'degree', e.target.value)} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
                <input type="text" placeholder="Institution Name" value={item.institution || ''} onChange={e => updateItemField('education', index, 'institution', e.target.value)} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
              </div>
              <input type="text" placeholder="Period (e.g., 2021 - 2025)" value={item.period || ''} onChange={e => updateItemField('education', index, 'period', e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
              <textarea placeholder="Description / Coursework / Honors" value={item.description || ''} onChange={e => updateItemField('education', index, 'description', e.target.value)} rows={2} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
            </div>
          ))}
        </section>

        {/* SKILLS SECTION */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-semibold text-indigo-400">Skills</h2>
          <div className="flex gap-2">
            <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder="Add a skill (e.g., React, Node.js)" className="flex-1 bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm" />
            <button type="button" onClick={addSkill} className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium">Add Skill</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.skills && formData.skills.map((skill, index) => (
              <span key={index} className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
                {skill}
                <button type="button" onClick={() => removeSkill(index)} className="text-red-400 hover:text-red-300">×</button>
              </span>
            ))}
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-indigo-400">Experience</h2>
            <button type="button" onClick={() => addItem('experience', { title: '', company: '', tenure: '', description: '' })} className="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg">+ Add Experience</button>
          </div>
          {formData.experience && formData.experience.map((item, index) => (
            <div key={index} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
              <button type="button" onClick={() => removeItem('experience', index)} className="absolute top-3 right-3 text-red-400 text-xs">Remove</button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" placeholder="Job Title" value={item.title || ''} onChange={e => updateItemField('experience', index, 'title', e.target.value)} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
                <input type="text" placeholder="Company Name" value={item.company || ''} onChange={e => updateItemField('experience', index, 'company', e.target.value)} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
              </div>
              <input type="text" placeholder="Tenure (e.g., Jan 2023 - Present)" value={item.tenure || ''} onChange={e => updateItemField('experience', index, 'tenure', e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
              <textarea placeholder="Description & Key Responsibilities" value={item.description || ''} onChange={e => updateItemField('experience', index, 'description', e.target.value)} rows={2} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
            </div>
          ))}
        </section>

        {/* PROJECTS SECTION */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-indigo-400">Projects</h2>
            <button type="button" onClick={() => addItem('projects', { name: '', link: '', description: '', techStack: '', tenure: '', image: '' })} className="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg">+ Add Project</button>
          </div>
          {formData.projects && formData.projects.map((item, index) => (
            <div key={index} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
              <button type="button" onClick={() => removeItem('projects', index)} className="absolute top-3 right-3 text-red-400 text-xs">Remove</button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" placeholder="Project Name" value={item.name || ''} onChange={e => updateItemField('projects', index, 'name', e.target.value)} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
                <input type="text" placeholder="Live/Repo Link" value={item.link || ''} onChange={e => updateItemField('projects', index, 'link', e.target.value)} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" placeholder="Tenure (e.g., Jan 2024 - Feb 2024)" value={item.tenure || ''} onChange={e => updateItemField('projects', index, 'tenure', e.target.value)} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
                
                {/* Image Input with File Upload Support */}
                <div className="flex gap-2 items-center">
                  <input type="text" placeholder="Image URL or upload file ↗" value={item.image || ''} onChange={e => updateItemField('projects', index, 'image', e.target.value)} className="flex-1 bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-xs px-3 py-2.5 rounded-lg font-medium whitespace-nowrap">
                    Upload 📁
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const form = new FormData();
                          form.append('file', file);
                          const res = await fetch('/api/portfolio/upload-image', { method: 'POST', body: form });
                          const result = await res.json();
                          if (!res.ok || !result.success) throw new Error(result.error);
                          updateItemField('projects', index, 'image', result.url);
                          alert('Image uploaded successfully!');
                        } catch (err) {
                          alert('Image upload failed: ' + err.message);
                        }
                      }} 
                    />
                  </label>
                </div>
              </div>

              <input type="text" placeholder="Tech Stack (e.g., Next.js, Tailwind, MongoDB)" value={item.techStack || ''} onChange={e => updateItemField('projects', index, 'techStack', e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
              <textarea placeholder="Project Description" value={item.description || ''} onChange={e => updateItemField('projects', index, 'description', e.target.value)} rows={2} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
            </div>
          ))}
        </section>

        {/* PUBLICATIONS SECTION */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-indigo-400">Publications</h2>
            <button type="button" onClick={() => addItem('publications', { title: '', publisher: '', date: '', link: '' })} className="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg">+ Add Publication</button>
          </div>
          {formData.publications && formData.publications.map((item, index) => (
            <div key={index} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
              <button type="button" onClick={() => removeItem('publications', index)} className="absolute top-3 right-3 text-red-400 text-xs">Remove</button>
              <input type="text" placeholder="Publication Title" value={item.title || ''} onChange={e => updateItemField('publications', index, 'title', e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="text" placeholder="Publisher / Journal" value={item.publisher || ''} onChange={e => updateItemField('publications', index, 'publisher', e.target.value)} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
                <input type="text" placeholder="Date / Year" value={item.date || ''} onChange={e => updateItemField('publications', index, 'date', e.target.value)} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
                <input type="text" placeholder="Link (URL)" value={item.link || ''} onChange={e => updateItemField('publications', index, 'link', e.target.value)} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
              </div>
            </div>
          ))}
        </section>

        {/* CERTIFICATIONS SECTION */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-indigo-400">Certifications</h2>
            <button type="button" onClick={() => addItem('certifications', { name: '', issuer: '', year: '' })} className="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg">+ Add Certification</button>
          </div>
          {formData.certifications && formData.certifications.map((item, index) => (
            <div key={index} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
              <button type="button" onClick={() => removeItem('certifications', index)} className="absolute top-3 right-3 text-red-400 text-xs">Remove</button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="text" placeholder="Certification Name" value={item.name || ''} onChange={e => updateItemField('certifications', index, 'name', e.target.value)} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
                <input type="text" placeholder="Issuer (e.g., AWS, Google)" value={item.issuer || ''} onChange={e => updateItemField('certifications', index, 'issuer', e.target.value)} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
                <input type="text" placeholder="Year" value={item.year || ''} onChange={e => updateItemField('certifications', index, 'year', e.target.value)} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
              </div>
            </div>
          ))}
        </section>

        {/* TRAINING SECTION */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-indigo-400">Training</h2>
            <button type="button" onClick={() => addItem('training', { course: '', institution: '', tenure: '' })} className="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg">+ Add Training</button>
          </div>
          {formData.training && formData.training.map((item, index) => (
            <div key={index} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative">
              <button type="button" onClick={() => removeItem('training', index)} className="absolute top-3 right-3 text-red-400 text-xs">Remove</button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="text" placeholder="Course / Program Name" value={item.course || ''} onChange={e => updateItemField('training', index, 'course', e.target.value)} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
                <input type="text" placeholder="Name of Institution" value={item.institution || ''} onChange={e => updateItemField('training', index, 'institution', e.target.value)} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
                <input type="text" placeholder="Tenure (e.g., June 2024 - July 2024)" value={item.tenure || ''} onChange={e => updateItemField('training', index, 'tenure', e.target.value)} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm" />
              </div>
            </div>
          ))}
        </section>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button type="button" onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-950 text-white font-medium px-8 py-3 rounded-xl transition shadow-lg">
            {saving ? 'Saving Changes...' : 'Save All Changes'}
          </button>
        </div>

      </div>
    </main>
  );
}
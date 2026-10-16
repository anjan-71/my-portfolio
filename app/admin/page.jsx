'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [jsonInputString, setJsonInputString] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

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
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        setJsonInputString(JSON.stringify(data, null, 2));
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

      const textResponse = await res.text();
      let result;

      try {
        result = JSON.parse(textResponse);
      } catch (err) {
        throw new Error(`API route error: ${textResponse.slice(0, 100)}`);
      }

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
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      const result = await res.json();
      
      if (result.success) {
        setIsAuthenticated(false);
        window.location.reload();
      } else {
        alert('Logout failed');
      }
    } catch (err) {
      alert('Logout error: ' + err.message);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const parsedData = JSON.parse(jsonInputString);

      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update portfolio data');
      }

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
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/portfolio/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to process PDF file');
      }

      alert('PDF uploaded and extracted successfully!');
      window.location.reload();
    } catch (err) {
      alert('PDF upload failed: ' + err.message);
    } finally {
      setUploadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-lg">Loading Admin Dashboard...</p>
      </div>
    );
  }

  // Show Login Form with Username and Password fields
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-900 border border-slate-800 p-8 rounded-xl max-w-md w-full space-y-4 shadow-2xl">
          <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
          <p className="text-slate-400 text-sm">Enter your credentials to access the portfolio editor.</p>
          
          <div>
            <label className="block text-xs text-slate-400 mb-1">Username</label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Admin Username"
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Password</label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Admin Password"
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-medium transition shadow-lg mt-2">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold">Portfolio Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              target="_blank" 
              className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            >
              View Live Portfolio ↗
            </Link>
            <button 
              onClick={handleLogout}
              className="text-sm bg-red-600 hover:bg-red-500 text-white font-medium px-4 py-2 rounded-lg transition shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {/* PDF Upload Section */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Update from PDF (Resume)</h2>
            <p className="text-sm text-gray-400">Upload a PDF file to automatically extract and update your portfolio data.</p>
          </div>
          <label className={`cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition shadow-lg ${uploadingPdf ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {uploadingPdf ? 'Processing PDF...' : 'Upload PDF 📄'}
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handlePdfUpload} 
              disabled={uploadingPdf} 
              className="hidden" 
            />
          </label>
        </div>

        <p className="text-gray-400 mb-4 text-sm">
          Edit your portfolio data directly below in JSON format, then click publish:
        </p>

        <textarea
          value={jsonInputString}
          onChange={(e) => setJsonInputString(e.target.value)}
          rows={20}
          className="w-full font-mono text-sm bg-gray-900 text-green-400 p-4 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 shadow-inner"
        />

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-white font-medium px-6 py-3 rounded-xl transition shadow-lg flex items-center gap-2"
          >
            {saving ? 'Publishing...' : 'Publish Changes Live'}
          </button>
        </div>
      </div>
    </div>
  );
}
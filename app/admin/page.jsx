'use client';
import { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [jsonText, setJsonText] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => setJsonText(JSON.stringify(data, null, 2)))
      .catch(() => setStatus('Failed to load portfolio data.'));
  }, []);

  const handleSave = async () => {
    try {
      const parsed = JSON.parse(jsonText);
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus('Successfully updated portfolio!');
      } else {
        setStatus(`Update failed: ${data.error || 'Unknown server error'}`);
      }
    } catch (e) {
      setStatus(`Error: ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white max-w-4xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-cyan-400">Portfolio Admin Dashboard</h1>
        <a href="/" className="text-sm bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700">View Live Portfolio</a>
      </div>
      {status && <p className="mb-4 text-sm font-medium text-cyan-300">{status}</p>}
      <p className="text-slate-400 text-sm mb-3">Edit your resume data directly below in JSON format, then click save:</p>
      <textarea 
        rows="22" 
        value={jsonText} 
        onChange={e => setJsonText(e.target.value)}
        className="w-full bg-slate-900 font-mono text-xs text-green-400 p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
      />
      <button onClick={handleSave} className="mt-4 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-lg">
        Publish Changes Live
      </button>
    </div>
  );
}
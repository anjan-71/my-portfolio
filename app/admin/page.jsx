'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [jsonInputString, setJsonInputString] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch initial portfolio data on load
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/portfolio');
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        // Pretty-print the JSON into the textarea
        setJsonInputString(JSON.stringify(data, null, 2));
      } catch (err) {
        console.error('Failed to load portfolio data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Handle saving and publishing changes live
  const handleSave = async () => {
    setSaving(true);
    try {
      // Ensure textarea contains valid JSON before sending
      const parsedData = JSON.parse(jsonInputString);

      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });

      const textResponse = await response.text();
      let result;
      
      try {
        result = JSON.parse(textResponse);
      } catch (e) {
        throw new Error(`Server returned non-JSON response: "${textResponse || 'Empty body'}"`);
      }

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update portfolio data');
      }

      alert('Portfolio updated successfully!');
    } catch (err) {
      alert('Error saving changes: ' + err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-lg">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold">Portfolio Admin Dashboard</h1>
          <Link 
            href="/" 
            target="_blank" 
            className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
          >
            View Live Portfolio ↗
          </Link>
        </div>

        <p className="text-gray-400 mb-4 text-sm">
          Edit your resume data directly below in JSON format, then click save:
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
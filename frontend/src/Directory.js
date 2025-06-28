import React, { useState } from 'react';
import axios from 'axios';

function Directory() {
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!target) {
      alert('Please enter a target URL or domain');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const res = await axios.post('http://localhost:5000/bruteforce', {
        target: target.trim()
      });
      setResults(res.data.found || []);
    } catch (err) {
      setError('Error scanning directories.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1>📂 Directory Brute Forcer</h1>
      <input
        type="text"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Enter URL (e.g., example.com)"
        style={{ padding: '0.5rem', width: '300px', borderRadius: '6px', border: '1px solid #ccc' }}
      />
      <br /><br />
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: '0.5rem 1.2rem',
          borderRadius: '6px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Scanning...' : 'Start Brute Force'}
      </button>

      <div style={{ marginTop: '2rem' }}>
        {error && <p style={{ color: 'red' }}>❌ {error}</p>}
        {results.length > 0 && (
          <div>
            <h3>✅ Found Directories</h3>
            <ul>
              {results.map((dir, idx) => (
                <li key={idx}>
                  <strong>/{dir.directory}</strong> — Status: {dir.status}
                </li>
              ))}
            </ul>
          </div>
        )}
        {results.length === 0 && !loading && !error && <p>No results yet.</p>}
      </div>
    </div>
  );
}

export default Directory;

import React, { useState } from 'react';
import axios from 'axios';

function NmapScanner() {
  const [target, setTarget] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => setTarget(e.target.value);

  const handleSubmit = async () => {
    if (!target) {
      alert('Please enter an IP or domain');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post('http://localhost:5000/scan', { target });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setResult({ error: 'Scan failed or server error' });
    } finally {
      setLoading(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const color = status === 'open' || status === 'up' ? 'green'
                 : status === 'closed' ? 'gray'
                 : 'orange';
    return (
      <span style={{ backgroundColor: color, color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.85rem' }}>
        {status?.toUpperCase()}
      </span>
    );
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1>🛡️ Nmap Port Scanner</h1>
      <input
        type="text"
        value={target}
        onChange={handleInputChange}
        placeholder="Enter IP or domain"
        style={{ padding: '0.5rem', width: '300px', borderRadius: '6px', border: '1px solid #ccc' }}
      />
      <br /><br />
      <button onClick={handleSubmit} disabled={loading} style={{ padding: '0.5rem 1rem', borderRadius: '6px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
        {loading ? 'Scanning...' : 'Start Scan'}
      </button>

      <div style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '800px', margin: 'auto' }}>
        {result && !result.error && (
          <>
            {/* Target Info */}
            <section style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '10px', marginBottom: '2rem', boxShadow: '0 0 6px rgba(0,0,0,0.1)' }}>
              <h2 style={{ borderBottom: '2px solid #ccc', paddingBottom: '0.5rem', marginBottom: '1rem' }}>🌐 Target Info</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div><strong>IP Address:</strong> {result.addresses?.ipv4 || 'N/A'}</div>
                <div><strong>Hostname:</strong> {result.hostnames?.[0]?.name || 'N/A'}</div>
                <div><strong>Status:</strong> <StatusBadge status={result.status?.state} /></div>
                <div><strong>Uptime:</strong> {result.uptime?.seconds || 0} seconds</div>
                <div><strong>Last Boot:</strong> {result.uptime?.lastboot || 'N/A'}</div>
              </div>
            </section>

            {/* Open Ports */}
            <section style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '10px', marginBottom: '2rem', boxShadow: '0 0 6px rgba(0,0,0,0.1)' }}>
              <h2 style={{ borderBottom: '2px solid #ccc', paddingBottom: '0.5rem', marginBottom: '1rem' }}>🚪 Open Ports</h2>
              {Object.keys(result.tcp || {}).length === 0 ? (
                <p>No open TCP ports detected.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#ddd' }}>
                      <th style={{ padding: '0.5rem' }}>Port</th>
                      <th>Service</th>
                      <th>Status</th>
                      <th>Extra Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result.tcp).map(([port, info]) => (
                      <tr key={port} style={{ borderBottom: '1px solid #ccc' }}>
                        <td style={{ padding: '0.5rem' }}>{port}</td>
                        <td>{info.name}</td>
                        <td><StatusBadge status={info.state} /></td>
                        <td>{info.extrainfo || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            {/* SSL Info */}
            {Object.entries(result.tcp || {}).some(([_, info]) => info.script?.['ssl-cert']) && (
              <section style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '10px', boxShadow: '0 0 6px rgba(0,0,0,0.1)' }}>
                <h2 style={{ borderBottom: '2px solid #ccc', paddingBottom: '0.5rem', marginBottom: '1rem' }}>🔐 SSL Certificate Info</h2>
                {Object.entries(result.tcp).map(([port, info]) =>
                  info.script?.['ssl-cert'] ? (
                    <div key={port} style={{ marginBottom: '1rem' }}>
                      <h4>Port {port}</h4>
                      <pre style={{ backgroundColor: '#eee', padding: '1rem', borderRadius: '6px', overflowX: 'auto', fontSize: '0.85rem' }}>
                        {info.script['ssl-cert']}
                      </pre>
                    </div>
                  ) : null
                )}
              </section>
            )}
          </>
        )}

        {/* Error Message */}
        {result?.error && (
          <p style={{ color: 'red', fontWeight: 'bold' }}>❌ {result.error}</p>
        )}
      </div>
    </div>
  );
}

export default NmapScanner;

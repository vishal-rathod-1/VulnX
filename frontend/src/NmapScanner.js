import React, { useState } from 'react';
import axios from 'axios';

function NmapScanner() {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('-sS'); // default scan
  const [customArgs, setCustomArgs] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!target) {
      alert('Please enter an IP or domain');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/scan', {
        target,
        options: `${scanType} ${customArgs}`.trim()
      });
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
      <span style={{
        backgroundColor: color,
        color: 'white',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '0.85rem'
      }}>
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
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Enter IP or domain"
        style={{ padding: '0.5rem', width: '300px', borderRadius: '6px', border: '1px solid #ccc' }}
      />
      <br /><br />

      <select
  onChange={(e) => setScanType(e.target.value)}
  value={scanType}
  style={{ padding: '0.5rem', width: '90%', maxWidth: '500px', marginBottom: '1rem' }}
>
  <option value="-sn">1️⃣ Ping Sweep (Host Discovery)</option>
  <option value="-sS">2️⃣ TCP SYN Scan (Stealth)</option>
  <option value="-A">3️⃣ Aggressive Scan with OS Detection</option>
  <option value="-p 22,80,443">4️⃣ Scan Specific Ports (22, 80, 443)</option>
  <option value="-sU">5️⃣ UDP Port Scan</option>
  <option value="-sV">6️⃣ Service Version Detection</option>
  <option value="-O -T4">7️⃣ OS Detection on Subnet</option>
  <option value="--script vuln">8️⃣ Vulnerability Scan</option>
  <option value="-sI zombie_host">9️⃣ Idle Scan (Stealth)</option>
  <option value="-p 80,443 --script http-vuln*">🔟 Web Vulnerability Scan</option>
   <option value="-sS -sV -T4 -p- --script vuln">Full Port + Service + Script Scan</option> {/* ✅ Add this */}

  <option value="">🛠️ Custom Only</option>
</select>


      <input
        type="text"
        placeholder="Custom Nmap options (e.g., -p 22,80)"
        value={customArgs}
        onChange={(e) => setCustomArgs(e.target.value)}
        style={{ padding: '0.5rem', width: '300px', borderRadius: '6px', border: '1px solid #ccc' }}
      />

      <br /><br />

      <button onClick={handleSubmit} disabled={loading} style={{
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        cursor: 'pointer'
      }}>
        {loading ? 'Scanning...' : 'Start Scan'}
      </button>

      <div style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '800px', margin: 'auto' }}>
        {result && !result.error && (
          <>
            {/* Target Info */}
            <section style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '10px', marginBottom: '2rem', boxShadow: '0 0 6px rgba(0,0,0,0.1)' }}>
              <h2>🌐 Target Info</h2>
              <p><strong>IP Address:</strong> {result.addresses?.ipv4 || 'N/A'}</p>
              <p><strong>Hostname:</strong> {result.hostnames?.[0]?.name || 'N/A'}</p>
              <p><strong>Status:</strong> <StatusBadge status={result.status?.state} /></p>
              <p><strong>Uptime:</strong> {result.uptime?.seconds || 0} seconds</p>
              <p><strong>Last Boot:</strong> {result.uptime?.lastboot || 'N/A'}</p>
            </section>

            {/* Open Ports */}
            <section style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '10px', marginBottom: '2rem', boxShadow: '0 0 6px rgba(0,0,0,0.1)' }}>
              <h2>🚪 Open Ports</h2>
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

            {/* SSL Certificate Info */}
            {Object.entries(result.tcp || {}).some(([_, info]) => info.script?.['ssl-cert']) && (
              <section style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '10px', boxShadow: '0 0 6px rgba(0,0,0,0.1)' }}>
                <h2>🔐 SSL Certificate Info</h2>
                {Object.entries(result.tcp).map(([port, info]) =>
                  info.script?.['ssl-cert'] ? (
                    <div key={port} style={{ marginBottom: '1rem' }}>
                      <h4>Port {port}</h4>
                      <pre style={{
                        backgroundColor: '#eee',
                        padding: '1rem',
                        borderRadius: '6px',
                        overflowX: 'auto',
                        fontSize: '0.85rem'
                      }}>
                        {info.script['ssl-cert']}
                      </pre>
                    </div>
                  ) : null
                )}
              </section>
            )}
          </>
        )}

        {result?.error && (
          <p style={{ color: 'red', fontWeight: 'bold' }}>❌ {result.error}</p>
        )}
      </div>
    </div>
  );
}

export default NmapScanner;

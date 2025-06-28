import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Navbar */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#333',
          padding: '1rem 2rem',
          color: 'white',
        }}
      >
        <h2 style={{ margin: 0 }}>Cyber Toolkit</h2>

        <div
          style={{
            display: 'flex',
            gap: '2rem', // Equal spacing between links
          }}
        >
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            Home
          </Link>
          <Link to="/nmap" style={{ color: 'white', textDecoration: 'none' }}>
            Nmap Scanner
          </Link>
          <Link to="/directory" style={{ color: 'white', textDecoration: 'none' }}>
            Directory
          </Link>
          <Link to="/malware" style={{ color: 'white', textDecoration: 'none' }}>
            Malware
          </Link>
         
        </div>
      </nav>

      {/* Page content goes here */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

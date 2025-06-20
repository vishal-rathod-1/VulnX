import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: '1rem 2rem',
        color: 'white'
      }}>
        <h2 style={{ margin: 0 }}>Cyber Toolkit</h2>
        <div>
          <Link to="/" style={{ color: 'white', marginRight: '1.5rem', textDecoration: 'none' }}>Home</Link>
          <Link to="/nmap" style={{ color: 'white', textDecoration: 'none' }}>Nmap Scanner</Link>
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

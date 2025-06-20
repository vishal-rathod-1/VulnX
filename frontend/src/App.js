import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import MainPage from './MainPage';
import NmapScanner from './NmapScanner';

function App() {
  return (
    <Router>
      <Routes>
        {/* Shared Layout Wrapper */}
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="nmap" element={<NmapScanner />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import MainPage from './MainPage';
import NmapScanner from './NmapScanner';
import Directory from './Directory';
import Malware from './Malware';

function App() {
  return (
    <Router>
      <Routes>
        {/* Shared Layout Wrapper */}
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="nmap" element={<NmapScanner />} />
        <Route path="/directory" element={<Directory />} />
           <Route path="/Malware" element={<Malware />} />
     
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

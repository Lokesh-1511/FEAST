import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import './i18n/i18n'; // Initialize i18n

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Apply language-specific classes to body
    document.body.className = `language-${i18n.language}`;
  }, [i18n.language]);

  return (
    <Router>
      <div className="App">
        <Suspense fallback={
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontSize: '18px'
          }}>
            🌍 Loading languages...
          </div>
        }>
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;

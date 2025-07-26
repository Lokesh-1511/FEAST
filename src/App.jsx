import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import ModernDashboard from './pages/ModernDashboard';
import ModernProfile from './pages/ModernProfile';
import LoginRegister from './pages/LoginRegister';
import './i18n/i18n'; // Initialize i18n

function App() {
  const { i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Apply language-specific classes to body
    document.body.className = `language-${i18n.language}`;
  }, [i18n.language]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
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
    );
  }

  return (
    <Router>
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
          <Route path="/auth" element={<LoginRegister />} />
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/profile" element={user ? <ModernProfile /> : <Navigate to="/auth" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

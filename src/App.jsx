import React, { useState, useEffect } from 'react';
import { DataProvider } from './context/DataContext';
import { Sun, Moon } from 'lucide-react';

import Hero from './components/Scrollytelling/Hero';
import NarrativeMap from './components/Scrollytelling/NarrativeMap';
import Specialties from './components/Scrollytelling/Specialties';
import SocialCards from './components/Scrollytelling/SocialCards';
import DashboardManager from './components/Dashboard/DashboardManager';
import Footer from './components/Footer';

// Use logos from assets folder specifically as the user uploaded them
import logoLight from './assets/uern_logo_azul.png';
import logoDark from './assets/uern_logo_branca.png';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <DataProvider>
      <main className="app-main">
        {/* Top Navigation for Logo changing based on color-scheme */}
        <header className="app-header" style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1.5rem var(--content-padding)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <img src={logoLight} alt="Logotipo UERN" className="logo-light" style={{ width: '150px', height: 'auto', objectFit: 'contain' }} />
          <img src={logoDark} alt="Logotipo UERN" className="logo-dark" style={{ width: '150px', height: 'auto', objectFit: 'contain' }} />
        </header>

        {/* Toggler placed completely outside header bounds for bottom-right absolute safety */}
        <button
          className="theme-toggle-btn"
          onClick={() => setIsDarkMode(!isDarkMode)}
          aria-label="Toggle Dark Mode"
          style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, width: '45px', height: '45px', borderRadius: '50%', background: 'var(--bg-surface)', border: '1px solid var(--color-primary)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--glass-shadow)' }}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <Hero />
        <NarrativeMap />
        <Specialties />
        <SocialCards />

        <div id="dashboard-section-wrapper">
          <DashboardManager />
        </div>

        <Footer />
      </main>
    </DataProvider>
  );
}

export default App;

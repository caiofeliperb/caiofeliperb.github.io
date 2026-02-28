import React, { useState, useEffect } from 'react';
import { DataProvider } from './context/DataContext';
import { Sun, Moon } from 'lucide-react';

import Hero from './components/Scrollytelling/Hero';
import NarrativeMap from './components/Scrollytelling/NarrativeMap';
import Specialties from './components/Scrollytelling/Specialties';
import SocialCards from './components/Scrollytelling/SocialCards';
import DashboardManager from './components/Dashboard/DashboardManager';
import Footer from './components/Footer';

import logoDark from './assets/uern_logo_branca.png';
import logoLight from './assets/uern_logo_azul.png';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <DataProvider>
      <main className="app-main">
        {/* Simple Floating Header for Logos */}
        <header className="simple-app-header">
          <img src={logoLight} alt="Logotipo UERN" className="logo-light" style={{ height: '45px', width: 'auto', maxWidth: '160px', objectFit: 'contain' }} />
          <img src={logoDark} alt="Logotipo UERN" className="logo-dark" style={{ height: '45px', width: 'auto', maxWidth: '160px', objectFit: 'contain' }} />
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

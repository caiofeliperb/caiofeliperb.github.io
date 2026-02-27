import React, { Suspense, lazy } from 'react';
import { DataProvider } from './context/DataContext';

import Hero from './components/Scrollytelling/Hero';
import NarrativeMap from './components/Scrollytelling/NarrativeMap';
import Specialties from './components/Scrollytelling/Specialties';
import SocialCards from './components/Scrollytelling/SocialCards';

// Lazy load the Dashboard for performance "Implement Lazy Loading agressivo"
const DashboardManager = lazy(() => import('./components/Dashboard/DashboardManager'));

function App() {
  return (
    <DataProvider>
      <main className="app-main">
        <Hero />
        <NarrativeMap />
        <Specialties />
        <SocialCards />

        <div id="dashboard-section-wrapper">
          <Suspense fallback={<div className="container" style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando Dashboard Analítico...</div>}>
            <DashboardManager />
          </Suspense>
        </div>
      </main>
    </DataProvider>
  );
}

export default App;

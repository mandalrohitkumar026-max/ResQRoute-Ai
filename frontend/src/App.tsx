import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navigation/Navbar';
import { LandingPage } from './components/Landing/LandingPage';
import { CommandDashboard } from './components/CommandCenter/CommandDashboard';
import { DriverHUD } from './components/DriverHUD/DriverHUD';
import { CitizenPortal } from './components/CitizenPortal/CitizenPortal';
import { AIDetectionModule } from './components/AIDetection/AIDetectionModule';
import { NotificationToasts } from './components/Notifications/NotificationToasts';
import { SimulationOverlay } from './components/SimulationDemo/SimulationOverlay';
import { EmergencyResponseReportModal } from './components/Analytics/EmergencyResponseReportModal';
import { ShieldCheck, Heart, Sparkles, Cpu } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'command_center' && <CommandDashboard />}
        {currentView === 'driver_hud' && <DriverHUD />}
        {currentView === 'citizen_portal' && <CitizenPortal />}
        {currentView === 'ai_detector' && <AIDetectionModule />}
      </main>

      {/* Global Modals & Overlays */}
      <NotificationToasts />
      <SimulationOverlay />
      <EmergencyResponseReportModal />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-300">ResQRoute AI</span>
            <span>• Smart Traffic & Emergency Route Optimizer</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Smart City AI Grid Active
            </span>
            <span>•</span>
            <span className="text-slate-400">SIH Hackathon Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;

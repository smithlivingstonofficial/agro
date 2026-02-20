import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import Dashboard from './pages/Dashboard';
import Farmers from './pages/Farmers';
import PriceMonitoring from './pages/PriceMonitoring';
import AIAssistant from './pages/AIAssistant';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay (Drawer) */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 animate-in slide-in-from-left duration-300">
               <Sidebar closeMenu={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          <main className="flex-1 overflow-y-auto px-4 py-6 md:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/farmers" element={<Farmers />} />
              <Route path="/prices" element={<PriceMonitoring />} />
              <Route path="/ai" element={<AIAssistant />} />
            </Routes>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </Router>
  );
}

export default App;
import React from 'react';
import { Menu, Search, Bell, CloudSun } from 'lucide-react';

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <header className="sticky top-0 z-30 h-16 md:h-20 bg-slate-950/50 backdrop-blur-md border-b border-slate-800 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden p-2 text-slate-400">
          <Menu size={24} />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm w-48 lg:w-80 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" placeholder="Search data..." />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <CloudSun size={16} className="text-amber-500" />
          <span className="text-xs font-bold">28°C</span>
        </div>
        <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
          AD
        </div>
      </div>
    </header>
  );
};

export default Header;
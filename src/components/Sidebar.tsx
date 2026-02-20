import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, Settings, Leaf, TrendingUp } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/farmers", icon: <Users size={20} />, label: "Farmers" },
    { to: "/prices", icon: <TrendingUp size={20} />, label: "Market Prices" },
    { to: "/ai", icon: <MessageSquare size={20} />, label: "AI Assistant" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-emerald-500 p-2 rounded-xl">
          <Leaf className="text-slate-950" size={24} />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">AgroManager</h2>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
              ${isActive 
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-100 border border-transparent"}
            `}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <NavLink to="/settings" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
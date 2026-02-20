import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, TrendingUp, MessageSquare } from 'lucide-react';

const MobileNav = () => {
  const links = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Home" },
    { to: "/farmers", icon: <Users size={20} />, label: "Farmers" },
    { to: "/prices", icon: <TrendingUp size={20} />, label: "Market" },
    { to: "/ai", icon: <MessageSquare size={20} />, label: "AI" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 flex justify-around items-center px-4 z-40">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => `
            flex flex-col items-center gap-1 transition-all
            ${isActive ? "text-emerald-500 scale-110" : "text-slate-500 hover:text-slate-300"}
          `}
        >
          {link.icon}
          <span className="text-[10px] font-bold uppercase tracking-widest">{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNav;
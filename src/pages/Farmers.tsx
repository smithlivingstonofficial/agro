import React, { useState, useEffect } from 'react';
import { Plus, Trash2, MapPin, Search, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { subscribeToFarmers, addFarmer, deleteFarmer, updateFarmerStatus } from '../services/farmerService';
import type { Farmer } from '../services/farmerService';

export default function Farmers() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Real-time backend connection
  useEffect(() => {
    const unsubscribe = subscribeToFarmers((data) => {
      setFarmers(data);
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup connection
  }, []);

  const handleAdd = async () => {
    const name = prompt("Enter Farmer Name:");
    if (!name) return;
    
    try {
      await addFarmer({
        name,
        location: 'Local Site A',
        crops: ['Wheat', 'Corn'],
        acreage: Math.floor(Math.random() * 100) + 10,
        status: 'Pending'
      });
    } catch (err) {
      alert("Error adding farmer. Check Firebase Rules.");
    }
  };

  const filteredFarmers = farmers.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Farmers Directory</h1>
          <p className="text-slate-400 mt-1">Manage and monitor your regional farming network in real-time.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <Plus size={20}/> Add New Farmer
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-800/30">
           <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
              <input 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all" 
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="text-xs font-medium text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
             Total: {filteredFarmers.length} Farmers
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-[11px] uppercase tracking-[0.1em] bg-slate-800/20">
                <th className="px-6 py-4 font-bold">Farmer Profile</th>
                <th className="px-6 py-4 font-bold">Cultivated Crops</th>
                <th className="px-6 py-4 font-bold">Land (Acres)</th>
                <th className="px-6 py-4 font-bold">Network Status</th>
                <th className="px-6 py-4 font-bold text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-24">
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
                      <Loader2 className="animate-spin text-emerald-500" size={32}/>
                      <span className="text-sm font-medium">Syncing with Central Database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredFarmers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-500 italic">No records found.</td>
                </tr>
              ) : filteredFarmers.map(farmer => (
                <tr key={farmer.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
                        {farmer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100">{farmer.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium italic"><MapPin size={12}/> {farmer.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1.5">
                      {farmer.crops.map(c => (
                        <span key={c} className="px-2.5 py-1 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-md border border-slate-700 uppercase">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-300 font-mono text-sm">{farmer.acreage.toFixed(1)}</td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => updateFarmerStatus(farmer.id!, farmer.status === 'Active' ? 'Pending' : 'Active')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase border transition-all ${
                      farmer.status === 'Active' 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20'
                    }`}>
                      {farmer.status === 'Active' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                      {farmer.status}
                    </button>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => { if(confirm('Delete record?')) deleteFarmer(farmer.id!) }}
                      className="text-slate-600 hover:text-red-400 transition-all p-2 rounded-xl hover:bg-red-400/10 active:scale-90"
                    >
                      <Trash2 size={20}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
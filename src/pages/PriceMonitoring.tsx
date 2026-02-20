import React, { useState, useEffect, useMemo } from 'react';
import { 
    Search, MapPin, IndianRupee, Loader2, RefreshCw, 
    Wheat, Filter, ArrowUpDown, TrendingUp, Info 
} from 'lucide-react';
import { PriceService } from '../services/priceService';
import type { MandiRecord } from '../services/priceService';

export default function PriceMonitoring() {
    const [prices, setPrices] = useState<MandiRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<'high' | 'low' | 'none'>('none');

    // Load data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const data = await PriceService.getLivePrices(100); // Fetch top 100 records
        setPrices(data);
        setLoading(false);
    };

    // Filter and Sort Logic
    const processedPrices = useMemo(() => {
        let result = prices.filter(p => 
            p.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.district.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortBy === 'high') {
            result.sort((a, b) => Number(b.modal_price) - Number(a.modal_price));
        } else if (sortBy === 'low') {
            result.sort((a, b) => Number(a.modal_price) - Number(b.modal_price));
        }

        return result;
    }, [prices, searchTerm, sortBy]);

    return (
        <div className="flex flex-col space-y-6 max-w-7xl mx-auto pb-24 px-4 sm:px-0">
            
            {/* --- TOP BANNER --- */}
            <div className="relative overflow-hidden bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Live Market Terminal</span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Market Intelligence</h1>
                        <p className="text-slate-400 text-sm mt-2 max-w-md italic">
                            Real-time commodity valuation from government Mandis across India.
                        </p>
                    </div>
                    
                    <button 
                        onClick={fetchData}
                        className="flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        Sync Data
                    </button>
                </div>
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -mr-20 -mt-20"></div>
            </div>

            {/* --- TOOLBAR: SEARCH & SORT --- */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input 
                        type="text"
                        placeholder="Search crop or district (e.g., Potato, Agra)..."
                        className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-sm text-white focus:border-emerald-500/50 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => setSortBy(sortBy === 'high' ? 'low' : 'high')}
                        className="flex items-center gap-2 bg-slate-900 border border-white/5 px-6 py-4 rounded-2xl text-slate-300 text-sm font-bold hover:border-emerald-500/30 transition-all"
                    >
                        <ArrowUpDown size={18} className="text-emerald-500" />
                        {sortBy === 'high' ? 'Highest Price' : sortBy === 'low' ? 'Lowest Price' : 'Sort Price'}
                    </button>
                </div>
            </div>

            {/* --- MAIN GRID --- */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <Loader2 className="animate-spin text-emerald-500" size={48} />
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">Connecting to Mandi Gateway</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {processedPrices.map((item, idx) => (
                        <div 
                            key={idx} 
                            className="group bg-slate-900 border border-white/5 p-6 rounded-[2rem] hover:border-emerald-500/40 hover:bg-slate-800/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                                    <Wheat size={24} />
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-emerald-500 font-black text-2xl tracking-tighter">
                                        <IndianRupee size={18} />
                                        {Number(item.modal_price).toLocaleString()}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">per quintal</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-white font-black text-xl uppercase tracking-tight truncate group-hover:text-emerald-400 transition-colors">
                                    {item.commodity}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md border border-white/5 uppercase">
                                        {item.variety}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-5 border-t border-white/5 space-y-3">
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                    <MapPin size={14} className="text-emerald-500/50" />
                                    <span className="truncate">{item.market}, {item.district}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                                        {item.arrival_date}
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-black uppercase">
                                        <TrendingUp size={12} />
                                        In Stock
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && processedPrices.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 rounded-[3rem] border border-dashed border-white/5">
                    <Info size={48} className="text-slate-700 mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest">No market data found for your search</p>
                    <button onClick={() => setSearchTerm("")} className="mt-4 text-emerald-500 font-bold text-sm underline underline-offset-4">Clear all filters</button>
                </div>
            )}
        </div>
    );
}
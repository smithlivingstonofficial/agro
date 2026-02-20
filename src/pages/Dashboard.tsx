import React, { useState, useEffect } from 'react';
import { 
    Users, TrendingUp, Sprout, CloudRain, 
    MapPin, AlertTriangle, ArrowUpRight, Loader2, IndianRupee 
} from 'lucide-react';

import { subscribeToFarmers } from '../services/farmerService';
import type { Farmer } from '../services/farmerService'; // <-- Safe Type Import

import { PriceService } from '../services/priceService';
import type { MandiRecord } from '../services/priceService'; // <-- Safe Type Import

export default function Dashboard() {
    // --- Fixed States ---
    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [marketData, setMarketData] = useState<MandiRecord[]>([]);
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [locationName, setLocationName] = useState("Detecting Location...");

    // --- Fetch Real Data ---
    useEffect(() => {
        // 1. Listen to Firebase Farmers
        const unsubscribe = subscribeToFarmers((data) => {
            setFarmers(data);
        });

        // 2. Fetch Market Prices (Top 5 for Dashboard)
        const fetchMarket = async () => {
            const prices = await PriceService.getLivePrices(5);
            setMarketData(prices);
        };

        // 3. Fetch Local Weather (Open-Meteo)
        const fetchWeather = (lat: number, lon: number) => {
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,rain&daily=precipitation_sum,temperature_2m_max&timezone=auto`)
                .then(res => res.json())
                .then(data => {
                    setWeather(data);
                    setLocationName(`Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        };

        // Get Location or use Default (Nagpur, Central India)
        navigator.geolocation.getCurrentPosition(
            (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
            () => {
                fetchWeather(21.14, 79.08); 
                setLocationName("Central India (Location Denied)");
            }
        );

        fetchMarket();

        return () => unsubscribe();
    },[]);

    // --- Calculations ---
    const activeFarmers = farmers.filter(f => f.status === 'Active').length;
    const totalAcreage = farmers.reduce((sum, f) => sum + f.acreage, 0);
    const avgTemp = weather?.current?.temperature_2m || '--';
    const rainToday = weather?.current?.rain || 0;

    if (loading) {
        return (
            <div className="flex flex-col h- items-center justify-center">
                <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
                <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Syncing Global Data...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-6 max-w-7xl mx-auto pb-24 px-2 sm:px-0">
            
            {/* --- HERO HEADER --- */}
            <div className="relative overflow-hidden bg-slate-900 border border-white/5 p-6 md:p-8 rounded- shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <span className="text- font-black text-emerald-500 uppercase tracking-widest">System Online</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Central Command</h1>
                        <div className="flex items-center gap-2 mt-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <MapPin size={14} className="text-emerald-500" />
                            {locationName}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-white/5 shadow-inner">
                        <div className="text-right">
                            <p className="text- text-slate-500 font-bold uppercase tracking-widest">Local Temp</p>
                            <p className="text-2xl font-black text-white">{avgTemp}°C</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                            {Number(avgTemp) > 30 ? <CloudRain size={24}/> : <Sprout size={24}/>}
                        </div>
                    </div>
                </div>
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur- rounded-full -mr-20 -mt-20"></div>
            </div>

            {/* --- KPI CARDS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {/* Card 1: Farmers */}
                <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl hover:border-blue-500/30 transition-all group shadow-lg">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 text-blue-500 group-hover:bg-blue-500 group-hover:text-slate-950 transition-colors">
                        <Users size={24} />
                    </div>
                    <p className="text-slate-500 text- font-bold uppercase tracking-widest mb-1">Network Base</p>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-black text-white leading-none">{farmers.length}</h3>
                        <span className="text-xs font-bold text-blue-500 mb-1">({activeFarmers} Active)</span>
                    </div>
                </div>

                {/* Card 2: Acreage */}
                <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl hover:border-emerald-500/30 transition-all group shadow-lg">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                        <Sprout size={24} />
                    </div>
                    <p className="text-slate-500 text- font-bold uppercase tracking-widest mb-1">Total Cultivation</p>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-black text-white leading-none">{totalAcreage.toLocaleString()}</h3>
                        <span className="text-xs font-bold text-emerald-500 mb-1">Acres</span>
                    </div>
                </div>

                {/* Card 3: Weather Risk */}
                <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl hover:border-cyan-500/30 transition-all group shadow-lg">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-4 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                        <CloudRain size={24} />
                    </div>
                    <p className="text-slate-500 text- font-bold uppercase tracking-widest mb-1">Precipitation</p>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-black text-white leading-none">{rainToday}</h3>
                        <span className="text-xs font-bold text-cyan-500 mb-1">mm (Today)</span>
                    </div>
                </div>

                {/* Card 4: Market Trend */}
                <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl hover:border-amber-500/30 transition-all group shadow-lg">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                        <TrendingUp size={24} />
                    </div>
                    <p className="text-slate-500 text- font-bold uppercase tracking-widest mb-1">Mandi Index</p>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-black text-white leading-none">Live</h3>
                        <span className="text-xs font-bold text-amber-500 mb-1 flex items-center gap-1">Syncing <ArrowUpRight size={12}/></span>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM WIDGETS --- */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                
                {/* Left: Live Market Feed */}
                <div className="xl:col-span-2 bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-white font-black text-lg tracking-tight">Top Commodities</h3>
                        <a href="/prices" className="text- font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors">
                            View Market
                        </a>
                    </div>
                    
                    <div className="space-y-4">
                        {marketData.length > 0 ? marketData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 font-black group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                                        {item.commodity.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-white font-bold uppercase tracking-tight">{item.commodity}</p>
                                        <p className="text- text-slate-500 font-bold uppercase tracking-widest">{item.market}, {item.district}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-emerald-500 font-black flex items-center justify-end gap-1 text-lg"><IndianRupee size={14}/>{item.modal_price}</p>
                                    <p className="text- text-slate-600 font-bold uppercase tracking-widest">per quintal</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-slate-500 text-sm text-center py-10">Fetching live Mandi data...</p>
                        )}
                    </div>
                </div>

                {/* Right: Smart Alerts */}
                <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col">
                    <h3 className="text-white font-black text-lg tracking-tight mb-6">System Alerts</h3>
                    
                    <div className="space-y-4 flex-1">
                        {/* Weather Alert */}
                        <div className="flex gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                            <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-1" />
                            <div>
                                <p className="text-amber-500 text-sm font-bold">Weather Warning</p>
                                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                                    {Number(rainToday) > 5 ? `Heavy rain detected (${rainToday}mm). Advise farmers to delay pesticide spraying.` : `Favorable weather conditions today. Ideal for field operations.`}
                                </p>
                            </div>
                        </div>

                        {/* Network Alert */}
                        <div className="flex gap-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                            <Users size={20} className="text-blue-500 shrink-0 mt-1" />
                            <div>
                                <p className="text-blue-500 text-sm font-bold">Network Update</p>
                                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                                    {farmers.length - activeFarmers > 0 
                                        ? `You have ${farmers.length - activeFarmers} pending farmer approvals in the system.` 
                                        : 'All registered farmers are currently active.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <a href="/ai" className="mt-6 w-full py-4 bg-slate-950 border border-white/5 rounded-xl text- font-bold text-emerald-500 hover:bg-emerald-500/10 uppercase tracking-widest transition-all text-center">
                        Ask AI Assistant
                    </a>
                </div>

            </div>
        </div>
    );
}
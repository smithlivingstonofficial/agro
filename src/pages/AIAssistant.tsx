import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
    Send, Bot, User, Loader2, Mic, MicOff, TrendingUp, 
    Globe, ShieldCheck, MapPin, Sparkles, CloudRain, BarChart3 
} from 'lucide-react';
import { fetchFinancialTrendData } from '../services/marketService';

export default function AIAssistant() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '### AGRO AI Advisor Online\nSelect your language and ask me about **Market Predictions** or **Weather Risks**.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [language, setLanguage] = useState('English');
    const [isListening, setIsListening] = useState(false);
    const [location, setLocation] = useState<{lat: number, lon: number} | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const languages = ["English", "Hindi", "Tamil", "Telugu", "Punjabi", "Marathi", "Bengali"];
    const quickPrompts = [
        { label: 'Sell/Hold?', icon: <TrendingUp size={14}/>, text: 'Should I sell my current crop today or wait for next week?' },
        { label: 'Weather', icon: <CloudRain size={14}/>, text: 'Analyze current weather impact on local prices.' },
        { label: 'Mandi Rates', icon: <BarChart3 size={14}/>, text: 'Show me a table of local Mandi prices.' }
    ];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        navigator.geolocation.getCurrentPosition((pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }));
    }, [messages]);

    const toggleListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return alert("Voice not supported.");
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'English' ? 'en-IN' : 'hi-IN';
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (e: any) => setInput(e.results[0][0].transcript);
        isListening ? recognition.stop() : recognition.start();
    };

    const handleSend = async (e?: React.FormEvent, suggestion?: string) => {
        if (e) e.preventDefault();
        const query = suggestion || input;
        if (!query.trim() || isLoading) return;

        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: query }]);
        setIsLoading(true);

        try {
            const detectedComm = query.toLowerCase().includes("onion") ? "Onion" : query.toLowerCase().includes("potato") ? "Potato" : "Tomato";
            
            const [mandi, weatherRes] = await Promise.all([
                fetchFinancialTrendData(detectedComm),
                location ? fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&daily=precipitation_sum&timezone=auto`).then(r => r.json()) : null
            ]);

            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

            const prompt = `
                You are the "AgroManager AI". Respond strictly in ${language}.
                Context: Mandi Data: ${JSON.stringify(mandi.slice(0,10))}, Weather: ${JSON.stringify(weatherRes?.daily || "Unknown")}.
                Task: Provide expert advice. Use Markdown Tables for data. Use emojis. 
                Keep it mobile-friendly (concise).
            `;

            const result = await model.generateContent(`${prompt}\n\nFarmer Query: ${query}`);
            setMessages(prev => [...prev, { role: 'assistant', content: result.response.text() }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Failed to connect to data feed." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-145px)] md:h-[calc(100vh-160px)] max-w-4xl mx-auto w-full">
            {/* Glass Header */}
            <div className="mx-2 mt-2 mb-1 p-3 bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-2xl flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500 rounded-xl text-slate-950">
                        <ShieldCheck size={18} />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-white uppercase tracking-wider">Agro Advisor</h3>
                        <p className="text-[9px] text-emerald-500 font-bold uppercase">Mandi Sync Active</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-950/50 border border-white/5 px-2 py-1 rounded-lg">
                    <Globe size={12} className="text-slate-400" />
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent text-[10px] font-black text-slate-300 outline-none appearance-none">
                        {languages.map(lang => <option key={lang} value={lang} className="bg-slate-900">{lang}</option>)}
                    </select>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 no-scrollbar">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`flex gap-3 max-w-[92%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${m.role === 'user' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-emerald-400'}`}>
                                {m.role === 'user' ? <User size={14}/> : <Bot size={14}/>}
                            </div>
                            <div className={`px-4 py-3 rounded-2xl shadow-xl ${m.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'}`}>
                                <div className="prose prose-invert prose-xs max-w-none prose-table:border prose-table:border-white/10 prose-th:bg-white/5 prose-td:border-white/10">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && <Loader2 className="animate-spin text-emerald-500 mx-auto" size={20} />}
                <div ref={messagesEndRef} />
            </div>

            {/* Input & Badges */}
            <div className="bg-slate-950/80 backdrop-blur-2xl border-t border-white/5 p-3 pb-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
                    {quickPrompts.map((badge, idx) => (
                        <button key={idx} onClick={() => handleSend(undefined, badge.text)} className="flex items-center gap-2 whitespace-nowrap px-3 py-2 bg-slate-900/50 border border-white/5 rounded-xl text-[10px] font-bold text-slate-400 shrink-0 active:scale-95 transition-all">
                            <Sparkles size={12} className="text-emerald-500"/> {badge.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={toggleListening} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg' : 'bg-slate-900 border border-white/5 text-emerald-500'}`}>
                        {isListening ? <MicOff size={20}/> : <Mic size={20}/>}
                    </button>
                    <form onSubmit={handleSend} className="flex-1 flex items-center bg-slate-900 border border-white/5 rounded-2xl pl-4 pr-1">
                        <input className="flex-1 bg-transparent py-3.5 text-xs text-white outline-none placeholder:text-slate-600" placeholder={isListening ? "Listening..." : "Ask your Advisor..."} value={input} onChange={(e) => setInput(e.target.value)} />
                        <button type="submit" disabled={!input.trim()} className="w-10 h-10 bg-emerald-500 text-slate-950 rounded-xl flex items-center justify-center disabled:opacity-20 active:scale-90 transition-all"><Send size={18} /></button>
                    </form>
                </div>
            </div>
        </div>
    );
}
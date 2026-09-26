import React, { useState, useEffect } from 'react';
import { Bus, Activity, Menu, X, ChevronRight, Zap } from 'lucide-react';
import { apiService } from '../services/api';

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'dataset', label: 'Dataset' },
  { id: 'cleaning', label: 'Data Cleaning' },
  { id: 'eda', label: 'EDA' },
  { id: 'features', label: 'Features' },
  { id: 'model', label: 'Model' },
  { id: 'results', label: 'Results' },
  { id: 'prediction', label: 'Live Prediction', highlight: true },
  { id: 'insights', label: 'Insights' },
];

export default function Navbar({ activeSection, setActiveSection }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    apiService.getHealth()
      .then(res => {
        setBackendStatus(res.model_loaded ? 'online' : 'degraded');
      })
      .catch(() => setBackendStatus('offline'));
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-navy-950/90 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => scrollToSection('overview')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-wide">
                TRANSIT<span className="text-cyan-400">.AI</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
                XGBoost Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Demand Forecast & Smart Fleet
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-navy-900/60 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  item.highlight
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-md shadow-cyan-500/20'
                    : isActive
                    ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.highlight && <Zap className="w-3 h-3 fill-current" />}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Backend Status Indicator */}
        <div className="hidden sm:flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border backdrop-blur-md ${
              backendStatus === 'online'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : backendStatus === 'degraded'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                backendStatus === 'online'
                  ? 'bg-emerald-400 animate-pulse'
                  : backendStatus === 'degraded'
                  ? 'bg-amber-400'
                  : 'bg-rose-400'
              }`}
            />
            <span className="font-mono text-[11px] font-semibold">
              {backendStatus === 'online'
                ? 'MODEL CONNECTED'
                : backendStatus === 'degraded'
                ? 'BACKEND PARTIAL'
                : 'BACKEND OFFLINE'}
            </span>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-navy-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-900/95 backdrop-blur-xl border-b border-slate-800 px-4 pt-3 pb-6 mt-3 space-y-2 animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between ${
                item.highlight
                  ? 'bg-cyan-500 text-black font-semibold'
                  : activeSection === item.id
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <span>{item.label}</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          ))}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>FastAPI Backend Status:</span>
            <span className="font-semibold text-emerald-400 uppercase">
              {backendStatus}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}

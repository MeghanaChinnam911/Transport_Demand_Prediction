import React from 'react';
import { Bus, Globe, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onNavClick }) {
  return (
    <footer className="bg-navy-950 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white">
                <Bus className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white tracking-wide">
                TRANSIT<span className="text-cyan-400">.AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Public Transport Demand Prediction & Smart Fleet Recommendation web application powered by XGBoost & FastAPI.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><button onClick={() => onNavClick('overview')} className="hover:text-cyan-400">Overview</button></li>
              <li><button onClick={() => onNavClick('dataset')} className="hover:text-cyan-400">Dataset Explorer</button></li>
              <li><button onClick={() => onNavClick('eda')} className="hover:text-cyan-400">EDA Dashboard</button></li>
              <li><button onClick={() => onNavClick('model')} className="hover:text-cyan-400">XGBoost Model</button></li>
              <li><button onClick={() => onNavClick('prediction')} className="hover:text-cyan-400 font-semibold text-cyan-400">Live Prediction</button></li>
            </ul>
          </div>

          {/* Key Performance Indicators */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Model Specs</h4>
            <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
              <li>MAE: 7.1105</li>
              <li>RMSE: 14.2164</li>
              <li>R² Score: 0.7777</li>
              <li>Holdout Test Set: 24,660 trips</li>
            </ul>
          </div>

          {/* Technology Badges */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Tech Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400">Python 3.10</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400">FastAPI</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400">XGBoost</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400">Scikit-Learn</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400">React 18</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400">Tailwind CSS</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Transit.AI — Public Transport Demand Prediction Project
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified against original notebook & .pkl model</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import { Bus, Cpu, BarChart3, ShieldCheck, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

export default function Hero({ onExploreClick, onPredictionClick }) {
  const metrics = [
    { value: '100K', label: 'Processed Records', subtext: '0 nulls, 0 duplicates', icon: BarChart3, color: 'from-cyan-500 to-blue-500' },
    { value: '14', label: 'Selected Features', subtext: 'Temporal, weather & ops', icon: Cpu, color: 'from-blue-500 to-indigo-500' },
    { value: 'XGBoost', label: 'Trained Regressor', subtext: 'Hist Tree method (depth 7)', icon: Bus, color: 'from-indigo-500 to-purple-500' },
    { value: '0.7777', label: 'R² Score', subtext: 'Unseen chronological holdout', icon: ShieldCheck, color: 'from-cyan-400 to-emerald-400' },
  ];

  return (
    <section id="overview" className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Decorative Gradients & Grid */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-600/10 blur-[90px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-semibold shadow-lg shadow-cyan-500/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>XGBoost Passenger Forecasting & Fleet Planner</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Public Transport <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Demand Prediction
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl font-medium text-cyan-200/80">
            AI-Powered Demand Forecasting & Smart Fleet Planning
          </p>

          {/* Description */}
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal max-w-2xl mx-auto">
            An XGBoost-based machine learning system that predicts passenger demand using temporal, route, weather and operational features and converts the prediction into an actionable fleet recommendation.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onPredictionClick}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-3 transform hover:scale-[1.02] transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Try Live Prediction</span>
            </button>
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-navy-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-base flex items-center justify-center gap-2 transition-all"
            >
              <span>Explore Project</span>
              <ArrowRight className="w-5 h-5 text-cyan-400" />
            </button>
          </div>

          {/* Verified Guarantee Pill */}
          <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real PKL Model Connected
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 168h Rolling Historical Mean
            </span>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-16">
          {metrics.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 relative overflow-hidden group hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {item.value}
                  </div>
                  <div className="text-sm font-semibold text-slate-200">
                    {item.label}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    {item.subtext}
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/15 transition-all" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

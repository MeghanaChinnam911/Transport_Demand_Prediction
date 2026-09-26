import React from 'react';
import { GitCommit, Layers, Server, Cpu, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ArchitectureTimeline() {
  const timelineSteps = [
    { title: "Dataset Ingestion", desc: "100,000 raw trip records loaded" },
    { title: "Data Cleaning", desc: "Missing & duplicate validation" },
    { title: "EDA Analysis", desc: "Hourly & weather pattern extraction" },
    { title: "Feature Engineering", desc: "7 calendar signals & 168h rolling mean" },
    { title: "Chronological Split", desc: "80% Train / 20% Test holdout" },
    { title: "XGBoost Training", desc: "Hist tree gradient boosting" },
    { title: "Model Evaluation", desc: "MAE 7.1105, R² 0.7777 verified" },
    { title: "Live Prediction", desc: "FastAPI inference endpoint" },
    { title: "Fleet Recommendation", desc: "Dynamic vehicle allocation logic" }
  ];

  const archNodes = [
    { name: "USER", label: "Browser UI", type: "client" },
    { name: "REACT FRONTEND", label: "Vite + Tailwind", type: "client" },
    { name: "FASTAPI BACKEND", label: "Python REST API", type: "server" },
    { name: "PREPROCESSING", label: "Timestamp normalization", type: "server" },
    { name: "FEATURE ENGINEERING", label: "168h Rolling Mean", type: "server" },
    { name: "XGBOOST PKL MODEL", label: "Scikit-Learn Pipeline", type: "model" },
    { name: "PREDICTED DEMAND", label: "Passenger count score", type: "output" },
    { name: "RECOMMENDATION LOGIC", label: "Capacity & vehicle math", type: "output" },
    { name: "RESULTS → REACT UI", label: "Dynamic visual rendering", type: "client" }
  ];

  return (
    <section className="py-20 relative border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section 1: End-to-End Methodology Timeline */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-semibold">
              <GitCommit className="w-3.5 h-3.5" /> Project Methodology
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              End-to-End Development Flow
            </h2>
            <p className="text-slate-300 text-sm">
              Chronological progression from data ingestion to live web application deployment.
            </p>
          </div>

          <div className="glass-panel p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-3">
              {timelineSteps.map((t, idx) => (
                <div key={idx} className="bg-navy-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 flex flex-col justify-between">
                  <span className="text-[10px] font-mono font-bold text-cyan-400">STEP {idx + 1}</span>
                  <h4 className="font-bold text-white text-xs leading-tight">{t.title}</h4>
                  <p className="text-[10px] text-slate-400">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: System Architecture Diagram */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" /> Full Stack System Topology
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              Live Application Architecture
            </h2>
          </div>

          <div className="glass-panel p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-3 relative">
              {archNodes.map((n, idx) => (
                <div key={idx} className="relative">
                  <div className={`p-4 rounded-xl border text-center space-y-1 h-full flex flex-col justify-between ${
                    n.type === 'client'
                      ? 'bg-navy-950 border-cyan-500/40 text-cyan-300'
                      : n.type === 'server'
                      ? 'bg-navy-950 border-blue-500/40 text-blue-300'
                      : n.type === 'model'
                      ? 'bg-navy-950 border-emerald-500/50 text-emerald-300 font-bold'
                      : 'bg-navy-950 border-purple-500/40 text-purple-300'
                  }`}>
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">{n.type}</div>
                    <div className="font-extrabold text-white text-xs">{n.name}</div>
                    <div className="text-[10px] text-slate-400">{n.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

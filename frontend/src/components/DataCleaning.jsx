import React from 'react';
import { Filter, ArrowRight, CheckCircle2, ShieldCheck, Database, Calendar, FileSearch } from 'lucide-react';

export default function DataCleaning() {
  const steps = [
    { title: "Raw Dataset", desc: "100,000 trips x 32 initial columns", icon: Database, badge: "Input" },
    { title: "Column Selection", desc: "Keep 14 domain-essential features", icon: Filter, badge: "Filtering" },
    { title: "Missing Analysis", desc: "0 missing values across all columns", icon: FileSearch, badge: "Validation" },
    { title: "Duplicate Check", desc: "Group route/timestamp duplicates by mean", icon: CheckCircle2, badge: "Deduplication" },
    { title: "Timestamp Conv.", desc: "Standardize to datetime ISO series", icon: Calendar, badge: "Formatting" },
    { title: "Validation", desc: "Enforce passenger_count >= 0 constraint", icon: ShieldCheck, badge: "Sanity" },
    { title: "Clean Dataset", desc: "Ready for XGBoost feature engineering", icon: CheckCircle2, badge: "Output", accent: true }
  ];

  return (
    <section id="cleaning" className="py-20 relative border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-semibold">
            <Filter className="w-3.5 h-3.5" /> Rigorous Data Processing
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Data Cleaning & Validation Pipeline
          </h2>
          <p className="text-slate-300 text-base">
            Notebook-verified preprocessing workflow to ensure zero missing entries, zero invalid counts, and consistent temporal indexes.
          </p>
        </div>

        {/* Pipeline Diagram */}
        <div className="glass-panel p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {steps.map((s, idx) => {
              const IconComponent = s.icon;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-xl border space-y-3 transition-all ${
                    s.accent
                      ? 'bg-gradient-to-b from-cyan-950/60 to-navy-950 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                      : 'bg-navy-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">Step 0{idx + 1}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${s.accent ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-300'}`}>
                      {s.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.accent ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-cyan-400'}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-white text-sm">{s.title}</h3>
                  </div>
                  <p className="text-slate-400 text-xs">{s.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Validation Code Insights Box */}
          <div className="mt-8 p-5 rounded-xl bg-navy-950 border border-slate-800 text-xs font-mono space-y-2 text-slate-300">
            <div className="text-cyan-400 font-bold font-sans text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Notebook Validation Snippet:
            </div>
            <pre className="overflow-x-auto p-3 rounded bg-black/40 text-cyan-300/90 leading-relaxed text-[11px]">
{`raw_bus['timestamp'] = pd.to_datetime(raw_bus['timestamp'], errors='coerce')
raw_bus = raw_bus.dropna(subset=['timestamp', 'passenger_count']).copy()
raw_bus = raw_bus[raw_bus['passenger_count'] >= 0]
raw_bus = raw_bus.sort_values(['route_id', 'timestamp']).reset_index(drop=True)`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

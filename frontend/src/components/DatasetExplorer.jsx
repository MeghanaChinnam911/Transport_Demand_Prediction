import React from 'react';
import { Database, CheckCircle, Tag, Layers, Filter, Sparkles, Hash } from 'lucide-react';

export default function DatasetExplorer({ stats }) {
  const featureGroups = [
    { title: "TIME", color: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10", features: ["timestamp"] },
    { title: "ROUTE", color: "border-blue-500/40 text-blue-400 bg-blue-500/10", features: ["route_id", "origin_station", "dest_station"] },
    { title: "DEMAND", color: "border-amber-500/40 text-amber-400 bg-amber-500/10", features: ["passenger_count (Target)"] },
    { title: "WEATHER", color: "border-indigo-500/40 text-indigo-400 bg-indigo-500/10", features: ["weather_condition", "temperature_c"] },
    { title: "OPERATIONS", color: "border-purple-500/40 text-purple-400 bg-purple-500/10", features: ["headway_min", "vehicle_capacity"] },
    { title: "CONTEXT", color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10", features: ["is_peak_hour", "is_weekend", "is_holiday", "is_school_hours", "is_night_service"] },
  ];

  const qualityItems = [
    { label: "Missing Values", val: "0", sub: "100% complete dataset", status: "pass" },
    { label: "Duplicate Rows", val: "0", sub: "No redundant trips", status: "pass" },
    { label: "Invalid Timestamps", val: "0", sub: "Clean datetime index", status: "pass" },
    { label: "Negative Demand", val: "0", sub: "Strict non-negative check", status: "pass" },
  ];

  const passengerStats = [
    { label: "Mean Passenger Count", val: stats?.mean_passenger_count || "25.1996" },
    { label: "Median Passenger Count", val: stats?.median_passenger_count || "17" },
    { label: "Minimum Demand", val: stats?.min_passenger_count || "0" },
    { label: "Maximum Demand", val: stats?.max_passenger_count || "80" },
    { label: "Zero-Demand Trips", val: stats?.zero_passenger_records ? stats.zero_passenger_records.toLocaleString() : "36,805" },
  ];

  return (
    <section id="dataset" className="py-20 relative bg-navy-950/60 border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-semibold">
            <Database className="w-3.5 h-3.5" /> Source Data Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Dataset Explorer: <span className="font-mono text-cyan-400">processed_bus.csv</span>
          </h2>
          <p className="text-slate-300 text-base">
            Verified dataset containing 100,000 observations processed across 15 transit routes from Jan 1, 2020 to Dec 30, 2020.
          </p>
        </div>

        {/* Dataset Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="glass-panel p-5 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">100,000</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Total Records</div>
          </div>
          <div className="glass-panel p-5 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">32 → 14</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Raw vs Selected Cols</div>
          </div>
          <div className="glass-panel p-5 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">0</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Null / Duplicate Errors</div>
          </div>
          <div className="glass-panel p-5 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">15</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Active Urban Routes</div>
          </div>
        </div>

        {/* Feature Categories Grid */}
        <div className="mb-14">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" /> Selected Feature Categories (14 Features)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featureGroups.map((grp, idx) => (
              <div key={idx} className="glass-panel p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${grp.color}`}>
                    {grp.title}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{grp.features.length} col(s)</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {grp.features.map((feat, fidx) => (
                    <span
                      key={fidx}
                      className="px-2.5 py-1 rounded-lg bg-navy-950 border border-slate-700/80 text-xs font-mono text-slate-200"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Checks & Passenger Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Data Quality Verification */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" /> Verified Data Quality Checks
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {qualityItems.map((q, idx) => (
                <div key={idx} className="bg-navy-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400">{q.label}</div>
                  <div className="text-xl font-bold text-emerald-400 font-mono">{q.val}</div>
                  <div className="text-[11px] text-slate-400">{q.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Passenger Statistics */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Hash className="w-5 h-5 text-cyan-400" /> Passenger Demand Statistics
            </h3>
            <div className="space-y-3">
              {passengerStats.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-navy-950 border border-slate-800">
                  <span className="text-xs font-medium text-slate-300">{s.label}</span>
                  <span className="text-sm font-bold font-mono text-cyan-400">{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

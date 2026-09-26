import React from 'react';
import { Cpu, Calendar, Clock, History, ArrowRight, ShieldCheck, ListFilter } from 'lucide-react';

export default function FeatureEngineering() {
  const calendarFeatures = [
    { name: "hour", desc: "0 - 23 hourly breakdown" },
    { name: "day_of_week", desc: "0 (Mon) - 6 (Sun)" },
    { name: "day", desc: "Day of month (1-31)" },
    { name: "month", desc: "Month of year (1-12)" },
    { name: "day_of_year", desc: "Day index (1-366)" },
    { name: "week_of_year", desc: "ISO week number (1-53)" },
    { name: "quarter", desc: "Calendar quarter (1-4)" },
  ];

  const modelFeaturesList = [
    'route_id', 'origin_station', 'dest_station', 'weather_condition',
    'temperature_c', 'headway_min', 'vehicle_capacity', 'is_peak_hour',
    'is_weekend', 'is_holiday', 'is_school_hours', 'is_night_service',
    'hour', 'day_of_week', 'day', 'month', 'day_of_year',
    'week_of_year', 'quarter', 'rolling_mean_168h'
  ];

  return (
    <section id="features" className="py-20 relative border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" /> Feature Transformation Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Feature Engineering & Historical Windowing
          </h2>
          <p className="text-slate-300 text-base">
            Extracting rich calendar signals and strict past-only rolling demand metrics without target leakage.
          </p>
        </div>

        {/* Feature Pipeline Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-14">
          <div className="glass-panel p-5 text-center space-y-2 relative border-cyan-500/30">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 font-bold mx-auto flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">01. Timestamp</h3>
            <p className="text-xs text-slate-400">Raw Datetime ISO Series</p>
          </div>

          <div className="glass-panel p-5 text-center space-y-2 relative">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 font-bold mx-auto flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">02. Calendar Features</h3>
            <p className="text-xs text-slate-400">7 Derived Temporal Signals</p>
          </div>

          <div className="glass-panel p-5 text-center space-y-2 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 font-bold mx-auto flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">03. Historical Demand</h3>
            <p className="text-xs text-slate-400">168-Hour Rolling Mean</p>
          </div>

          <div className="glass-panel p-5 text-center space-y-2 relative bg-gradient-to-b from-navy-900 to-navy-950 border-cyan-500/50">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 text-black font-bold mx-auto flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">04. Model Input Vector</h3>
            <p className="text-xs text-cyan-300">20 Final Features</p>
          </div>
        </div>

        {/* Temporal & Historical Explanation Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Calendar Features */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" /> Derived Calendar Features (7)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {calendarFeatures.map((f, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-navy-950 border border-slate-800 space-y-1">
                  <div className="font-mono text-xs font-bold text-cyan-400">{f.name}</div>
                  <div className="text-[11px] text-slate-400">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Demand Feature Box */}
          <div className="glass-panel p-6 space-y-4 border-cyan-500/30">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-400" /> Historical Demand Feature (168h Rolling Mean)
            </h3>
            <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-cyan-400">rolling_mean_168h</span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold">
                  7-Day Window
                </span>
              </div>
              <blockquote className="text-xs text-slate-300 italic border-l-2 border-cyan-400 pl-3 py-1">
                "Historical demand information is derived from previous observations so future target information is not used."
              </blockquote>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates the average hourly passenger demand over the preceding 168-hour window (1 week) strictly before the target prediction timestamp, capturing weekly seasonality and route baseline traffic.
              </p>
            </div>
          </div>
        </div>

        {/* 20 Final Features Grid */}
        <div className="glass-panel p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-cyan-400" /> Complete 20 Model Input Features (Exact Order)
          </h3>
          <div className="flex flex-wrap gap-2">
            {modelFeaturesList.map((feat, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-navy-950 border border-slate-800 font-mono text-xs text-slate-200 flex items-center gap-1.5 hover:border-cyan-500/50"
              >
                <span className="text-[10px] text-slate-500 font-bold">{idx + 1}.</span>
                {feat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

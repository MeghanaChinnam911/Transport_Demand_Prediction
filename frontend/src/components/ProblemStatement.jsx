import React from 'react';
import { Clock, Route, CloudSun, Flame, Calendar, Bus, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ProblemStatement() {
  const factors = [
    { icon: Clock, title: "Temporal Dynamics", desc: "Rush hours (7-9 AM, 4-7 PM) create distinct passenger spikes compared to off-peak and night hours." },
    { icon: Route, title: "Route Variance", desc: "Urban trunk lines experience higher commuter density than suburban connection routes." },
    { icon: CloudSun, title: "Weather Conditions", desc: "Rain, snow, or extreme temperatures significantly shift commuters from walking/cycling to public transit." },
    { icon: Flame, title: "Operational Headway", desc: "Bus dispatch frequency (headway) and vehicle seating capacity directly regulate crowding levels." },
    { icon: Calendar, title: "Day / Calendar Type", desc: "Weekdays vs weekends, school periods, and holidays change routine commuting habits." },
  ];

  const workflowSteps = [
    { step: "01", name: "DATA", desc: "100K processed records & 20 engineered features", color: "from-cyan-500 to-blue-500" },
    { step: "02", name: "DEMAND PREDICTION", desc: "XGBoost model forecasts passenger volume", color: "from-blue-500 to-indigo-500" },
    { step: "03", name: "FLEET RECOMMENDATION", desc: "Calculates optimal vehicle fleet allocation", color: "from-indigo-500 to-purple-500" },
    { step: "04", name: "SMART PLANNING", desc: "Reduces overcrowding & empty bus trips", color: "from-purple-500 to-cyan-400" },
  ];

  return (
    <section id="problem" className="py-20 relative border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" /> Problem & Operational Objective
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Optimizing Transit Capacity Under Uncertainty
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Public transport demand continuously changes depending on time, route, weather, peak hours, weekends, holidays, and operational conditions. Over-allocating buses leads to empty trips and fuel waste, while under-allocating causes severe crowding and service delays.
          </p>
        </div>

        {/* Factors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {factors.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={idx} className="glass-panel-interactive p-5 space-y-3 flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-xs leading-normal">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Workflow Diagram: DATA -> DEMAND PREDICTION -> FLEET RECOMMENDATION -> SMART PLANNING */}
        <div className="glass-panel p-8 relative overflow-hidden">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white">End-to-End Decision Workflow</h3>
            <p className="text-xs text-slate-400">Converting raw sensor and schedule data into actionable fleet decisions</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {workflowSteps.map((s, idx) => (
              <div key={idx} className="relative">
                <div className="bg-navy-950 p-5 rounded-xl border border-slate-800 space-y-2 h-full flex flex-col justify-between hover:border-cyan-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">{s.step}</span>
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${s.color}`} />
                  </div>
                  <h4 className="font-extrabold text-white text-base tracking-wide">{s.name}</h4>
                  <p className="text-slate-400 text-xs">{s.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-navy-900 border border-slate-700 text-cyan-400 items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

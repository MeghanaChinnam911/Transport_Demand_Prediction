import React from 'react';
import { Lightbulb, TrendingUp, Compass, Cpu, Bus } from 'lucide-react';

export default function Insights() {
  const cards = [
    {
      title: "Demand Forecasting",
      desc: "Predict expected passenger demand accurately across varying times of day, weather events, and calendar periods using temporal gradient boosting.",
      icon: TrendingUp,
      color: "from-cyan-500 to-blue-500"
    },
    {
      title: "Route Intelligence",
      desc: "Understand demand patterns across all 15 transit routes to identify peak corridors and optimize suburban vs urban station stop frequencies.",
      icon: Compass,
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "Operational Planning",
      desc: "Estimate required vehicle capacity in advance to minimize empty bus miles, fuel wastage, and transit operator overtime costs.",
      icon: Cpu,
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: "Smart Fleet Recommendation",
      desc: "Convert raw XGBoost passenger forecasts into clear, actionable fleet dispatch recommendations with built-in 10% safety buffer padding.",
      icon: Bus,
      color: "from-purple-500 to-cyan-400"
    }
  ];

  return (
    <section id="insights" className="py-20 relative bg-navy-950/40 border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-semibold">
            <Lightbulb className="w-3.5 h-3.5" /> Business & Operational Impact
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            FROM DATA TO DECISION
          </h2>
          <p className="text-slate-300 text-base">
            How machine learning forecasting delivers tangible efficiency to public transit operators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, idx) => {
            const IconComp = c.icon;
            return (
              <div key={idx} className="glass-panel-interactive p-6 space-y-4 flex flex-col justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${c.color} flex items-center justify-center text-black font-bold shadow-lg shadow-cyan-500/10`}>
                  <IconComp className="w-6 h-6 text-navy-950" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-lg">{c.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{c.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

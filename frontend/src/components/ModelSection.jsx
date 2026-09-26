import React from 'react';
import { Cpu, GitBranch, ShieldCheck, ArrowRight, Settings, Calendar, Layers } from 'lucide-react';

export default function ModelSection() {
  const hyperparams = [
    { name: "n_estimators", val: "100", desc: "Total gradient boosted decision trees" },
    { name: "learning_rate", val: "0.1", desc: "Boosting shrinkage step size" },
    { name: "max_depth", val: "7", desc: "Maximum depth per decision tree" },
    { name: "subsample", val: "0.9", desc: "Subsample ratio of training instances" },
    { name: "colsample_bytree", val: "0.9", desc: "Subsample ratio of columns when constructing trees" },
    { name: "tree_method", val: "hist", desc: "Fast histogram-based tree algorithm" },
    { name: "objective", val: "reg:squarederror", desc: "Squared error regression loss" },
    { name: "random_state", val: "42", desc: "Fixed seed for reproducibility" },
  ];

  const pipelineSteps = [
    { title: "Processed Data", sub: "100K clean trips", color: "from-cyan-500 to-blue-500" },
    { title: "Feature Engineering", sub: "20 temporal & 168h rolling features", color: "from-blue-500 to-indigo-500" },
    { title: "Chronological Split", sub: "80% Train / 20% Test holdout", color: "from-indigo-500 to-purple-500" },
    { title: "XGBoost Regressor", sub: "Hist tree gradient boosting", color: "from-purple-500 to-cyan-400" },
    { title: "Demand Prediction", sub: "Predicted passenger count", color: "from-cyan-400 to-emerald-400" },
  ];

  return (
    <section id="model" className="py-20 relative bg-navy-950/60 border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" /> XGBoost Machine Learning Model
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Model Architecture & Chronological Split
          </h2>
          <p className="text-slate-300 text-base">
            Trained XGBoost Regressor pipeline with Ordinal Encoding for categorical features and Hist tree algorithm for optimal split evaluation.
          </p>
        </div>

        {/* Visual Pipeline Step Flow */}
        <div className="glass-panel p-6 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {pipelineSteps.map((s, idx) => (
              <div key={idx} className="bg-navy-950 p-4 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400">STEP {idx + 1}</span>
                  <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${s.color}`} />
                </div>
                <h4 className="font-bold text-white text-sm">{s.title}</h4>
                <p className="text-[11px] text-slate-400">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hyperparameters Card & Chronological Split Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* XGBoost Hyperparameters Card */}
          <div className="glass-panel p-6 space-y-4 border-cyan-500/30">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-cyan-400" /> Verified XGBoost Model Hyperparameters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hyperparams.map((hp, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-navy-950 border border-slate-800 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-300 font-semibold">{hp.name}</span>
                    <span className="font-mono text-xs font-bold text-cyan-400">{hp.val}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{hp.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chronological Holdout Split Card */}
          <div className="glass-panel p-6 space-y-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-indigo-400" /> Chronological Train / Test Split
            </h3>

            <div className="space-y-4">
              {/* Training Set Box */}
              <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Training Set (Earliest 80%)</span>
                  <span className="font-mono text-xs font-bold text-slate-200">98,639 × 20</span>
                </div>
                <div className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>2020-01-01 01:00:00 → 2020-10-18 14:00:00</span>
                </div>
              </div>

              {/* Testing Set Box */}
              <div className="p-4 rounded-xl bg-navy-950 border border-cyan-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Unseen Holdout Test (Latest 20%)</span>
                  <span className="font-mono text-xs font-bold text-emerald-400">24,660 × 20</span>
                </div>
                <div className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2020-10-18 14:00:00 → 2020-12-30 23:00:00</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                A strict chronological split ensures that past trip data evaluates future performance without future information leaking into past predictions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { ShieldCheck, Award, Info, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ResultsSection() {
  return (
    <section id="results" className="py-20 relative border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" /> Empirical Evaluation
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Model Performance Results
          </h2>
          <p className="text-slate-300 text-base">
            Evaluated strictly on the 24,660 holdout observations from the unseen chronological test period.
          </p>
        </div>

        {/* 3 Prominent Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* MAE Card */}
          <div className="glass-panel p-6 text-center space-y-2 border-cyan-500/30 hover:border-cyan-500/60">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mean Absolute Error</div>
            <div className="text-4xl sm:text-5xl font-extrabold font-mono text-cyan-400">7.1105</div>
            <div className="text-xs text-slate-300">Average error per trip: ~7 passengers</div>
          </div>

          {/* RMSE Card */}
          <div className="glass-panel p-6 text-center space-y-2 border-blue-500/30 hover:border-blue-500/60">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Root Mean Squared Error</div>
            <div className="text-4xl sm:text-5xl font-extrabold font-mono text-blue-400">14.2164</div>
            <div className="text-xs text-slate-300">Standard deviation of residual errors</div>
          </div>

          {/* R² Score Card */}
          <div className="glass-panel p-6 text-center space-y-2 border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-navy-900 hover:border-emerald-500/80">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">R² Score (Coefficient of Det.)</div>
            <div className="text-4xl sm:text-5xl font-extrabold font-mono text-emerald-400">0.7777</div>
            <div className="text-xs text-emerald-300 font-medium">77.77% of total variance explained</div>
          </div>
        </div>

        {/* Evaluated Label & Metric Clarification */}
        <div className="glass-panel p-6 max-w-3xl mx-auto space-y-4">
          <div className="flex items-center gap-3 text-cyan-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <span>Final performance on the unseen chronological test period.</span>
          </div>

          <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>Metric Methodology Note:</span>
            </div>
            <p className="leading-relaxed">
              In regression modeling, <strong className="text-white">R² (0.7777)</strong> represents the proportion of variance in passenger demand explained by the XGBoost features. It is a regression metric and should not be confused with classification accuracy. All metrics reflect true evaluation on unseen future trips.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

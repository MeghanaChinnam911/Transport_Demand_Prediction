import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Sun, CloudRain, Thermometer, Route, Flame, Sparkles } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell
} from 'recharts';
import { apiService } from '../services/api';

export default function EdaDashboard() {
  const [edaData, setEdaData] = useState(null);
  const [activeTab, setActiveTab] = useState('hourly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getEdaStats()
      .then(data => {
        setEdaData(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Failed to load EDA stats:', err);
        setLoading(false);
      });
  }, []);

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-950 border border-slate-700 p-3 rounded-lg shadow-xl text-xs font-sans">
          <p className="font-bold text-cyan-400 mb-1">{label}</p>
          {payload.map((entry, idx) => (
            <p key={idx} className="text-slate-200">
              <span className="text-slate-400">{entry.name || 'Value'}: </span>
              <span className="font-bold font-mono">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const tabs = [
    { id: 'hourly', label: '24-Hour Profile', icon: TrendingUp },
    { id: 'peak', label: 'Peak vs Off-Peak', icon: Flame },
    { id: 'weekend', label: 'Weekday vs Weekend', icon: BarChart3 },
    { id: 'weather', label: 'Weather Impact', icon: CloudRain },
    { id: 'temp', label: 'Temperature Trend', icon: Thermometer },
    { id: 'route', label: 'Demand by Route', icon: Route },
  ];

  return (
    <section id="eda" className="py-20 relative bg-navy-950/40 border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-semibold">
            <BarChart3 className="w-3.5 h-3.5" /> Exploratory Data Analysis
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Interactive EDA Dashboard
          </h2>
          <p className="text-slate-300 text-base">
            Empirical insights extracted directly from 100,000 transit observations.
          </p>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {tabs.map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/20'
                    : 'bg-navy-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <IconComp className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Dynamic Chart Container */}
        <div className="glass-panel p-6 sm:p-8 min-h-[420px] flex flex-col justify-center">
          {loading ? (
            <div className="text-center text-slate-400 space-y-2">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs">Loading empirical dataset aggregations...</p>
            </div>
          ) : edaData ? (
            <div className="w-full space-y-6">
              {/* Tab 1: Hourly Profile */}
              {activeTab === 'hourly' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-bold text-white text-base">Average Passenger Demand Across 24 Hours</h3>
                      <p className="text-xs text-slate-400">Shows clear morning (7-9 AM) and evening (4-7 PM) rush hour spikes.</p>
                    </div>
                  </div>
                  <div className="h-72 sm:h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={edaData.demand_by_hour}>
                        <defs>
                          <linearGradient id="hourlyGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="hour" stroke="#64748B" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="passenger_count" name="Avg Passengers" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#hourlyGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Tab 2: Peak vs Non-Peak */}
              {activeTab === 'peak' && (
                <div>
                  <div className="mb-4">
                    <h3 className="font-bold text-white text-base">Peak vs Non-Peak Passenger Demand</h3>
                    <p className="text-xs text-slate-400">Peak hours experience significantly higher passenger density per bus run.</p>
                  </div>
                  <div className="h-72 sm:h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={edaData.peak_vs_non_peak}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="category" stroke="#64748B" />
                        <YAxis stroke="#64748B" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="avg_demand" name="Avg Demand" fill="#3B82F6" radius={[8, 8, 0, 0]}>
                          {edaData.peak_vs_non_peak.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 1 ? '#06B6D4' : '#3B82F6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Tab 3: Weekday vs Weekend */}
              {activeTab === 'weekend' && (
                <div>
                  <div className="mb-4">
                    <h3 className="font-bold text-white text-base">Weekday vs Weekend Average Demand</h3>
                    <p className="text-xs text-slate-400">Regular office/school commuting drives higher weekday demand.</p>
                  </div>
                  <div className="h-72 sm:h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={edaData.weekday_vs_weekend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="category" stroke="#64748B" />
                        <YAxis stroke="#64748B" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="avg_demand" name="Avg Demand" fill="#6366F1" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Tab 4: Weather Impact */}
              {activeTab === 'weather' && (
                <div>
                  <div className="mb-4">
                    <h3 className="font-bold text-white text-base">Demand by Weather Condition</h3>
                    <p className="text-xs text-slate-400">Adverse weather (rain, snow) shifts short-distance commuters onto public transit.</p>
                  </div>
                  <div className="h-72 sm:h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={edaData.demand_by_weather}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="weather" stroke="#64748B" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#64748B" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="avg_demand" name="Avg Demand" fill="#06B6D4" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Tab 5: Temperature Trend */}
              {activeTab === 'temp' && (
                <div>
                  <div className="mb-4">
                    <h3 className="font-bold text-white text-base">Temperature vs Passenger Demand (°C)</h3>
                    <p className="text-xs text-slate-400">Passenger demand variations grouped across temperature ranges.</p>
                  </div>
                  <div className="h-72 sm:h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={edaData.temp_vs_demand}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="temp_range" stroke="#64748B" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#64748B" />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="avg_demand" name="Avg Demand" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Tab 6: Demand by Route */}
              {activeTab === 'route' && (
                <div>
                  <div className="mb-4">
                    <h3 className="font-bold text-white text-base">Average Demand Across 15 Routes</h3>
                    <p className="text-xs text-slate-400">High-capacity arterial routes show distinct demand peaks.</p>
                  </div>
                  <div className="h-72 sm:h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={edaData.demand_by_route.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="route_id" stroke="#64748B" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#64748B" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="avg_demand" name="Avg Demand" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-slate-400">Unable to load EDA chart data.</div>
          )}
        </div>
      </div>
    </section>
  );
}

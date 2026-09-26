import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Bus, Users, ShieldAlert, CheckCircle, RefreshCw, Layers, ArrowRight, Clock, MapPin, CloudSun, Thermometer, Gauge, AlertTriangle, Route } from 'lucide-react';
import { apiService } from '../services/api';

export default function LivePrediction() {
  const [options, setOptions] = useState(null);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Form input state
  const [routeId, setRouteId] = useState('RT_NEW_000');
  const [predictionDate, setPredictionDate] = useState('2020-10-18');
  const [predictionTime, setPredictionTime] = useState('15:00');
  const [originStation, setOriginStation] = useState('STN_NEW_0136');
  const [destStation, setDestStation] = useState('STN_NEW_0045');
  const [weatherCondition, setWeatherCondition] = useState('cloudy');
  const [temperatureC, setTemperatureC] = useState('18.08');
  const [headwayMin, setHeadwayMin] = useState('14.0');
  const [vehicleCapacity, setVehicleCapacity] = useState('60');
  const [safetyBuffer, setSafetyBuffer] = useState('1.10');

  // Prediction status & result state
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isVerifiedExample, setIsVerifiedExample] = useState(false);

  // Load options on mount
  useEffect(() => {
    apiService.getOptions()
      .then(data => {
        setOptions(data);
        setLoadingOptions(false);
        if (data.route_defaults && data.route_defaults['RT_NEW_000']) {
          const def = data.route_defaults['RT_NEW_000'];
          setOriginStation(def.origin_station);
          setDestStation(def.dest_station);
          setVehicleCapacity(def.vehicle_capacity.toString());
          setHeadwayMin(def.headway_min.toString());
          setTemperatureC(def.temperature_c.toString());
          setWeatherCondition(def.weather_condition);
        }
      })
      .catch(err => {
        console.warn('Could not fetch options:', err);
        setLoadingOptions(false);
      });
  }, []);

  // When Route ID changes, auto-populate intelligent defaults from dataset
  const handleRouteChange = (selectedRoute) => {
    setRouteId(selectedRoute);
    if (options && options.route_defaults && options.route_defaults[selectedRoute]) {
      const def = options.route_defaults[selectedRoute];
      setOriginStation(def.origin_station);
      setDestStation(def.dest_station);
      setVehicleCapacity(def.vehicle_capacity.toString());
      setHeadwayMin(def.headway_min.toString());
      setTemperatureC(def.temperature_c.toString());
      setWeatherCondition(def.weather_condition);
    }
  };

  // Execute Live Prediction (Calls Backend API)
  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    setIsPredicting(true);
    setErrorMessage(null);
    setIsVerifiedExample(false);

    try {
      const formattedTimestamp = `${predictionDate}T${predictionTime}:00`;
      const payload = {
        route_id: routeId,
        timestamp: formattedTimestamp,
        origin_station: originStation,
        dest_station: destStation,
        weather_condition: weatherCondition,
        temperature_c: parseFloat(temperatureC),
        headway_min: parseFloat(headwayMin),
        vehicle_capacity: parseFloat(vehicleCapacity),
        safety_buffer: parseFloat(safetyBuffer)
      };

      const res = await apiService.predictDemand(payload);
      if (res.success) {
        setPredictionResult(res);
      } else {
        setErrorMessage(res.detail || 'Prediction failed. Please check input parameters.');
      }
    } catch (err) {
      console.error('Prediction API Error:', err);
      const detail = err.response?.data?.detail || 'Unable to connect to FastAPI prediction backend. Please verify server status.';
      setErrorMessage(detail);
    } finally {
      setIsPredicting(false);
    }
  };

  // Load Verified Notebook Example
  const handleLoadVerifiedExample = async () => {
    setLoadingOptions(true);
    try {
      const data = await apiService.getVerifiedExample();
      const inp = data.inputs;
      setRouteId(inp.route_id);
      
      const tsParts = inp.timestamp.split('T');
      setPredictionDate(tsParts[0]);
      setPredictionTime(tsParts[1].substring(0, 5));

      setOriginStation(inp.origin_station);
      setDestStation(inp.dest_station);
      setWeatherCondition(inp.weather_condition);
      setTemperatureC(inp.temperature_c.toString());
      setHeadwayMin(inp.headway_min.toString());
      setVehicleCapacity(inp.vehicle_capacity.toString());
      setSafetyBuffer('1.10');

      setIsVerifiedExample(true);

      // Instantly run prediction against model to show dynamic result
      const formattedTimestamp = `${tsParts[0]}T${tsParts[1].substring(0, 5)}:00`;
      const res = await apiService.predictDemand({
        route_id: inp.route_id,
        timestamp: formattedTimestamp,
        origin_station: inp.origin_station,
        dest_station: inp.dest_station,
        weather_condition: inp.weather_condition,
        temperature_c: inp.temperature_c,
        headway_min: inp.headway_min,
        vehicle_capacity: inp.vehicle_capacity,
        safety_buffer: 1.10
      });
      setPredictionResult(res);
    } catch (err) {
      console.error('Failed to load verified example:', err);
    } finally {
      setLoadingOptions(false);
    }
  };

  return (
    <section id="prediction" className="py-20 relative bg-navy-950/80 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-400 text-xs font-semibold shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Core Feature: Interactive ML Inference
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            LIVE DEMAND PREDICTION & FLEET ALLOCATION
          </h2>
          <p className="text-slate-300 text-base">
            Select route, time, weather, and bus parameters. The FastAPI backend runs feature engineering, loads the actual trained XGBoost <span className="font-mono text-cyan-400">.pkl</span> model, and computes the dynamic fleet recommendation.
          </p>
        </div>

        {/* Top Control Bar with Verified Example Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 glass-panel p-4">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Dataset & Model: <strong className="text-white font-mono">public_transport_demand_model.pkl</strong></span>
          </div>
          <button
            type="button"
            onClick={handleLoadVerifiedExample}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/40 text-xs font-semibold flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Load Verified Example (RT_NEW_000)</span>
          </button>
        </div>

        {/* Main Grid: Form Left, Results Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Prediction Input Form (7 Cols) */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 border-cyan-500/30">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Bus className="w-5 h-5 text-cyan-400" /> Prediction Inputs
            </h3>

            <form onSubmit={handlePredict} className="space-y-5">
              {/* Row 1: Route ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Route className="w-3.5 h-3.5 text-cyan-400" /> Route ID
                </label>
                <select
                  value={routeId}
                  onChange={(e) => handleRouteChange(e.target.value)}
                  className="w-full bg-navy-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  {options?.routes ? (
                    options.routes.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))
                  ) : (
                    <option value="RT_NEW_000">RT_NEW_000</option>
                  )}
                </select>
              </div>

              {/* Row 2: Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> Prediction Date
                  </label>
                  <input
                    type="date"
                    value={predictionDate}
                    onChange={(e) => setPredictionDate(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> Prediction Time
                  </label>
                  <input
                    type="time"
                    value={predictionTime}
                    onChange={(e) => setPredictionTime(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Row 3: Origin & Destination Stations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Origin Station
                  </label>
                  <select
                    value={originStation}
                    onChange={(e) => setOriginStation(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  >
                    {options?.origin_stations ? (
                      options.origin_stations.map(stn => (
                        <option key={stn} value={stn}>{stn}</option>
                      ))
                    ) : (
                      <option value="STN_NEW_0136">STN_NEW_0136</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> Destination Station
                  </label>
                  <select
                    value={destStation}
                    onChange={(e) => setDestStation(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  >
                    {options?.dest_stations ? (
                      options.dest_stations.map(stn => (
                        <option key={stn} value={stn}>{stn}</option>
                      ))
                    ) : (
                      <option value="STN_NEW_0045">STN_NEW_0045</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Row 4: Weather & Temperature */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <CloudSun className="w-3.5 h-3.5 text-cyan-400" /> Weather Condition
                  </label>
                  <select
                    value={weatherCondition}
                    onChange={(e) => setWeatherCondition(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 capitalize"
                  >
                    {options?.weather_conditions ? (
                      options.weather_conditions.map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))
                    ) : (
                      ['clear', 'cloudy', 'light_rain', 'fog', 'heavy_rain', 'snow', 'storm'].map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={temperatureC}
                    onChange={(e) => setTemperatureC(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Row 5: Headway & Vehicle Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-indigo-400" /> Headway (minutes)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={headwayMin}
                    onChange={(e) => setHeadwayMin(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Bus className="w-3.5 h-3.5 text-cyan-400" /> Vehicle Capacity (passengers)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={vehicleCapacity}
                    onChange={(e) => setVehicleCapacity(e.target.value)}
                    className="w-full bg-navy-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Submit Predict Button */}
              <button
                type="submit"
                disabled={isPredicting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isPredicting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Running XGBoost prediction...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>🚀 PREDICT DEMAND</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Prediction Output & Fleet Recommendation (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-rose-200 block text-sm">Prediction Error:</strong>
                  {errorMessage}
                </div>
              </div>
            )}

            {predictionResult ? (
              <div className="space-y-6">
                {/* Main Animated Result Card */}
                <div className="glass-panel p-6 sm:p-8 relative overflow-hidden border-cyan-500/50 glow-effect">
                  {isVerifiedExample && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                      Verified Notebook Example
                    </div>
                  )}

                  <div className="text-center space-y-4">
                    <div className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
                      PREDICTION RESULT
                    </div>

                    {/* Predicted Passenger Count */}
                    <div className="py-3">
                      <div className="text-6xl sm:text-7xl font-extrabold text-white font-mono tracking-tight flex items-center justify-center gap-2">
                        <Users className="w-10 h-10 text-cyan-400" />
                        {predictionResult.recommendation.predicted_passengers}
                      </div>
                      <div className="text-xs font-semibold text-slate-300 mt-1">
                        Predicted Passengers <span className="text-slate-400 font-mono">(Raw: {predictionResult.recommendation.raw_prediction})</span>
                      </div>
                    </div>

                    {/* Demand Level Badge */}
                    <div>
                      <span
                        className={`inline-block px-5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider border shadow-md ${
                          predictionResult.recommendation.demand_level === 'Low'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : predictionResult.recommendation.demand_level === 'Moderate'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {predictionResult.recommendation.demand_level} Demand Level
                      </span>
                    </div>

                    {/* Recommendation Details */}
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800">
                      <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 text-center">
                        <div className="text-xl font-bold text-cyan-400 font-mono">
                          🚍 {predictionResult.recommendation.recommended_vehicles}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-1">Recommended Vehicles</div>
                      </div>

                      <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 text-center">
                        <div className="text-xl font-bold text-indigo-400 font-mono">
                          🪑 {predictionResult.recommendation.planned_capacity}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-1">Planned Capacity</div>
                      </div>

                      <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 text-center">
                        <div className="text-xl font-bold text-emerald-400 font-mono">
                          📊 {predictionResult.recommendation.spare_seats}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-1">Spare Seats</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fleet Recommendation Flow Diagram */}
                <div className="glass-panel p-5 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-400" /> Recommendation Calculation Chain
                  </h4>
                  <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 text-xs font-mono space-y-1.5 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Predicted Demand:</span>
                      <span className="text-cyan-400 font-bold">{predictionResult.recommendation.predicted_passengers} pax</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Vehicle Capacity:</span>
                      <span className="text-slate-200">{predictionResult.recommendation.vehicle_capacity} seats</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Safety Buffer:</span>
                      <span className="text-slate-200">1.10 (+10% safety margin)</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-800 text-emerald-400 font-bold">
                      <span>Calculated 168h Rolling Mean:</span>
                      <span>{predictionResult.features_derived.rolling_mean_168h}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-8 text-center space-y-4 border-dashed border-slate-800">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                  <Bus className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">No Active Prediction</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Select input parameters and click <strong className="text-cyan-400">Predict Demand</strong> to calculate live fleet recommendation using your trained model.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

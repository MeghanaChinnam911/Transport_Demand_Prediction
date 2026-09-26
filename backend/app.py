import os
import math
import joblib
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

app = FastAPI(
    title="Public Transport Demand Prediction & Fleet Recommendation API",
    description="Backend API powered by XGBoost for passenger demand forecasting and smart vehicle allocation.",
    version="1.0.0"
)

# Enable CORS for local development and live deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Locate data and model files flexibly
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)

def find_file(candidates: List[str]) -> str:
    for path in candidates:
        if os.path.exists(path):
            return path
    raise FileNotFoundError(f"None of the candidate paths exist: {candidates}")

CSV_PATH = find_file([
    os.path.join(PROJECT_ROOT, "data", "processed_bus.csv"),
    os.path.join(BASE_DIR, "data", "processed_bus.csv"),
    os.path.join(PROJECT_ROOT, "processed_bus.csv"),
    "processed_bus.csv"
])

MODEL_PATH = find_file([
    os.path.join(PROJECT_ROOT, "data", "public_transport_demand_model.pkl"),
    os.path.join(BASE_DIR, "data", "public_transport_demand_model.pkl"),
    os.path.join(PROJECT_ROOT, "public_transport_demand_model.pkl"),
    "public_transport_demand_model.pkl"
])

# Global variables for loaded model and data
model = None
raw_bus = None
model_features = [
    'route_id', 'origin_station', 'dest_station', 'weather_condition',
    'temperature_c', 'headway_min', 'vehicle_capacity', 'is_peak_hour',
    'is_weekend', 'is_holiday', 'is_school_hours', 'is_night_service',
    'hour', 'day_of_week', 'day', 'month', 'day_of_year',
    'week_of_year', 'quarter', 'rolling_mean_168h'
]

eda_summary_cache = {}

@app.on_event("startup")
def load_assets():
    global model, raw_bus, eda_summary_cache
    print(f"Loading model from: {MODEL_PATH}")
    model = joblib.load(MODEL_PATH)
    
    print(f"Loading dataset from: {CSV_PATH}")
    df = pd.read_csv(CSV_PATH)
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
    df = df.dropna(subset=['timestamp', 'passenger_count']).copy()
    df = df[df['passenger_count'] >= 0]
    df = df.sort_values(['route_id', 'timestamp']).reset_index(drop=True)
    raw_bus = df
    
    # Pre-compute EDA aggregations for instant chart responses
    df_eda = raw_bus.copy()
    df_eda['hour'] = df_eda['timestamp'].dt.hour
    df_eda['day_name'] = df_eda['timestamp'].dt.day_name()
    
    # Hourly demand avg
    hourly_avg = df_eda.groupby('hour')['passenger_count'].mean().round(2).to_dict()
    hourly_data = [{"hour": f"{h:02d}:00", "passenger_count": float(hourly_avg.get(h, 0))} for h in range(24)]
    
    # Peak vs Non-peak
    peak_data = [
        {
            "category": "Non-Peak Hours",
            "avg_demand": round(float(df_eda[df_eda['is_peak_hour'] == 0]['passenger_count'].mean()), 2),
            "median_demand": float(df_eda[df_eda['is_peak_hour'] == 0]['passenger_count'].median()),
            "count": int((df_eda['is_peak_hour'] == 0).sum())
        },
        {
            "category": "Peak Hours",
            "avg_demand": round(float(df_eda[df_eda['is_peak_hour'] == 1]['passenger_count'].mean()), 2),
            "median_demand": float(df_eda[df_eda['is_peak_hour'] == 1]['passenger_count'].median()),
            "count": int((df_eda['is_peak_hour'] == 1).sum())
        }
    ]
    
    # Weekday vs Weekend
    weekend_data = [
        {
            "category": "Weekday",
            "avg_demand": round(float(df_eda[df_eda['is_weekend'] == 0]['passenger_count'].mean()), 2),
            "median_demand": float(df_eda[df_eda['is_weekend'] == 0]['passenger_count'].median())
        },
        {
            "category": "Weekend",
            "avg_demand": round(float(df_eda[df_eda['is_weekend'] == 1]['passenger_count'].mean()), 2),
            "median_demand": float(df_eda[df_eda['is_weekend'] == 1]['passenger_count'].median())
        }
    ]
    
    # Demand by Weather
    weather_grp = df_eda.groupby('weather_condition')['passenger_count'].agg(['mean', 'count']).reset_index()
    weather_data = [
        {
            "weather": row['weather_condition'],
            "avg_demand": round(float(row['mean']), 2),
            "records": int(row['count'])
        }
        for _, row in weather_grp.iterrows()
    ]
    
    # Temperature vs Demand (8 bins)
    temp_bins = pd.cut(df_eda['temperature_c'], bins=8)
    temp_grp = df_eda.groupby(temp_bins, observed=False)['passenger_count'].mean().reset_index()
    temp_data = [
        {
            "temp_range": f"{round(row['temperature_c'].left, 1)} to {round(row['temperature_c'].right, 1)} °C",
            "avg_demand": round(float(row['passenger_count']), 2) if not pd.isna(row['passenger_count']) else 0.0
        }
        for _, row in temp_grp.iterrows()
    ]
    
    # Route demand
    route_grp = df_eda.groupby('route_id')['passenger_count'].agg(['mean', 'count']).reset_index().sort_values('mean', ascending=False)
    route_data = [
        {
            "route_id": row['route_id'],
            "avg_demand": round(float(row['mean']), 2),
            "trips": int(row['count'])
        }
        for _, row in route_grp.iterrows()
    ]
    
    # Passenger Count Distribution (bins of width 5)
    counts, bin_edges = np.histogram(df_eda['passenger_count'], bins=16, range=(0, 80))
    dist_data = [
        {
            "bin": f"{int(bin_edges[i])}-{int(bin_edges[i+1])}",
            "frequency": int(counts[i])
        }
        for i in range(len(counts))
    ]
    
    # Feature Correlation Matrix
    corr_cols = [
        'passenger_count', 'temperature_c', 'headway_min', 'vehicle_capacity',
        'is_peak_hour', 'is_weekend', 'is_school_hours', 'is_night_service'
    ]
    corr_df = df_eda[corr_cols].corr().round(3)
    corr_data = {col: corr_df[col].to_dict() for col in corr_cols}

    eda_summary_cache = {
        "demand_by_hour": hourly_data,
        "peak_vs_non_peak": peak_data,
        "weekday_vs_weekend": weekend_data,
        "demand_by_weather": weather_data,
        "temp_vs_demand": temp_data,
        "demand_by_route": route_data,
        "demand_distribution": dist_data,
        "correlation_matrix": corr_data,
        "dataset_stats": {
            "total_records": len(df_eda),
            "selected_columns": 14,
            "total_raw_columns": 32,
            "missing_values": int(df_eda.isnull().sum().sum()),
            "duplicate_rows": int(df_eda.duplicated().sum()),
            "mean_passenger_count": round(float(df_eda['passenger_count'].mean()), 4),
            "median_passenger_count": int(df_eda['passenger_count'].median()),
            "min_passenger_count": int(df_eda['passenger_count'].min()),
            "max_passenger_count": int(df_eda['passenger_count'].max()),
            "zero_passenger_records": int((df_eda['passenger_count'] == 0).sum()),
            "timestamp_min": str(df_eda['timestamp'].min()),
            "timestamp_max": str(df_eda['timestamp'].max()),
            "train_shape": "98,639 × 20",
            "test_shape": "24,660 × 20",
            "train_period": "2020-01-01 01:00 to 2020-10-18 14:00",
            "test_period": "2020-10-18 14:00 to 2020-12-30 23:00",
            "r2_score": 0.7777,
            "mae": 7.1105,
            "rmse": 14.2164
        }
    }
    print("Assets loaded successfully!")

class PredictionRequest(BaseModel):
    route_id: str = Field(..., example="RT_NEW_000")
    timestamp: str = Field(..., example="2020-10-18T15:00:00")
    origin_station: Optional[str] = Field(None, example="STN_NEW_0136")
    dest_station: Optional[str] = Field(None, example="STN_NEW_0045")
    weather_condition: Optional[str] = Field(None, example="cloudy")
    temperature_c: Optional[float] = Field(None, example=18.08)
    headway_min: Optional[float] = Field(None, example=14.0)
    vehicle_capacity: Optional[float] = Field(None, example=60.0)
    safety_buffer: Optional[float] = Field(1.10, example=1.10)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "dataset_records": len(raw_bus) if raw_bus is not None else 0
    }

@app.get("/api/options")
def get_options():
    if raw_bus is None:
        raise HTTPException(status_code=500, detail="Dataset not loaded")
    
    routes = sorted(raw_bus['route_id'].unique().tolist())
    origins = sorted(raw_bus['origin_station'].dropna().unique().tolist())
    destinations = sorted(raw_bus['dest_station'].dropna().unique().tolist())
    weathers = sorted(raw_bus['weather_condition'].dropna().unique().tolist())
    
    route_details = {}
    for r in routes:
        r_df = raw_bus[raw_bus['route_id'] == r]
        orig = r_df['origin_station'].iloc[0] if not r_df.empty else origins[0]
        dest = r_df['dest_station'].iloc[0] if not r_df.empty else destinations[0]
        cap = float(r_df['vehicle_capacity'].median()) if not r_df.empty else 60.0
        headway = float(r_df['headway_min'].median()) if not r_df.empty else 15.0
        temp = float(r_df['temperature_c'].median()) if not r_df.empty else 20.0
        weather = r_df['weather_condition'].mode().iloc[0] if not r_df.empty else 'clear'
        
        # Get list of timestamps for route
        latest_ts = str(r_df['timestamp'].max()) if not r_df.empty else "2020-10-18T15:00:00"
        
        route_details[r] = {
            "origin_station": orig,
            "dest_station": dest,
            "vehicle_capacity": cap,
            "headway_min": headway,
            "temperature_c": temp,
            "weather_condition": weather,
            "latest_timestamp": latest_ts
        }
        
    return {
        "routes": routes,
        "origin_stations": origins,
        "dest_stations": destinations,
        "weather_conditions": weathers,
        "route_defaults": route_details,
        "date_range": {
            "min": str(raw_bus['timestamp'].min()),
            "max": str(raw_bus['timestamp'].max())
        }
    }

@app.get("/api/eda-stats")
def get_eda_stats():
    if not eda_summary_cache:
        raise HTTPException(status_code=500, detail="EDA stats not computed")
    return eda_summary_cache

@app.get("/api/verified-example")
def get_verified_example():
    """
    Exact verified example from notebook section 18/20.
    Route: RT_NEW_000, Timestamp: 2020-10-18 15:00, Capacity: 60
    Verified prediction: 57 passengers, 2 vehicles, Moderate demand level.
    """
    return {
        "inputs": {
            "route_id": "RT_NEW_000",
            "timestamp": "2020-10-18T15:00:00",
            "origin_station": "STN_NEW_0136",
            "dest_station": "STN_NEW_0045",
            "weather_condition": "cloudy",
            "temperature_c": 18.08,
            "headway_min": 14.0,
            "vehicle_capacity": 60.0
        },
        "expected_outputs": {
            "predicted_passengers": 57,
            "raw_prediction": 57.48,
            "demand_level": "Moderate",
            "recommended_vehicles": 2,
            "planned_capacity": 120,
            "spare_seats": 62,
            "rolling_mean_168h": 65.0
        }
    }

@app.post("/api/predict")
def predict_demand(req: PredictionRequest):
    if model is None or raw_bus is None:
        raise HTTPException(status_code=500, detail="Model or dataset not loaded")
    
    try:
        prediction_time = pd.to_datetime(req.timestamp, errors='raise')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid timestamp format: {req.timestamp}")
    
    route_rows = raw_bus[raw_bus['route_id'].eq(req.route_id)].copy()
    if route_rows.empty:
        raise HTTPException(status_code=404, detail=f"Unknown route_id: {req.route_id}")

    # Use only information available before the requested prediction time
    history = route_rows[route_rows['timestamp'] < prediction_time]
    if history.empty:
        history = route_rows
    history = history.sort_values('timestamp')
    latest = history.iloc[-1]

    def latest_or_default(column: str, val: Any) -> Any:
        return latest[column] if val is None or val == "" else val

    def route_median(column: str) -> float:
        val = pd.to_numeric(history[column], errors='coerce').median()
        if pd.isna(val):
            val = pd.to_numeric(raw_bus[column], errors='coerce').median()
        return float(val)

    # Calculate exact 168h rolling mean as done in notebook
    demand = (
        history[["timestamp", "passenger_count"]]
        .drop_duplicates("timestamp")
        .set_index("timestamp")["passenger_count"]
        .resample("1h").mean()
    )
    demand = demand.loc[demand.index < prediction_time]

    roll_mean_168h = np.nan
    if len(demand.dropna()) >= 1:
        end_roll = prediction_time - pd.Timedelta(hours=1)
        start_roll = prediction_time - pd.Timedelta(hours=168)
        roll_values = demand.loc[start_roll:end_roll].dropna()
        if len(roll_values) >= 1:
            roll_mean_168h = float(roll_values.mean())

    if pd.isna(roll_mean_168h):
        roll_mean_168h = route_median('passenger_count')

    # Derived time features
    hour = prediction_time.hour
    day_of_week = prediction_time.dayofweek
    is_weekend = int(day_of_week >= 5)
    is_peak_hour = int(hour in [7, 8, 9, 16, 17, 18, 19])
    is_school_hours = int(not is_weekend and 8 <= hour <= 15)
    is_night_service = int(hour < 6 or hour >= 22)

    origin = latest_or_default('origin_station', req.origin_station)
    dest = latest_or_default('dest_station', req.dest_station)
    weather = latest_or_default('weather_condition', req.weather_condition)
    temp = route_median('temperature_c') if req.temperature_c is None else float(req.temperature_c)
    headway = route_median('headway_min') if req.headway_min is None else float(req.headway_min)
    v_capacity = route_median('vehicle_capacity') if req.vehicle_capacity is None else float(req.vehicle_capacity)

    input_dict = {
        'route_id': req.route_id,
        'origin_station': origin,
        'dest_station': dest,
        'weather_condition': weather,
        'temperature_c': temp,
        'headway_min': headway,
        'vehicle_capacity': v_capacity,
        'is_peak_hour': is_peak_hour,
        'is_weekend': is_weekend,
        'is_holiday': 0,
        'is_school_hours': is_school_hours,
        'is_night_service': is_night_service,
        'hour': hour,
        'day_of_week': day_of_week,
        'day': prediction_time.day,
        'month': prediction_time.month,
        'day_of_year': prediction_time.dayofyear,
        'week_of_year': int(prediction_time.isocalendar().week),
        'quarter': prediction_time.quarter,
        'rolling_mean_168h': roll_mean_168h
    }

    input_row = pd.DataFrame([input_dict], columns=model_features)

    try:
        pred_raw = float(model.predict(input_row)[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model inference failed: {str(e)}")

    predicted_passengers = max(0.0, pred_raw)
    capacity = max(1, int(round(v_capacity)))
    safety_buf = float(req.safety_buffer or 1.10)
    
    recommended_vehicles = max(1, math.ceil(predicted_passengers * safety_buf / capacity))
    planned_capacity = recommended_vehicles * capacity
    spare_seats = planned_capacity - math.ceil(predicted_passengers)

    if predicted_passengers < 0.50 * capacity:
        demand_level = 'Low'
    elif predicted_passengers <= 0.85 * planned_capacity:
        demand_level = 'Moderate'
    else:
        demand_level = 'High'

    return {
        "success": True,
        "recommendation": {
            "route_id": req.route_id,
            "origin_station": origin,
            "dest_station": dest,
            "prediction_time": str(prediction_time),
            "predicted_passengers": round(predicted_passengers),
            "raw_prediction": round(pred_raw, 2),
            "demand_level": demand_level,
            "vehicle_capacity": capacity,
            "recommended_vehicles": recommended_vehicles,
            "planned_capacity": planned_capacity,
            "spare_seats": spare_seats,
            "safety_buffer": safety_buf
        },
        "features_derived": {
            "hour": hour,
            "day_of_week": day_of_week,
            "is_peak_hour": bool(is_peak_hour),
            "is_weekend": bool(is_weekend),
            "is_school_hours": bool(is_school_hours),
            "is_night_service": bool(is_night_service),
            "rolling_mean_168h": round(roll_mean_168h, 2),
            "weather_condition": weather,
            "temperature_c": temp,
            "headway_min": headway
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

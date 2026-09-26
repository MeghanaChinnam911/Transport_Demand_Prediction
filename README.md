# Public Transport Demand Prediction & Smart Fleet Recommendation

> **AI-Powered Demand Forecasting & Fleet Planning Web Application**  
> Powered by XGBoost, Scikit-Learn, FastAPI, React 18, Vite, and Tailwind CSS.

---

## 📌 Project Overview

This application is an end-to-end Machine Learning web application designed to forecast public transport passenger demand and convert predictions into actionable vehicle fleet recommendations.

It utilizes the actual trained **XGBoost Regressor** model (`public_transport_demand_model.pkl`) and historical observations from `processed_bus.csv` to dynamically generate predictions based on route ID, temporal features, weather conditions, operational headway, and vehicle capacities.

---

## 🎯 Operational Objectives & Problem Statement

Public transport demand fluctuates dynamically depending on:
- **Time & Peak Hours**: Rush hours (7-9 AM, 4-7 PM) create heavy demand spikes.
- **Route Characteristics**: Urban trunk corridors carry higher passenger volume than suburban routes.
- **Weather & Temperature**: Rain, snow, and extreme weather shift commuters to buses.
- **Operational Fleet Capacity**: Bus headway (frequency) and seating capacity regulate crowding.

**Solution**:
1. Predict expected passenger volume for any route and future timestamp.
2. Dynamically calculate the required number of vehicles (`ceil(predicted_passengers * safety_buffer / vehicle_capacity)`).
3. Provide planned capacity and spare seat metrics to eliminate over-crowding and empty bus dispatches.

---

## 📊 Dataset Specifications (`processed_bus.csv`)

- **Total Records**: 100,000 observations
- **Raw Columns**: 32 initial columns
- **Selected Features**: 14 domain-critical features
- **Data Quality**: 0 missing values, 0 duplicate rows, 0 invalid timestamps, 0 negative passenger counts.
- **Passenger Demand Statistics**:
  - **Mean**: 25.1996 passengers
  - **Median**: 17 passengers
  - **Minimum**: 0 passengers
  - **Maximum**: 80 passengers
  - **Zero Demand Records**: 36,805 trips

---

## 🤖 Model Architecture & Evaluation

- **Algorithm**: XGBoost Regressor (`hist` tree method)
- **Hyperparameters**:
  - `n_estimators`: 100
  - `learning_rate`: 0.1
  - `max_depth`: 7
  - `subsample`: 0.9
  - `colsample_bytree`: 0.9
  - `random_state`: 42
  - `objective`: `reg:squarederror`
- **Chronological Split**:
  - **Training Set (80%)**: 98,639 records (`2020-01-01 01:00` to `2020-10-18 14:00`)
  - **Holdout Test Set (20%)**: 24,660 records (`2020-10-18 14:00` to `2020-12-30 23:00`)
- **Final Evaluation Metrics** (on unseen test set):
  - **MAE**: `7.1105`
  - **RMSE**: `14.2164`
  - **R² Score**: `0.7777` *(77.77% of target variance explained)*

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Lucide Icons, Axios
- **Backend**: Python 3.10, FastAPI, Uvicorn, Pydantic
- **Machine Learning**: XGBoost, Scikit-Learn, Pandas, NumPy, Joblib

---

## ⚡ Quickstart Setup Guide

### 1. Backend Setup (FastAPI)

```bash
# Navigate to project root
cd "Data Quest 2026"

# Install backend dependencies
pip install -r backend/requirements.txt

# Start FastAPI server
python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000
```
*API will run live at `http://127.0.0.1:8000` (Docs available at `http://127.0.0.1:8000/docs`)*

### 2. Frontend Setup (React + Vite)

```bash
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Launch Vite development server
npm run dev
```
*Frontend will open live at `http://127.0.0.1:5173/`*

---

## 🔍 Verified Example

- **Route**: `RT_NEW_000`
- **Timestamp**: `2020-10-18 15:00:00`
- **Vehicle Capacity**: `60` passengers
- **Expected Outputs**:
  - **Predicted Passengers**: `57` (raw: `57.48`)
  - **Demand Level**: `Moderate`
  - **Recommended Vehicles**: `2`
  - **Planned Capacity**: `120`
  - **Spare Seats**: `62`

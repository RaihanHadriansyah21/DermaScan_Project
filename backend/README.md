# ⚙️ DermaScan Backend — FastAPI Microservice

This directory contains the production-grade **FastAPI REST API** and **Deep Learning Inference Engine** for the DermaScan application.

---

## 📌 Purpose & Architecture

The backend microservice handles:
1. **HTTP Multipart Request Handling**: Accepts skin lesion images (JPG, JPEG, PNG).
2. **Image Preprocessing**: Color constancy adjustment via Shades of Gray algorithm, EXIF rotation correction, and resizing.
3. **Model Deserialization & Execution**: Loads the saved multi-task Keras model with custom registered layers (`ChannelSpatialAttention`, `FeatureCalibrationLayer`).
4. **Post-Processing & Medical Knowledge Enrichment**: Formats output probabilities, evaluates risk thresholds, and attaches diagnostic guidance.
5. **CORS & Error Management**: Implements CORS middleware for cross-origin requests from Vercel web client.

---

## 📁 Directory Contents

```text
backend/
├── app.py                       # FastAPI application entrypoint & API routes
├── inference.py                 # Keras model loading, custom layers & preprocessing pipeline
├── lesion_info.py               # Medical knowledgebase mapping lesion classes to descriptions
├── Procfile                     # Deployment start command for Railway / Heroku
├── nixpacks.toml                # Build configuration for Nixpacks builder
├── requirements.txt             # Python dependencies
├── uploads/                     # Temporary uploaded image staging folder
└── production-models/           # Saved Keras model binary (.keras) & JSON config mappings
```

---

## 🚀 Local Development Setup

### 1. Environment Setup
```bash
python -m venv venv

# Windows:
.\venv\Scripts\Activate.ps1

# Linux/macOS:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Development Server
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Access Swagger Documentation:  
`http://localhost:8000/docs`

---

## 📡 API Specification

### `GET /api/health`
Checks backend service availability and model status.

### `POST /api/predict`
Accepts multipart image upload and returns prediction JSON.

---

## ☁️ Deployment (Railway)

The backend is configured for deployment on Railway using Nixpacks/Procfile:
- **Root Directory**: `/backend`
- **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`

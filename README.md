# 🩸 DermaScan — AI-Powered Decision Support System for Skin Lesion Risk Stratification

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15%2B-FF6F00?style=flat-square&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109%2B-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2%2B-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> **DermaScan** is an end-to-end medical AI application that utilizes multi-task deep neural networks and computer vision to analyze skin lesions, compute risk stratification scores, classify specific lesion categories, and deliver educational medical insights.

Developed as a Capstone Team Project for **Coding Camp 2026 powered by DBS Foundation** (Team **CC26-PRU448**).

🌐 **Live Web Application**: [https://dermascan-azure.vercel.app/](https://dermascan-azure.vercel.app/)

---

## 📌 Executive Summary

Early detection of malignant skin lesions (such as Melanoma and Basal Cell Carcinoma) dramatically improves clinical survival rates. **DermaScan** serves as a Decision Support System bridging deep learning computer vision with accessible web technology, providing users and healthcare practitioners with rapid, automated skin lesion analysis.

The system features a **Multi-Task Transfer Learning CNN (EfficientNetV2)** enhanced with **Convolutional Block Attention Modules (CBAM)** and **Feature Calibration Layers**. It simultaneously performs:
1. **Binary Risk Stratification**: Classifying lesions into *Low Risk* vs. *High Risk*.
2. **Multi-Class Categorization**: Predicting specific diagnostic lesion types across 5 primary clinical categories.

---

## ✨ Key Features

✔ **Multi-Task Deep Learning**: Dual-head architecture predicting both binary risk levels and multi-class lesion taxonomy in a single forward pass.  
✔ **Attention-Enhanced Feature Extraction**: Incorporates spatial and channel attention (CBAM) to focus on clinically relevant lesion boundaries.  
✔ **Lightweight TFLite Inference**: Converted Keras backbone into an optimized TensorFlow Lite (`.tflite`) flatbuffer model, reducing memory footprint for fast serverless execution.  
✔ **Color Constancy Preprocessing**: Utilizes Shades of Gray algorithm (power=6) to normalize lighting variances and skin tone differences across capture devices.  
✔ **Pillow Draft Downscaling**: Handles high-resolution camera uploads without memory spikes or server OOM errors.  
✔ **Interactive Confidence Visualization**: Dynamic risk gauge meter and class probability distribution breakdowns.  
✔ **Integrated Medical Education**: Interactive guidance on skin lesion types, self-examination protocols, and clinical disclaimers.  
✔ **Production-Ready REST API**: Fully validated OpenAPI/FastAPI endpoints with CORS configuration, health checks, and error handling.  

---

## 🚀 Live Demo & Deployment

| Component | Platform | Status | URL |
| :--- | :--- | :--- | :--- |
| **Frontend Web App** | Vercel | ![Vercel Status](https://img.shields.io/badge/Vercel-Online-brightgreen?style=flat-square&logo=vercel) | [dermascan-azure.vercel.app](https://dermascan-azure.vercel.app/) |
| **Backend Inference API** | Railway | ![Railway Status](https://img.shields.io/badge/Railway-Online-brightgreen?style=flat-square&logo=railway) | `https://dermascanproject-production.up.railway.app` |

---

## 🛠️ Technology Stack

| Layer | Technologies & Frameworks |
| :--- | :--- |
| **Deep Learning & CV** | TensorFlow 2.x, TensorFlow Lite (TFLite), Keras, EfficientNetV2, CBAM Attention, NumPy, Pillow |
| **Backend REST API** | Python 3.10+, FastAPI, Uvicorn, Pydantic, Python-Multipart |
| **Frontend UI** | React 18, Vite, Vanilla CSS Design System, Lucide Icons |
| **DevOps & Cloud** | Nixpacks, Docker-compatible Procfile, Vercel, Railway |

---

## 🧠 AI Inference Pipeline

```mermaid
flowchart TD
    A["User Uploads Skin Image"] --> B["Pillow Input Sanitization & EXIF Normalization"]
    B --> C["Shades of Gray Color Constancy Preprocessing"]
    C --> D["Aspect-Ratio Resizing & Center Crop (300x300)"]
    D --> E["Multi-Task EfficientNetV2 + CBAM Feature Extractor"]
    E --> F1["Binary Risk Head (Sigmoid)"]
    E --> F2["Multi-Class Lesion Head (Softmax)"]
    F1 --> G1["Risk Stratification: Low Risk / High Risk"]
    F2 --> G2["Lesion Categorization: 5 Classes"]
    G1 --> H["JSON Response Payload & Medical Disclaimer"]
    G2 --> H
    H --> I["React UI Visualization & Risk Gauge"]
```

---

## 🏗️ System Architecture & Workflow

```mermaid
graph LR
    subgraph Client["Frontend Layer (Vercel)"]
        UI["React 18 SPA"]
        Form["Multipart Form Uploader"]
        Display["Prediction & Risk Gauge UI"]
    end

    subgraph Server["Backend Layer (Railway)"]
        API["FastAPI App (uvicorn)"]
        CORS["CORS Middleware"]
        Preprocess["Pillow + NumPy Preprocessor"]
    end

    subgraph ModelLayer["AI Engine"]
        KerasModel["Multi-Task TFLite Model (.tflite)"]
        RiskHead["Binary Risk Classifier"]
        LesionHead["5-Class Lesion Head"]
    end

    UI -->|"HTTP POST Image File"| API
    API --> CORS
    CORS --> Preprocess
    Preprocess -->|"Tensor Batch (1, 300, 300, 3)"| KerasModel
    KerasModel --> RiskHead
    KerasModel --> LesionHead
    RiskHead -->|"Risk Probability"| API
    LesionHead -->|"Class Probabilities"| API
    API -->|"JSON Response"| Display
```

---

## 📁 Project Structure

```text
DermaScan_Project/
├── CODE_OF_CONDUCT.md               # Community Behavior Guidelines
├── CONTRIBUTING.md                  # Guidelines for Contributors
├── LICENSE                          # MIT License
├── README.md                        # Main Repository Documentation
├── .gitignore                       # Git exclusion rules
├── backend/                         # FastAPI Backend Microservice
│   ├── README.md                    # Backend Documentation
│   ├── app.py                       # FastAPI Application Entrypoint & Routes
│   ├── inference.py                 # TFLite/Keras Loader & Inference Engine
│   ├── lesion_info.py               # Medical Lesion Knowledgebase
│   ├── Procfile                     # Railway Start Command
│   ├── nixpacks.toml                # Railway Buildpack Configuration
│   ├── requirements.txt             # Python Dependencies
│   └── production-models/           # AI Model Artifacts & Metadata
│       ├── README.md                # Model Artifact Documentation
│       ├── dermascan_model.tflite   # Production TFLite Model (83.3 MB)
│       ├── dermascan_multitask_high_low.keras # Saved Keras Model (89.8 MB)
│       ├── preprocessing_config.json # Pipeline Parameters
│       ├── index_to_label.json      # Index-to-Lesion Mapping
│       ├── index_to_risk.json       # Index-to-Risk Mapping
│       ├── label_to_index.json      # Lesion-to-Index Mapping
│       └── risk_to_index.json       # Risk-to-Index Mapping
└── frontend/                        # React Frontend Application
    ├── README.md                    # Frontend Documentation
    ├── package.json                 # Node.js Manifest & Scripts
    ├── vite.config.js               # Vite Bundler Configuration
    ├── index.html                   # HTML Entrypoint
    ├── .env.example                 # Environment Variable Template
    └── src/                         # Application Source Code
        ├── main.jsx                 # React DOM Root
        ├── App.jsx                  # Main Application Component
        ├── index.css                # Design System & Styling
        ├── components/              # Modular UI Components
        │   ├── Header.jsx           # App Navigation Bar
        │   ├── ImageUploader.jsx    # Image Dropzone Component
        │   ├── PredictionResult.jsx # Prediction Results Display
        │   └── EducationCard.jsx    # Medical Knowledge Cards
        └── services/                # API Integration Layer
            └── api.js               # Backend Fetch Wrapper
```

---

## ⚙️ Installation & Setup Guide

### Prerequisites
- **Python**: `3.10` or higher
- **Node.js**: `18.x` or higher (`npm` package manager)
- **Git**: `2.x`

---

### 1. Clone Repository
```bash
git clone https://github.com/RaihanHadriansyah21/DermaScan_Project.git
cd DermaScan_Project
```

---

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend dev server
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```
Backend API will start at: `http://localhost:8000`  
Swagger API Documentation: `http://localhost:8000/docs`

---

### 3. Frontend Setup
```bash
# Navigate to frontend directory (from root)
cd frontend

# Install Node.js dependencies
npm install

# Configure environment variables
cp .env.example .env
```
Edit `.env` for local development:
```env
VITE_API_URL=http://localhost:8000
```

Start Vite development server:
```bash
npm run dev
```
Frontend web application will run at: `http://localhost:5173`

---

## 🔬 Model Overview & Training Details

DermaScan utilizes a custom **Multi-Task Transfer Learning Network**:

- **Backbone**: EfficientNetV2 pre-trained on ImageNet.
- **Attention Modules**: Integrated **CBAM (Convolutional Block Attention Module)** featuring dual channel and spatial attention mechanisms.
- **Feature Calibration**: SE-style gating layer after global pooling to re-calibrate feature activations.
- **Dual Output Heads**:
  - `risk_output`: Sigmoid dense head for binary risk stratification (*Low Risk* vs. *High Risk*).
  - `lesion_output`: Softmax dense head across 5 lesion categories (*AKIEC*, *BCC*, *BKL*, *MEL*, *NV*).

### Lesion Taxonomy
| Abbreviation | Full Clinical Name | Risk Category |
| :--- | :--- | :--- |
| **AKIEC** | Actinic Keratosis / Intraepithelial Carcinoma | High Risk |
| **BCC** | Basal Cell Carcinoma | High Risk |
| **MEL** | Melanoma | High Risk |
| **BKL** | Benign Keratosis (Seborrheic Keratosis / Solar Lentigo) | Low Risk |
| **NV** | Melanocytic Nevus (Common Mole) | Low Risk |

---

## 📡 REST API Overview

### 1. Health Check
`GET /api/health`

**Response (`200 OK`)**:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

---

### 2. Predict Skin Lesion
`POST /api/predict`

**Request**: `multipart/form-data` with `file` (JPG, JPEG, PNG).

**cURL Example**:
```bash
curl -X POST "https://dermascanproject-production.up.railway.app/api/predict" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@skin_sample.jpg"
```

**Response (`200 OK`)**:
```json
{
  "risk_label": "High Risk",
  "risk_probability": 0.859,
  "risk_threshold": 0.55,
  "lesion_label": "MEL",
  "lesion_probability": 0.859,
  "lesion_probabilities": {
    "AKIEC": 0.007,
    "BCC": 0.001,
    "BKL": 0.097,
    "MEL": 0.859,
    "NV": 0.037
  },
  "is_high_risk_lesion": true,
  "ensemble_size": 1,
  "tta_enabled": false,
  "lesion_info": {
    "name": "Melanoma (MEL)",
    "description": "Jenis kanker kulit paling berbahaya yang berasal dari sel penghasil pigmen...",
    "recommendation": "SEGERA konsultasikan dengan dokter spesialis kulit atau onkologi kulit."
  },
  "disclaimer": "Hasil prediksi ini dihasilkan oleh model AI dan BUKAN diagnosis medis..."
}
```

---

## 🖼️ Application Screenshots

| 1. Landing Page | 2. Upload & Scanning Image | 3. AI Prediction Result |
| :---: | :---: | :---: |
| ![Landing Page](docs/screenshots/landing-page.png) | ![Upload & Scanning Image](docs/screenshots/upload-scanning.png) | ![AI Prediction Result](docs/screenshots/prediction-result.png) |

---

## 🗺️ Future Improvements

- [ ] **Vision Transformer (ViT) Architecture**: Benchmark Swin Transformer and ViT against EfficientNetV2 backbones.
- [ ] **Explainable AI (XAI)**: Integrate Grad-CAM heatmaps to highlight visual regions driving AI decisions.
- [ ] **Mobile Application**: Cross-platform React Native / Flutter client with offline TFLite inference.
- [ ] **User Authentication & Assessment History**: Secure user accounts with session history tracking.
- [ ] **Multi-Class Expansion**: Extend taxonomy from 5 to 10+ skin disease categories.
- [ ] **Medical PDF Report Generation**: Export diagnostic summaries with disclaimer notes for healthcare providers.
- [ ] **Containerization**: Full Docker Compose setup for localized single-command orchestration.
- [ ] **CI/CD Pipeline**: GitHub Actions for automated linting, unit testing, and deployment triggers.

---

## 👥 Team Contributions

This project was developed collaboratively by **Capstone Team CC26-PRU448**:

| Member | Role | Key Contributions |
| :--- | :--- | :--- |
| **Eka Safari** | Data Scientist | Conducted ISIC dataset collection, data cleaning, image normalization, and class augmentation pipeline setup. |
| **Septiyana Putri** | Data Scientist | Performed Exploratory Data Analysis (EDA), class imbalance mitigation strategy, and model evaluation metrics analysis. |
| **Muhammad Fahmi Hadyan Haq** | Machine Learning Engineer | Developed and trained the multi-task EfficientNetV2 deep learning architecture with CBAM attention layers, generating the production `.keras` model. |
| **Mohammad Raihan Hadriansyah Prasetya** | AI & Cloud Engineer | Performed TFLite model conversion & quantization, developed FastAPI REST microservice, managed Railway & Vercel cloud deployments, and led full-stack system integration. |
| **Edward Riadi** | Full Stack Developer | Developed React SPA user interface, drag-and-drop file uploader component, dynamic risk gauge visualizer, and frontend UX components. |

---

## 📄 License & Disclaimer

This project is licensed under the [MIT License](LICENSE).

> **🚨 Important Medical Disclaimer**: DermaScan is an educational decision support tool created for algorithmic research purposes. It is **NOT** a certified medical diagnostic device and does **NOT** replace professional medical advice, diagnosis, or treatment. Always consult a qualified dermatologist for skin health concerns.

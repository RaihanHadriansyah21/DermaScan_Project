"""
DermaScan Backend — FastAPI Application
=======================================
Serves the DermaScan multi-task model via a REST API.

Endpoints:
    POST /api/predict  — Upload an image for skin lesion analysis
    GET  /api/health   — Health check
"""

import os
import uuid
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from inference import (
    load_dermascan_model,
    load_config,
    load_mappings,
    predict_dermascan,
)
from lesion_info import get_lesion_info

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "production-models")
MODEL_PATH = os.path.join(MODELS_DIR, "dermascan_multitask_high_low.keras")
CONFIG_PATH = os.path.join(MODELS_DIR, "preprocessing_config.json")
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("dermascan")

# Global model reference
model = None


# ---------------------------------------------------------------------------
# Lifespan — load model once at startup
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    global model

    logger.info("Loading DermaScan configuration...")
    config = load_config(CONFIG_PATH)
    load_mappings(MODELS_DIR)
    logger.info(
        "Config loaded — threshold=%.4f, lesion_classes=%d",
        config.get("high_risk_threshold", 0.55),
        len(config.get("auxiliary_classes", [])),
    )

    logger.info("Loading DermaScan model from %s ...", MODEL_PATH)
    model = load_dermascan_model(MODEL_PATH)
    logger.info("Model loaded successfully!")

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    yield  # App is running

    logger.info("Shutting down DermaScan backend.")


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="DermaScan API",
    description="Skin lesion risk classification using multi-task deep learning",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
    }


@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    """Run skin lesion prediction on an uploaded image.

    Accepts: multipart/form-data with a single image file (JPG, JPEG, or PNG).
    Returns: JSON with risk classification, lesion type, and probabilities.
    """
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model belum siap. Silakan coba lagi dalam beberapa saat.",
        )

    # Validate file extension
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Format file tidak didukung ({ext}). Gunakan JPG, JPEG, atau PNG.",
        )

    # Save uploaded file temporarily
    image_name = f"{uuid.uuid4()}{ext}"
    image_path = os.path.join(UPLOAD_DIR, image_name)

    try:
        content = await file.read()
        with open(image_path, "wb") as f:
            f.write(content)

        # Run inference
        result = predict_dermascan(
            models=model,
            image_path=image_path,
            use_tta=False,
        )

        # Enrich with lesion info
        lesion_label = result["lesion_label"]
        lesion_info = get_lesion_info(lesion_label)
        result["lesion_info"] = lesion_info

        # Add medical disclaimer
        result["disclaimer"] = (
            "Hasil prediksi ini dihasilkan oleh model AI dan BUKAN diagnosis medis. "
            "Silakan konsultasikan dengan tenaga kesehatan profesional untuk evaluasi klinis."
        )

        return result

    except Exception as e:
        logger.error("Prediction failed: %s", str(e), exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Terjadi kesalahan saat memproses gambar: {str(e)}",
        )
    finally:
        # Clean up uploaded file
        if os.path.exists(image_path):
            os.remove(image_path)

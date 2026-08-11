# DermaScan backend

FastAPI inference service for the DermaScan educational skin-lesion decision-support prototype.

## Responsibilities

1. Validate JPG/PNG multipart uploads.
2. Correct EXIF orientation, resize images, apply Shades of Gray color constancy, and center crop/pad to 300×300.
3. Load the TFLite artifact when available, with a Keras fallback.
4. Return binary risk and five-class lesion probabilities with educational metadata and a medical disclaimer.
5. Expose health and prediction endpoints to the React client.

## Files

```text
app.py                    FastAPI app, routes, validation, and CORS
inference.py              preprocessing, custom Keras layers, model wrappers, inference
lesion_info.py            educational lesion descriptions and recommendations
requirements.txt          Python runtime dependencies
Procfile                  Railway process command
nixpacks.toml             Railway build configuration
production-models/        inference artifacts, mappings, and preprocessing configuration
```

## Local development

```bash
python -m venv .venv
python -m pip install -r requirements.txt
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

- OpenAPI UI: `http://127.0.0.1:8000/docs`
- Health: `GET /api/health`
- Prediction: `POST /api/predict` with a multipart `file`

The model files under `production-models/` are required. This service is an educational prototype and does not provide a medical diagnosis.

## Railway configuration

The repository includes a Procfile/Nixpacks configuration for running:

```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```

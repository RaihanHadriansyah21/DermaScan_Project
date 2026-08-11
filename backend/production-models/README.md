# DermaScan model artifacts

Inference artifacts and JSON configuration used by the DermaScan backend.

## Inventory

| File | Purpose |
| --- | --- |
| `dermascan_model.tflite` | TensorFlow Lite conversion used as the preferred backend runtime artifact (approximately 83.3 MB) |
| `dermascan_multitask_high_low.keras` | Saved Keras multi-task model with architecture and trained weights (approximately 89.8 MB) |
| `preprocessing_config.json` | Input size, resize size, thresholds, labels, and preprocessing contract |
| `index_to_label.json` / `label_to_index.json` | Five-class lesion index mappings |
| `index_to_risk.json` / `risk_to_index.json` | Binary risk index mappings |

## Custom layers

The saved Keras model uses two registered custom layers:

- `ChannelSpatialAttention` implements channel and spatial attention.
- `FeatureCalibrationLayer` applies feature-vector gating after global pooling.

`inference.py` registers those objects when loading the Keras fallback and wraps `tf.lite.Interpreter` when loading the TFLite artifact.

## Evidence boundary

The TFLite artifact is a converted flatbuffer. The repository does not include a conversion script or metadata demonstrating post-training quantization, so it should not be described as quantized.

These files support inference reproducibility only. Training data, a complete training pipeline, and independent clinical validation are outside this directory.

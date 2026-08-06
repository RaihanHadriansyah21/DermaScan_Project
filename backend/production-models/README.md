# 🤖 DermaScan Model & Artifact Metadata

This directory stores the trained production **Deep Learning Model Artifacts** and associated JSON configuration files required for inference.

---

## 📁 Artifact Inventory

| File | Type | Description |
| :--- | :--- | :--- |
| `dermascan_model.tflite` | TFLite Model Binary | **(Production Default)** Ultra-lightweight TensorFlow Lite model flatbuffer (~83.3 MB) optimized for fast CPU inference under 50MB RAM. |
| `dermascan_multitask_high_low.keras` | Keras Model Binary | Original trained Keras multi-task model containing trained weights and layer architecture (~89.8 MB). |
| `preprocessing_config.json` | JSON Config | Pipeline parameters including target image resolution, decision threshold, and risk classification rules. |
| `index_to_label.json` | JSON Mapping | Maps numerical model output index (0..4) to diagnostic class labels (`AKIEC`, `BCC`, `BKL`, `MEL`, `NV`). |
| `label_to_index.json` | JSON Mapping | Reverse mapping from diagnostic labels to model output indices. |
| `index_to_risk.json` | JSON Mapping | Maps binary risk indices (0, 1) to risk labels (`Low Risk`, `High Risk`). |
| `risk_to_index.json` | JSON Mapping | Reverse mapping from risk labels to binary output indices. |

---

## 🧬 Custom Registered Keras Layers

The saved `.keras` model utilizes custom attention and feature gating layers registered under the `DermaScan` namespace:

1. **`ChannelSpatialAttention`**:
   - Implements CBAM (Convolutional Block Attention Module) combining channel-wise squeeze-and-excitation with 7x7 spatial convolution attention maps.
2. **`FeatureCalibrationLayer`**:
   - Implements SE-style gating on feature vectors post-global pooling to dynamically re-weight feature channels based on diagnostic context.

---

## ⚙️ Model Deserialization Note

Model loading is handled inside [inference.py](../inference.py) via `load_dermascan_model()`. The deserializer registers custom layer objects and automatically handles cross-version Keras configuration stripping (e.g. stripping unknown keys like `quantization_config` when executing on different Keras runtimes).

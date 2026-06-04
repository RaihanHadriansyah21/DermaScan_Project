"""
DermaScan Inference Module
==========================
Multi-task Keras model inference for skin lesion risk classification.
Model outputs: risk_output (Low Risk / High Risk) and lesion_output (5 lesion classes).

Adapted from: production-models/backend-inference-walkthrough.md
Adjusted to use 5-class lesion output matching production JSON mappings.
"""

import json
import os
import zipfile
import tempfile
import shutil
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers


# ---------------------------------------------------------------------------
# Constants — will be overridden by load_config() at startup
# ---------------------------------------------------------------------------
IMG_SIZE = (300, 300)
RESIZE_SIZE = 320

# Defaults (overridden by preprocessing_config.json)
RISK_LABELS = ["Low Risk", "High Risk"]
HIGH_RISK_THRESHOLD = 0.55

# These are populated by load_mappings()
index_to_label = {}
label_to_index = {}
index_to_risk = {}
risk_to_index = {}
NUM_LESION_CLASSES = 0
HIGH_RISK_CLASS_INDEX = 1
LOW_RISK_CLASS_INDEX = 0
HIGH_RISK_LABELS = []


# ---------------------------------------------------------------------------
# Custom Keras Layers — required to deserialize the saved .keras model
# ---------------------------------------------------------------------------
@tf.keras.utils.register_keras_serializable(package="DermaScan")
class ChannelSpatialAttention(layers.Layer):
    """CBAM-style channel and spatial attention."""

    def __init__(self, reduction_ratio=8, **kwargs):
        super().__init__(**kwargs)
        self.reduction_ratio = int(reduction_ratio)

    def build(self, input_shape):
        channels = int(input_shape[-1])
        reduced = max(channels // self.reduction_ratio, 16)
        self.channel_fc1 = layers.Dense(reduced, activation="swish")
        self.channel_fc2 = layers.Dense(channels, activation="sigmoid")
        self.spatial_conv = layers.Conv2D(
            1, kernel_size=7, padding="same", activation="sigmoid"
        )

    def call(self, x):
        avg = tf.reduce_mean(x, axis=[1, 2])
        mx = tf.reduce_max(x, axis=[1, 2])

        channel_attention = self.channel_fc2(
            self.channel_fc1(avg)
        ) + self.channel_fc2(self.channel_fc1(mx))
        channel_attention = tf.reshape(
            channel_attention, [-1, 1, 1, tf.shape(x)[-1]]
        )
        x = x * channel_attention

        spatial_avg = tf.reduce_mean(x, axis=-1, keepdims=True)
        spatial_max = tf.reduce_max(x, axis=-1, keepdims=True)
        spatial_attention = self.spatial_conv(
            tf.concat([spatial_avg, spatial_max], axis=-1)
        )
        return x * spatial_attention

    def get_config(self):
        config = super().get_config()
        config.update({"reduction_ratio": self.reduction_ratio})
        return config


@tf.keras.utils.register_keras_serializable(package="DermaScan")
class FeatureCalibrationLayer(layers.Layer):
    """SE-style gating on feature vector after pooling."""

    def __init__(self, reduction_ratio=8, **kwargs):
        super().__init__(**kwargs)
        self.reduction_ratio = int(reduction_ratio)

    def build(self, input_shape):
        feature_dim = int(input_shape[-1])
        hidden_dim = max(feature_dim // self.reduction_ratio, 16)
        self.fc1 = layers.Dense(hidden_dim, activation="swish")
        self.fc2 = layers.Dense(feature_dim, activation="sigmoid")

    def call(self, inputs):
        weights = self.fc2(self.fc1(inputs))
        return inputs * weights

    def get_config(self):
        config = super().get_config()
        config.update({"reduction_ratio": self.reduction_ratio})
        return config


# ---------------------------------------------------------------------------
# Preprocessing — must match training pipeline exactly
# ---------------------------------------------------------------------------
def shade_of_gray(image, power=6):
    """Shades of Gray color constancy preprocessing."""
    image = tf.cast(image, tf.float32)
    norm = tf.pow(
        tf.reduce_mean(tf.pow(image + 1e-6, power), axis=[0, 1], keepdims=True),
        1.0 / power,
    )
    mean_norm = tf.reduce_mean(norm)
    image = image * (mean_norm / (norm + 1e-6))
    return tf.clip_by_value(image, 0.0, 255.0)


def preprocess_single_image(path):
    """Load and preprocess one image for inference.

    Pipeline:
    1. Read & decode to RGB float32
    2. Shades of Gray color constancy (power=6)
    3. Resize with padding to RESIZE_SIZE x RESIZE_SIZE
    4. Center crop/pad to IMG_SIZE
    5. Keep pixel range 0-255 (backbone handles normalization internally)
    """
    image = tf.io.read_file(path)
    image = tf.image.decode_image(image, channels=3, expand_animations=False)
    image = tf.cast(image, tf.float32)
    image = shade_of_gray(image, power=6)
    image = tf.image.resize_with_pad(image, RESIZE_SIZE, RESIZE_SIZE)
    image = tf.image.resize_with_crop_or_pad(image, IMG_SIZE[0], IMG_SIZE[1])
    return image


# ---------------------------------------------------------------------------
# Model output parsing
# ---------------------------------------------------------------------------
def unpack_model_outputs(outputs):
    """Handle both dict and tuple model outputs."""
    if isinstance(outputs, dict):
        return outputs["risk_output"], outputs["lesion_output"]
    return outputs[0], outputs[1]


# ---------------------------------------------------------------------------
# Test-Time Augmentation
# ---------------------------------------------------------------------------
def predict_single_with_tta(model, image_batch):
    """Predict with 8-view TTA: 4 rotations × 2 flips."""
    all_risk = []
    all_lesion = []

    for k in range(4):
        rotated = tf.image.rot90(image_batch, k=k)
        outputs = model(rotated, training=False)
        risk_output, lesion_output = unpack_model_outputs(outputs)
        all_risk.append(risk_output)
        all_lesion.append(lesion_output)

        flipped = tf.image.flip_left_right(rotated)
        outputs = model(flipped, training=False)
        risk_output, lesion_output = unpack_model_outputs(outputs)
        all_risk.append(risk_output)
        all_lesion.append(lesion_output)

    avg_risk = tf.reduce_mean(tf.stack(all_risk, axis=0), axis=0)
    avg_lesion = tf.reduce_mean(tf.stack(all_lesion, axis=0), axis=0)
    return avg_risk.numpy(), avg_lesion.numpy()


# ---------------------------------------------------------------------------
# Model loading — with Keras version compatibility patch
# ---------------------------------------------------------------------------
# Keys that newer Keras versions add but older ones don't recognize.
# These are stripped from layer configs to allow cross-version loading.
_STRIP_KEYS = {"quantization_config"}


def _strip_unknown_keys(obj):
    """Recursively strip keys from dicts that older Keras can't deserialize."""
    if isinstance(obj, dict):
        for key in list(obj.keys()):
            if key in _STRIP_KEYS:
                del obj[key]
            else:
                _strip_unknown_keys(obj[key])
    elif isinstance(obj, list):
        for item in obj:
            _strip_unknown_keys(item)


def _patch_keras_file(original_path):
    """Create a patched copy of a .keras file with incompatible keys stripped.

    Returns the path to the patched temp file. Caller must clean up.
    """
    tmp_dir = tempfile.mkdtemp(prefix="dermascan_")
    patched_path = os.path.join(tmp_dir, "model_patched.keras")

    with zipfile.ZipFile(original_path, "r") as zin:
        with zipfile.ZipFile(patched_path, "w") as zout:
            for item in zin.infolist():
                data = zin.read(item.filename)

                # Patch config.json inside the .keras zip
                if item.filename == "config.json":
                    config = json.loads(data)
                    _strip_unknown_keys(config)
                    data = json.dumps(config).encode("utf-8")

                zout.writestr(item, data)

    return patched_path, tmp_dir


def load_dermascan_model(model_path):
    """Load the saved .keras model with custom objects registered.

    Handles Keras version mismatch by stripping keys like
    `quantization_config` that were added in Keras 3.4+ but are
    not recognized by older versions.
    """
    custom_objects = {
        "ChannelSpatialAttention": ChannelSpatialAttention,
        "FeatureCalibrationLayer": FeatureCalibrationLayer,
    }

    # First try loading directly
    try:
        return keras.models.load_model(
            model_path,
            custom_objects=custom_objects,
            compile=False,
        )
    except (TypeError, ValueError) as e:
        if "quantization_config" not in str(e):
            raise  # Unrelated error, re-raise

    # Patched loading: strip incompatible keys from the .keras zip
    import logging
    logger = logging.getLogger("dermascan")
    logger.warning(
        "Direct model load failed (Keras version mismatch). "
        "Applying config patch to strip incompatible keys..."
    )

    patched_path, tmp_dir = _patch_keras_file(model_path)
    try:
        model = keras.models.load_model(
            patched_path,
            custom_objects=custom_objects,
            compile=False,
        )
        return model
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


# ---------------------------------------------------------------------------
# Config & mapping loaders
# ---------------------------------------------------------------------------
def load_config(config_path):
    """Load preprocessing_config.json and update global constants."""
    global IMG_SIZE, RESIZE_SIZE, HIGH_RISK_THRESHOLD, HIGH_RISK_LABELS

    with open(config_path, "r") as f:
        config = json.load(f)

    IMG_SIZE = tuple(config.get("image_size", [300, 300]))
    RESIZE_SIZE = config.get("resize_size", 320)
    HIGH_RISK_THRESHOLD = config.get("high_risk_threshold", 0.55)
    HIGH_RISK_LABELS = config.get("high_risk_labels", ["AKIEC", "BCC", "MEL"])

    return config


def load_mappings(models_dir):
    """Load label/index JSON mappings from production-models directory."""
    global index_to_label, label_to_index, index_to_risk, risk_to_index
    global NUM_LESION_CLASSES, HIGH_RISK_CLASS_INDEX, LOW_RISK_CLASS_INDEX

    with open(os.path.join(models_dir, "index_to_label.json"), "r") as f:
        raw = json.load(f)
        index_to_label = {int(k): v for k, v in raw.items()}

    with open(os.path.join(models_dir, "label_to_index.json"), "r") as f:
        label_to_index = json.load(f)

    with open(os.path.join(models_dir, "index_to_risk.json"), "r") as f:
        raw = json.load(f)
        index_to_risk = {int(k): v for k, v in raw.items()}

    with open(os.path.join(models_dir, "risk_to_index.json"), "r") as f:
        risk_to_index = json.load(f)

    NUM_LESION_CLASSES = len(index_to_label)
    HIGH_RISK_CLASS_INDEX = risk_to_index.get("High Risk", 1)
    LOW_RISK_CLASS_INDEX = risk_to_index.get("Low Risk", 0)


# ---------------------------------------------------------------------------
# Main inference function
# ---------------------------------------------------------------------------
def predict_dermascan(models, image_path, threshold=None, use_tta=False):
    """Run DermaScan production inference for one image.

    Args:
        models: one Keras model or a list of Keras models.
        image_path: local path to uploaded image.
        threshold: High Risk decision threshold. Uses config value if None.
        use_tta: enables slower but stronger test-time augmentation.

    Returns:
        JSON-serializable dictionary with prediction results.
    """
    if threshold is None:
        threshold = HIGH_RISK_THRESHOLD

    if not isinstance(models, list):
        models = [models]

    image = preprocess_single_image(image_path)
    image_batch = tf.expand_dims(image, axis=0)

    all_risk = []
    all_lesion = []

    for model in models:
        if use_tta:
            risk_output, lesion_output = predict_single_with_tta(model, image_batch)
        else:
            outputs = model(image_batch, training=False)
            risk_output, lesion_output = unpack_model_outputs(outputs)
            risk_output = risk_output.numpy()
            lesion_output = lesion_output.numpy()

        all_risk.append(risk_output)
        all_lesion.append(lesion_output)

    risk_prob = np.mean(all_risk, axis=0)
    lesion_prob = np.mean(all_lesion, axis=0)

    high_risk_score = float(risk_prob[0, HIGH_RISK_CLASS_INDEX])
    risk_idx = (
        HIGH_RISK_CLASS_INDEX
        if high_risk_score >= threshold
        else LOW_RISK_CLASS_INDEX
    )

    lesion_idx = int(np.argmax(lesion_prob[0]))
    lesion_probabilities = {
        index_to_label[i]: round(float(lesion_prob[0, i]), 4)
        for i in range(NUM_LESION_CLASSES)
    }

    detected_label = index_to_label[lesion_idx]
    is_high_risk_lesion = detected_label in HIGH_RISK_LABELS

    return {
        "risk_label": index_to_risk[risk_idx],
        "risk_probability": round(high_risk_score, 4),
        "risk_threshold": round(float(threshold), 4),
        "lesion_label": detected_label,
        "lesion_probability": round(float(lesion_prob[0, lesion_idx]), 4),
        "lesion_probabilities": lesion_probabilities,
        "is_high_risk_lesion": is_high_risk_lesion,
        "ensemble_size": len(models),
        "tta_enabled": bool(use_tta),
    }

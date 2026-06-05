/**
 * DermaScan API Service
 * =====================
 * Connects the React frontend to the FastAPI backend.
 * Sends image files to /api/predict and returns structured results.
 */

/**
 * Send an image file to the DermaScan backend for analysis.
 * @param {File} file - The image file to analyze
 * @returns {Promise<Object>} Prediction result from the model
 */
export async function scanImageAPI(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/predict', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      errorData?.detail || `Server error: ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

/**
 * Check backend health status.
 * @returns {Promise<Object>}
 */
export async function checkHealthAPI() {
  const response = await fetch('/api/health');
  if (!response.ok) {
    throw new Error('Backend tidak tersedia');
  }
  return response.json();
}

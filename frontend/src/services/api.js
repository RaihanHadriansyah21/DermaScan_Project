/**
 * DermaScan API Service
 * =====================
 * Connects the React frontend to the FastAPI backend.
 * Sends image files to /api/predict and returns structured results.
 */

const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Helper function to safely build full endpoint URLs.
 * Handles trailing slashes from API_URL and leading slashes from path.
 * Falls back to relative path if API_URL is not configured (e.g. local dev via proxy).
 * @param {string} path - The endpoint path (e.g. '/api/predict')
 * @returns {string} Fully qualified URL or relative path
 */
const getFullUrl = (path) => {
  if (!API_URL) return path;
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const subPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${subPath}`;
};

/**
 * Send an image file to the DermaScan backend for analysis.
 * @param {File} file - The image file to analyze
 * @returns {Promise<Object>} Prediction result from the model
 */
export async function scanImageAPI(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(getFullUrl('/api/predict'), {
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
  const response = await fetch(getFullUrl('/api/health'));
  if (!response.ok) {
    throw new Error('Backend tidak tersedia');
  }
  return response.json();
}

import React, { useState, useRef } from 'react';
import { scanImageAPI } from '../services/api';
import ResultCard from '../components/ResultCard';
import ProbabilityChart from '../components/ProbabilityChart';

export default function Pemindaian() {
  // Step: 'upload' | 'preview' | 'result'
  const [step, setStep] = useState('upload');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showTechnical, setShowTechnical] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection — store both File object and preview URL
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Format file tidak didukung. Gunakan JPG, JPEG, atau PNG.');
      return;
    }

    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setStep('preview');
  };

  // Send image to backend for analysis
  const processImage = async () => {
    if (!imageFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const data = await scanImageAPI(imageFile);
      setResult(data);
      setStep('result');
    } catch (err) {
      setError(
        err.message || 'Terjadi kesalahan saat memproses gambar. Pastikan backend berjalan.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset everything
  const resetScan = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setImageFile(null);
    setResult(null);
    setError(null);
    setStep('upload');
    setShowTechnical(false);
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-teal-400', 'bg-teal-50/50');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-teal-400', 'bg-teal-50/50');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-teal-400', 'bg-teal-50/50');
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleFileChange(fakeEvent);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Dynamic title */}
      <h1 className="text-3xl font-bold text-center text-slate-900">
        {step === 'result' ? 'Hasil Analisis AI' : 'Pemindaian Kulit'}
      </h1>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex gap-2 items-start max-w-3xl mx-auto">
          <span className="shrink-0">❌</span>
          <div>
            <p className="font-semibold">Terjadi Kesalahan</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* ─── STEP 1 & 2: UPLOAD & PREVIEW ─── */}
      {step !== 'result' && (
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {/* Left: Photo guide */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              ✅ Panduan Foto
            </h3>
            <ul className="text-sm text-slate-600 space-y-3 list-disc pl-4">
              <li>Pastikan gambar tajam dan fokus pada area kulit.</li>
              <li>Gunakan pencahayaan yang cukup dan merata.</li>
              <li>Fokuskan pada area kulit yang ingin diperiksa.</li>
              <li>Format: JPG, JPEG, atau PNG.</li>
            </ul>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
              <p className="font-semibold">⚡ Info Model</p>
              <p className="mt-1">
                Multi-task EfficientNetV2S dengan 5 kelas lesion kulit dan klasifikasi risiko biner.
              </p>
            </div>
          </div>

          {/* Right: Upload or Preview */}
          <div className="md:col-span-2 space-y-4">
            {step === 'upload' ? (
              <div
                className="bg-white p-8 rounded-xl border-2 border-dashed border-slate-300 shadow-sm flex flex-col items-center justify-center min-h-[300px] transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="text-4xl mb-4">📤</span>
                <p className="font-semibold text-slate-800 mb-2">
                  Seret dan lepas gambar di sini
                </p>
                <p className="text-xs text-slate-400 mb-4">atau</p>
                <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm px-4 py-2 rounded-lg cursor-pointer border border-slate-300 transition-colors">
                  Ambil Foto / Pilih Gambar
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-[300px] object-cover rounded-lg border border-slate-200"
                />
                <div className="flex gap-4">
                  <label
                    className={`flex-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm px-4 py-3 rounded-lg cursor-pointer border border-slate-300 transition-colors ${
                      isAnalyzing ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    Pilih Gambar Lain
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={isAnalyzing}
                    />
                  </label>
                  <button
                    onClick={processImage}
                    disabled={isAnalyzing}
                    className="flex-1 flex justify-center items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm px-4 py-3 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Menganalisis...
                      </>
                    ) : (
                      'Analisis Gambar'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Info banner */}
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-sm flex gap-2 items-center">
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800 shrink-0" />
                  <p>Model AI sedang menganalisis citra kulit...</p>
                </>
              ) : (
                <>
                  <span>ℹ️</span>
                  <p>
                    Gambar dikirim ke server lokal untuk diproses oleh model AI.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── STEP 3: RESULTS ─── */}
      {step === 'result' && result && (
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Image + Risk Card */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Analyzed image */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <h3 className="font-semibold text-sm text-slate-500">
                Gambar yang Dianalisis
              </h3>
              <img
                src={imagePreview}
                alt="Analisis"
                className="w-full h-48 object-cover rounded-lg border border-slate-200"
              />
            </div>

            {/* Risk classification card */}
            <ResultCard result={result} />
          </div>

          {/* Lesion Classification */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                🔬 Klasifikasi Tipe Lesi
              </h3>
              {result.lesion_info && (
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    result.lesion_info.risk_level === 'high'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {result.lesion_info.risk_level === 'high'
                    ? 'Lesi Berisiko Tinggi'
                    : 'Lesi Jinak'}
                </span>
              )}
            </div>

            {/* Detected lesion */}
            <div
              className="rounded-xl p-4 border"
              style={{
                borderColor: result.lesion_info?.color || '#E5E7EB',
                backgroundColor: `${result.lesion_info?.color || '#6B7280'}08`,
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{
                    backgroundColor: result.lesion_info?.color || '#6B7280',
                  }}
                />
                <div>
                  <p className="font-bold text-lg text-slate-900">
                    {result.lesion_label}
                  </p>
                  <p className="text-sm text-slate-500">
                    {result.lesion_info?.nama_lengkap || result.lesion_info?.full_name}
                  </p>
                </div>
                <span className="ml-auto text-lg font-bold text-slate-700">
                  {(result.lesion_probability * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {result.lesion_info?.description}
              </p>
            </div>

            {/* Probability distribution */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">
                Distribusi Probabilitas Semua Kelas
              </h4>
              <ProbabilityChart
                probabilities={result.lesion_probabilities}
                topLabel={result.lesion_label}
              />
            </div>
          </div>

          {/* Recommendation */}
          {result.lesion_info?.recommendation && (
            <div
              className={`p-5 rounded-xl border space-y-2 ${
                result.risk_label === 'High Risk'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-emerald-50 border-emerald-200'
              }`}
            >
              <h3
                className={`font-bold text-sm flex items-center gap-2 ${
                  result.risk_label === 'High Risk'
                    ? 'text-red-800'
                    : 'text-emerald-800'
                }`}
              >
                🩺 Rekomendasi
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  result.risk_label === 'High Risk'
                    ? 'text-red-700'
                    : 'text-emerald-700'
                }`}
              >
                {result.lesion_info.recommendation}
              </p>
            </div>
          )}

          {/* Technical details (collapsible) */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setShowTechnical(!showTechnical)}
              className="w-full flex justify-between items-center px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <span>⚙️ Detail Teknis</span>
              <span>{showTechnical ? '▲' : '▼'}</span>
            </button>
            {showTechnical && (
              <div className="px-5 pb-4 grid grid-cols-2 gap-3 text-xs text-slate-500">
                <div>
                  <span className="block text-slate-400">Threshold</span>
                  <span className="font-medium text-slate-700">
                    {(result.risk_threshold * 100).toFixed(2)}%
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400">Ensemble Size</span>
                  <span className="font-medium text-slate-700">
                    {result.ensemble_size} model
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400">TTA</span>
                  <span className="font-medium text-slate-700">
                    {result.tta_enabled ? 'Aktif (8 views)' : 'Nonaktif'}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400">High Risk Lesion</span>
                  <span className="font-medium text-slate-700">
                    {result.is_high_risk_lesion ? 'Ya' : 'Tidak'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.print()}
              className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              💾 Simpan Hasil
            </button>
            <button className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              🩺 Konsultasi Medis
            </button>
          </div>

          {/* Medical Disclaimer */}
          <div
            className={`p-6 rounded-xl border space-y-4 ${
              result.risk_label === 'High Risk'
                ? 'bg-red-50 border-red-200'
                : 'bg-amber-50 border-amber-200'
            }`}
          >
            <h3
              className={`font-bold text-sm tracking-wide ${
                result.risk_label === 'High Risk'
                  ? 'text-red-800'
                  : 'text-amber-800'
              }`}
            >
              ⚠️ DISCLAIMER MEDIS — PENTING
            </h3>
            <p
              className={`text-xs leading-relaxed ${
                result.risk_label === 'High Risk'
                  ? 'text-red-700'
                  : 'text-amber-700'
              }`}
            >
              {result.disclaimer ||
                'Hasil ini merupakan Sistem Pendukung Keputusan (Decision Support System) dan BUKAN pengganti diagnosis medis profesional.'}
            </p>
            <ul
              className={`text-xs list-disc pl-4 space-y-1 ${
                result.risk_label === 'High Risk'
                  ? 'text-red-700/90'
                  : 'text-amber-700/90'
              }`}
            >
              <li>
                Sistem ini memberikan indikasi awal berdasarkan klasifikasi
                yang dilatih pada dataset ISIC.
              </li>
              <li>
                Sistem TIDAK DAPAT mendeteksi penyakit kulit di luar kategori
                yang dilatih.
              </li>
              <li>
                Akurasi model AI dapat bervariasi tergantung kualitas gambar.
              </li>
              <li>
                Anda DIWAJIBKAN berkonsultasi dengan dokter kulit atau tenaga
                medis profesional.
              </li>
            </ul>
            {result.risk_label === 'High Risk' && (
              <p className="text-xs font-bold text-red-800">
                Hasil menunjukkan RISIKO TINGGI. Segera konsultasikan dengan
                dokter spesialis kulit untuk pemeriksaan lebih lanjut.
              </p>
            )}
          </div>

          {/* Scan again */}
          <div className="text-center pt-4">
            <button
              onClick={resetScan}
              className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-sm px-6 py-2.5 rounded-lg transition-colors"
            >
              Analisis Gambar Lain
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
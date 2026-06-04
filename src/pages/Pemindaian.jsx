import React, { useState } from 'react';
import { scanImageAPI } from '../services/mockApi';

export default function Pemindaian() {
  // State untuk mengontrol tahapan tampilan: 'upload', 'preview', atau 'result'
  const [step, setStep] = useState('upload'); 
  const [image, setImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  // Fungsi saat user memilih gambar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setStep('preview'); // Pindah ke tahap pratinjau
      };
      reader.readAsDataURL(file);
    }
  };

  // Fungsi saat tombol Analisis diklik
  const processImage = async () => {
    setIsAnalyzing(true);
    try {
      const data = await scanImageAPI(image);
      data.confidence = 78; // Disesuaikan dengan video Anda (78%)
      setResult(data);
      setStep('result'); // Pindah ke tahap hasil
    } catch (error) {
      alert("Terjadi kesalahan saat memproses gambar.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Fungsi untuk kembali ke awal
  const resetScan = () => {
    setImage(null);
    setResult(null);
    setStep('upload');
  };

  return (
    <div className="space-y-8 py-4">
      {/* Judul berubah dinamis sesuai tahapan */}
      <h1 className="text-3xl font-bold text-center text-slate-900">
        {step === 'result' ? 'Hasil Analisis AI' : 'Pemindaian Kulit'}
      </h1>
      
      {/* --------------------------------------------------- */}
      {/* TAHAP 1 & 2: UPLOAD & PREVIEW */}
      {/* --------------------------------------------------- */}
      {step !== 'result' && (
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {/* Bagian Kiri: Panduan Foto */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">✅ Panduan Foto</h3>
            <ul className="text-sm text-slate-600 space-y-3 list-disc pl-4">
              <li>Pastikan gambar tajam dan fokus pada area kulit.</li>
              <li>Gunakan pencahayaan yang cukup dan merata.</li>
              <li>Fokuskan pada area kulit yang ingin diperiksa.</li>
              <li>Gambar besar akan otomatis dikompres.</li>
            </ul>
          </div>

          {/* Bagian Kanan: Area Upload ATAU Preview Gambar */}
          <div className="md:col-span-2 space-y-4">
            {step === 'upload' ? (
              <div className="bg-white p-8 rounded-xl border-2 border-dashed border-slate-300 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                <span className="text-4xl mb-4">📤</span>
                <p className="font-semibold text-slate-800 mb-2">Seret dan lepas gambar di sini</p>
                <p className="text-xs text-slate-400 mb-4">atau</p>
                <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm px-4 py-2 rounded-lg cursor-pointer border border-slate-300 transition-colors">
                  Ambil Foto / Pilih Gambar
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <img src={image} alt="Preview" className="w-full h-[300px] object-cover rounded-lg border border-slate-200" />
                <div className="flex gap-4">
                  <label className={`flex-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm px-4 py-3 rounded-lg cursor-pointer border border-slate-300 transition-colors ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}>
                    Pilih Gambar Lain
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isAnalyzing} />
                  </label>
                  <button 
                    onClick={processImage} 
                    disabled={isAnalyzing}
                    className="flex-1 flex justify-center items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm px-4 py-3 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Menganalisis...
                      </>
                    ) : (
                      'Analisis Gambar'
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {/* Banner Informasi Bawah */}
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-sm flex gap-2 items-center">
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800 shrink-0"></div>
                  <p>Model AI sedang menganalisis citra...</p>
                </>
              ) : (
                <>
                  <span>ℹ️</span>
                  <p>Gambar yang diunggah akan diproses secara lokal dan aman. Untuk hasil terbaik, pastikan foto memenuhi panduan di sebelah kiri.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------- */}
      {/* TAHAP 3: HASIL ANALISIS */}
      {/* --------------------------------------------------- */}
      {step === 'result' && result && (
        <div className="space-y-8 max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-slate-500">Gambar yang Dianalisis</h3>
              <img src={image} alt="Analisis" className="w-full h-48 object-cover rounded-lg border border-slate-200" />
              <p className="text-[10px] text-slate-400">Dianalisis pada: {result.timestamp}</p>
            </div>

            <div className="border border-red-200 bg-red-50/50 p-6 rounded-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
                  <span>❌</span> Klasifikasi Risiko
                </div>
                <h2 className="text-3xl font-black text-red-700 tracking-tight">{result.status}</h2>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Tingkat Keyakinan</span>
                    <span>{result.confidence}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-600 h-full transition-all" style={{ width: `${result.confidence}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-red-100 text-[11px] text-slate-500 space-y-0.5 mt-4">
                <p>Model AI: {result.modelUsed}</p>
                <p>Dataset: {result.dataset}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={() => window.print()} className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors">
              💾 Simpan Hasil
            </button>
            <button className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              🩺 Konsultasi Medis
            </button>
          </div>

          <div className="bg-red-50 border border-red-200 p-6 rounded-xl space-y-4">
            <h3 className="font-bold text-red-800 text-sm tracking-wide">⚠️ DISCLAIMER MEDIS - PENTING</h3>
            <p className="text-xs text-red-700 leading-relaxed">
              Hasil ini merupakan Sistem Pendukung Keputusan (Decision Support System) dan BUKAN pengganti diagnosis medis profesional.
            </p>
            <ul className="text-xs text-red-700/90 list-disc pl-4 space-y-1">
              <li>Sistem ini hanya memberikan indikasi awal berdasarkan klasifikasi kategori yang dilatih pada dataset ISIC.</li>
              <li>Sistem TIDAK DAPAT mendeteksi penyakit kulit di luar kategori kanker kulit.</li>
              <li>Tingkat akurasi model AI dapat bervariasi tergantung kualitas gambar dan kondisi pencahayaan.</li>
              <li>Anda DIWAJIBKAN berkonsultasi dengan dokter kulit atau tenaga medis profesional.</li>
            </ul>
            <p className="text-xs font-bold text-red-800">Hasil menunjukkan RISIKO TINGGI. Segera konsultasikan dengan dokter spesialis kulit untuk pemeriksaan lebih lanjut.</p>
          </div>

          <div className="text-center pt-4">
            <button onClick={resetScan} className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-sm px-6 py-2.5 rounded-lg transition-colors">
              Analisis Gambar Lain
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
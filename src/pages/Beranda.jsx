import React from 'react';

export default function Beranda({ onMulai }) {
  return (
    <div className="space-y-16 py-8">
      <div className="text-center max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">DermaScan</h1>
        <p className="text-xl font-medium text-teal-700">Deteksi Dini Kanker Kulit Berbasis AI</p>
        <p className="text-slate-500 leading-relaxed">
          Sistem pendukung keputusan medis yang membantu memberikan indikasi awal kondisi kulit Anda menggunakan teknologi Transfer Learning CNN.
        </p>
        <button 
          onClick={onMulai}
          className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all"
        >
          Mulai Pemindaian
        </button>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center text-slate-900">Cara Kerja DermaScan</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold mb-4">📤</div>
            <h3 className="font-bold text-lg mb-2">1. Unggah Foto</h3>
            <p className="text-slate-500 text-sm">Ambil atau pilih foto area kulit yang ingin diperiksa dengan pencahayaan yang baik dan fokus.</p>
          </div>
          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold mb-4">🤖</div>
            <h3 className="font-bold text-lg mb-2">2. Analisis AI</h3>
            <p className="text-slate-500 text-sm">Model AI kami menganalisis citra menggunakan teknologi deep learning untuk klasifikasi risiko.</p>
          </div>
          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold mb-4">📋</div>
            <h3 className="font-bold text-lg mb-2">3. Hasil Indikasi</h3>
            <p className="text-slate-500 text-sm">Dapatkan hasil klasifikasi dan tingkat keyakinan untuk membantu keputusan konsultasi medis.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
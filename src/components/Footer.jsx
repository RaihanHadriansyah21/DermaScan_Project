import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-8 mt-12 text-xs text-slate-500">
      <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-teal-600 text-lg font-bold">⚕️</span>
            <span className="font-bold text-slate-800">DermaScan</span>
          </div>
          <p className="leading-relaxed">Sistem Pendukung Keputusan untuk Deteksi Dini Kanker Kulit menggunakan Transfer Learning CNN</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-slate-800">Informasi</h4>
          <p>ID Tim: CC26-PRU448</p>
          <p>Tema: Healthy Lives & Well-being</p>
          <p>Teknologi AI: Transfer Learning CNN</p>
          <p>Dataset: ISIC</p>
        </div>
      </div>
      <div className="text-center mt-8 pt-4 border-t border-slate-100 text-[11px]">
        © 2026 DermaScan. Sistem ini adalah Decision Support System dan bukan pengganti diagnosis medis profesional.
      </div>
    </footer>
  );
}
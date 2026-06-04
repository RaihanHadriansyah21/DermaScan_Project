import React, { useState, useEffect } from 'react';
import { searchEdukasiAPI } from '../services/mockApi'; // Import mock API

export default function Edukasi() {
  const [search, setSearch] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    // Memanggil mock API saat komponen di-load atau search berubah
    const fetchData = async () => {
      const data = await searchEdukasiAPI(search);
      setFaqs(data);
    };
    fetchData();
  }, [search]);

  return (
    <div className="space-y-8 py-4 max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">📖 Edukasi Kesehatan Kulit</h1>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Cari informasi tentang kesehatan kulit..."
          className="w-full px-4 py-3 rounded-xl border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="absolute left-4 top-3.5 text-slate-400 text-sm">🔍</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 p-4 space-y-2">
        <h3 className="font-bold text-slate-900 p-2 text-base">Pertanyaan yang Sering Diajukan (FAQ)</h3>
        {faqs.map((faq) => (
          <div key={faq.id} className="pt-2">
            <button
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full flex justify-between items-center py-3 px-2 text-left font-semibold text-sm text-slate-800 hover:text-teal-700"
            >
              <span>{faq.question}</span>
              <span>{openId === faq.id ? '🔼' : '🔽'}</span>
            </button>
            {openId === faq.id && (
              <div className="px-2 pb-4 text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
        {faqs.length === 0 && (
          <p className="text-center py-6 text-sm text-slate-400">Informasi tidak ditemukan.</p>
        )}
      </div>
    </div>
  );
}
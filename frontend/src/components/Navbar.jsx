import React from 'react';

export default function Navbar({ currentPage, setCurrentPage }) {
  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: '🏠' },
    { id: 'pemindaian', label: 'Pemindaian', icon: '🔍' },
    { id: 'edukasi', label: 'Edukasi', icon: '📖' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-6xl flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('beranda')}>
          <span className="text-teal-600 text-2xl font-bold">⚕️</span>
          <span className="text-xl font-bold text-teal-900 tracking-tight">DermaScan</span>
        </div>
        <nav className="flex gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === item.id || (item.id === 'pemindaian' && currentPage === 'hasil')
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
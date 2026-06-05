import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Beranda from './pages/Beranda';
import Pemindaian from './pages/Pemindaian';
import Edukasi from './pages/Edukasi';

export default function App() {
  const [currentPage, setCurrentPage] = useState('beranda');

  const navigateToScan = () => setCurrentPage('pemindaian');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {currentPage === 'beranda' && <Beranda onMulai={navigateToScan} />}
        {currentPage === 'pemindaian' && <Pemindaian />}
        {currentPage === 'edukasi' && <Edukasi />}
      </main>

      <Footer />
    </div>
  );
}
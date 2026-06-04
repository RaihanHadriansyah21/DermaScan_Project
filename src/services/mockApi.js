// Data Edukasi statis (pengganti database)
const faqData = [
  {
    id: 1,
    question: "Apa itu kanker kulit?",
    answer: "Kanker kulit adalah pertumbuhan abnormal sel-sel kulit yang tidak terkendali. Jenis yang paling umum adalah karsinoma sel basal, karsinoma sel skuamosa, dan melanoma. Melanoma adalah jenis yang paling berbahaya karena dapat menyebar ke organ lain.",
    keywords: ["apa", "kanker", "definisi", "melanoma"]
  },
  {
    id: 2,
    question: "Apa saja tanda-tanda awal kanker kulit?",
    answer: "Tanda-tanda awal kanker kulit meliputi: (1) Tahi lalat baru atau tahi lalat yang berubah ukuran, bentuk, atau warna; (2) Luka yang tidak sembuh dalam beberapa minggu; (3) Bintik atau bercak yang gatal, berdarah, atau berkerak; (4) Pertumbuhan kulit yang tampak mengkilap, merah muda, atau transparan. Gunakan metode ABCDE untuk memeriksa tahi lalat: Asymmetry, Border, Color, Diameter, Evolving.",
    keywords: ["tanda", "gejala", "awal", "tahi lalat", "abcde"]
  },
  {
    id: 3,
    question: "Bagaimana cara mencegah kanker kulit?",
    answer: "Pencegahan kanker kulit dapat dilakukan dengan: (1) Menghindari paparan sinar matahari langsung pada jam 10 pagi - 4 sore; (2) Menggunakan tabir surya dengan SPF minimal 30 setiap hari; (3) Mengenakan pakaian pelindung seperti topi dan baju lengan panjang; (4) Menghindari tanning bed; (5) Memeriksa kulit secara rutin setiap bulan; (6) Melakukan pemeriksaan kulit tahunan dengan dokter spesialis.",
    keywords: ["mencegah", "pencegahan", "sunscreen", "spf", "sinar matahari"]
  }
];

// Mock API untuk Simulasi Scan AI
export const scanImageAPI = async (base64Image) => {
  return new Promise((resolve, reject) => {
    if (!base64Image) return reject("Gambar tidak valid");
    
    // Simulasi proses loading AI selama 2.5 detik
    setTimeout(() => {
      resolve({
        status: "Risiko Tinggi",
        confidence: 86,
        modelUsed: "Transfer Learning CNN",
        dataset: "ISIC Skin Lesion Classification",
        timestamp: new Date().toLocaleString('id-ID')
      });
    }, 2500);
  });
};

// Mock API untuk Pencarian Edukasi (Rule-based)
export const searchEdukasiAPI = async (query = '') => {
  return new Promise((resolve) => {
    const lowerQuery = query.toLowerCase();
    
    if (!lowerQuery) {
      resolve(faqData);
      return;
    }

    const filteredData = faqData.filter(item => {
      return item.keywords.some(keyword => lowerQuery.includes(keyword)) || 
             item.question.toLowerCase().includes(lowerQuery) || 
             item.answer.toLowerCase().includes(lowerQuery);
    });

    resolve(filteredData);
  });
};
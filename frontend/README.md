# DermaScan - Sistem Deteksi Dini Penyakit Kulit dengan AI

DermaScan adalah sebuah purwarupa (*prototype*) aplikasi berbasis web yang memanfaatkan kecerdasan buatan (AI) untuk menganalisis dan mengklasifikasikan lesi atau bercak pada kulit. Aplikasi ini bertujuan memberikan indikasi awal tingkat risiko (*High Risk* / *Low Risk*) dan jenis penyakit kulit untuk membantu pengguna mengambil keputusan kapan harus berkonsultasi dengan dokter kulit profesional.

## 🚀 Prasyarat (*Prerequisites*)

Sebelum menjalankan aplikasi, pastikan sistem Anda sudah menginstal:
- **Node.js** (versi 18.x atau terbaru) dan **npm** untuk menjalankan frontend.
- **Python** (versi 3.8 - 3.10) untuk menjalankan backend model AI.

---

## 🛠️ Cara Menjalankan Aplikasi Secara Lokal

Aplikasi ini terdiri dari dua bagian: **Backend (Server AI)** dan **Frontend (Antarmuka Web)**. Keduanya harus dijalankan secara bersamaan.

### 1. Menjalankan Backend (Server AI)
Backend dibangun menggunakan kerangka kerja FastAPI dan melayani model AI untuk inferensi gambar.
1. Buka terminal baru dan masuk ke direktori `backend`:
   ```bash
   cd backend
   ```
2. (Opsional namun disarankan) Buat dan aktifkan *virtual environment* Python:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Untuk Mac/Linux
   # venv\Scripts\activate   # Untuk Windows
   ```
3. Instal dependensi backend:
   ```bash
   pip install -r requirements.txt
   ```
4. Jalankan server backend:
   ```bash
   uvicorn app:app --host 0.0.0.0 --port 8000
   ```
   *(Pastikan terminal ini dibiarkan tetap menyala karena frontend akan mengirimkan data ke port 8000).*

### 2. Menjalankan Frontend (Antarmuka Web)
Frontend dibangun menggunakan React dan Vite dengan *styling* Tailwind CSS.
1. Buka terminal baru (jangan tutup terminal backend).
2. Pastikan Anda berada di direktori utama proyek (`DermaScan_Project`).
3. Instal dependensi frontend:
   ```bash
   npm install
   ```
4. Jalankan server pengembangan Vite:
   ```bash
   npm run dev
   ```
5. Buka tautan lokal yang muncul (biasanya `http://localhost:5173`) di peramban web (*browser*) Anda.

---

## 📖 Panduan Penggunaan Aplikasi (Tutorial)

Berikut adalah langkah-langkah (*guideline*) untuk menggunakan fitur utama pemindaian pada aplikasi DermaScan:

### Langkah 1: Akses Halaman Pemindaian
1. Pada menu utama atau navigasi atas (Navbar), klik tab **Pemindaian**.
2. Anda akan diarahkan ke halaman "Pemindaian Kulit". Di sebelah kiri halaman terdapat panduan pengambilan foto agar AI dapat memproses gambar dengan optimal.

### Langkah 2: Menyiapkan dan Mengunggah Foto
Untuk hasil analisis yang akurat, ikuti **Panduan Foto** berikut:
- Pastikan area lesi atau bercak kulit terlihat tajam dan tidak blur (fokus).
- Gunakan pencahayaan yang cukup dan merata (hindari bayangan gelap atau kilauan pantulan cahaya berlebih).
- Format file yang didukung oleh sistem adalah `JPG`, `JPEG`, atau `PNG`.

**Cara mengunggah gambar:**
- **Tarik dan lepas (*drag & drop*)** file gambar Anda ke dalam area kotak putus-putus.
- **Atau**, klik tombol **"Ambil Foto / Pilih Gambar"** untuk membuka direktori file dan memilih gambar dari perangkat Anda.

### Langkah 3: Melakukan Analisis AI
1. Setelah gambar dipilih, sistem akan menampilkan *preview* (pratinjau) dari gambar Anda di layar.
2. Jika Anda merasa gambar kurang pas, tekan tombol **"Pilih Gambar Lain"** untuk mengulanginya.
3. Jika sudah sesuai, klik tombol **"Analisis Gambar"**.
4. Tunggu beberapa saat. Gambar Anda sedang dikirim secara lokal ke server backend untuk dianalisis oleh model **Multi-task EfficientNetV2S**. Anda akan melihat animasi *loading* selama proses berjalan.

### Langkah 4: Membaca Hasil Analisis
Setelah proses analisis selesai, aplikasi akan menampilkan halaman **"Hasil Analisis AI"** yang memuat beberapa informasi penting:

- **Klasifikasi Risiko:** Menampilkan indikator **High Risk** (Risiko Tinggi - biasanya diberi warna peringatan/merah) atau **Low Risk** (Risiko Rendah). Persentase/probabilitas dari tingkat risiko tersebut juga akan ditampilkan.
- **Klasifikasi Tipe Lesi:** Menampilkan prediksi spesifik mengenai jenis penyakit/kondisi kulit Anda berdasarkan 5 kelas yang dilatih, lengkap dengan persentase kecocokannya dan penjelasan singkat kondisinya.
- **Distribusi Probabilitas:** Menampilkan grafik batang sederhana (Probabilitas) yang menunjukkan seberapa yakin model AI membedakan kelas lesi dominan dibandingkan kemungkinan kelas lainnya.
- **Rekomendasi Langkah Lanjut:** Berisi anjuran tindakan selanjutnya sesuai dengan hasil risiko (seperti anjuran observasi berkala atau urgensi untuk menemui dokter).
- **Detail Teknis (Opsional):** Jika Anda mengeklik dropdown ⚙️ **Detail Teknis**, Anda dapat melihat pengaturan *threshold* AI, *ensemble size*, dan status *Test Time Augmentation* (TTA) yang digunakan pada inferensi gambar tersebut.

### Langkah 5: Menyimpan Hasil atau Pemindaian Baru
- Jika Anda ingin menjadikan hasil analisis ini sebagai referensi pribadi saat berobat, klik tombol **"💾 Simpan Hasil"**. Ini akan membuka antarmuka *print/PDF* bawaan dari *browser* Anda.
- Jika Anda ingin memeriksa area kulit lainnya, gulir ke bagian paling bawah dan klik **"Analisis Gambar Lain"**.

---

## ⚠️ Disclaimer Medis (PENTING)

Sistem ini didesain semata-mata sebagai sarana edukasi dan informasi tambahan, serta wajib tunduk pada *disclaimer* berikut:
1. **Bukan Pengganti Diagnosis Medis:** DermaScan adalah Sistem Pendukung Keputusan (*Decision Support System*) dan **TIDAK BOLEH** digunakan sebagai alat diagnosis atau pengganti nasihat medis dari dokter.
2. **Keterbatasan AI:** Model AI dilatih berdasarkan dataset terbatas (seperti dataset ISIC) untuk kategori penyakit tertentu. AI dapat melakukan kesalahan prediksi (*false positive* / *false negative*) atau gagal mengenali penyakit kulit di luar kategori pelatihannya. Kinerja AI sangat dipengaruhi oleh pencahayaan dan kualitas foto.
3. **Anjuran Berkonsultasi:** Terlepas dari apapun hasil dari aplikasi ini, jika Anda memiliki gejala yang mengganggu atau lesi yang berubah warna/bentuk/ukuran, **Anda diwajibkan segera berkonsultasi langsung dengan dokter spesialis kulit (Dermatolog)**.

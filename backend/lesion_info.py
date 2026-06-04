"""
Lesion Information Module
=========================
Human-readable descriptions and recommendations for each lesion type.
Used by the API to enrich prediction responses.
"""

LESION_INFO = {
    "AKIEC": {
        "full_name": "Actinic Keratosis / Bowen's Disease",
        "nama_lengkap": "Keratosis Aktinik / Penyakit Bowen",
        "risk_level": "high",
        "description": "Lesi prakanker yang disebabkan paparan sinar UV jangka panjang. "
                       "Dapat berkembang menjadi karsinoma sel skuamosa jika tidak ditangani.",
        "recommendation": "Segera konsultasikan dengan dokter spesialis kulit (dermatolog). "
                          "Penanganan dini sangat penting untuk mencegah perkembangan menjadi kanker.",
        "color": "#DC2626",
    },
    "BCC": {
        "full_name": "Basal Cell Carcinoma",
        "nama_lengkap": "Karsinoma Sel Basal",
        "risk_level": "high",
        "description": "Jenis kanker kulit yang paling umum. Tumbuh lambat dan jarang menyebar, "
                       "tetapi dapat merusak jaringan di sekitarnya jika tidak ditangani.",
        "recommendation": "Konsultasikan dengan dokter spesialis kulit untuk evaluasi dan rencana pengobatan. "
                          "BCC umumnya dapat ditangani dengan baik jika terdeteksi dini.",
        "color": "#DC2626",
    },
    "BKL": {
        "full_name": "Benign Keratosis",
        "nama_lengkap": "Keratosis Jinak",
        "risk_level": "low",
        "description": "Lesi kulit jinak yang umum ditemukan, termasuk keratosis seboroik. "
                       "Umumnya tidak berbahaya dan tidak memerlukan pengobatan.",
        "recommendation": "Meskipun umumnya jinak, tetap disarankan untuk memantau perubahan pada lesi. "
                          "Konsultasikan jika terjadi perubahan ukuran, warna, atau bentuk.",
        "color": "#16A34A",
    },
    "MEL": {
        "full_name": "Melanoma",
        "nama_lengkap": "Melanoma",
        "risk_level": "high",
        "description": "Jenis kanker kulit paling berbahaya yang berasal dari sel penghasil pigmen (melanosit). "
                       "Dapat menyebar ke organ lain jika tidak terdeteksi dan ditangani dini.",
        "recommendation": "SEGERA konsultasikan dengan dokter spesialis kulit atau onkologi kulit. "
                          "Melanoma membutuhkan penanganan medis sesegera mungkin. "
                          "Deteksi dini sangat meningkatkan peluang kesembuhan.",
        "color": "#DC2626",
    },
    "NV": {
        "full_name": "Melanocytic Nevus",
        "nama_lengkap": "Nevus Melanositik (Tahi Lalat)",
        "risk_level": "low",
        "description": "Tahi lalat jinak yang umum ditemukan pada kulit. "
                       "Merupakan pertumbuhan sel melanosit yang tidak berbahaya.",
        "recommendation": "Umumnya tidak memerlukan tindakan. Tetap pantau menggunakan metode ABCDE: "
                          "Asymmetry, Border, Color, Diameter, Evolving. "
                          "Konsultasikan jika tahi lalat berubah.",
        "color": "#16A34A",
    },
}


def get_lesion_info(label: str) -> dict:
    """Get detailed information for a lesion label."""
    info = LESION_INFO.get(label)
    if info is None:
        return {
            "full_name": label,
            "nama_lengkap": label,
            "risk_level": "unknown",
            "description": "Informasi tidak tersedia untuk tipe lesi ini.",
            "recommendation": "Konsultasikan dengan dokter spesialis kulit.",
            "color": "#6B7280",
        }
    return info

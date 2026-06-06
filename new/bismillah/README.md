# 🚛 Sistem Pencegahan Truk Overload

Prototype website sederhana untuk membantu mencegah kecelakaan akibat kendaraan yang membawa muatan berlebihan (overload).

## 📋 Fitur Utama

### 1. **Form Input Data Kendaraan**
   - Input plat nomor kendaraan
   - Input berat kendaraan (dalam ton)
   - Input tujuan perjalanan
   - Validasi input data

### 2. **Sistem Pemeriksaan Berat**
   - Batas aman: **10 ton**
   - Otomatis mengecek apakah berat melebihi batas aman
   - Deteksi duplikasi plat nomor

### 3. **Warning Overload**
   - Jika berat > 10 ton: Tampilkan peringatan merah dengan rekomendasi kurangi muatan
   - Menampilkan selisih berat overload

### 4. **Map Interaktif (Leaflet.js)**
   - Menampilkan peta ketika kendaraan aman
   - Menampilkan **jalur aman (hijau)** - jalur yang direkomendasikan
   - Menampilkan **jalur berbahaya (merah)** - jalur yang sebaiknya dihindari
   - Marker untuk lokasi awal dan tujuan

### 5. **Dashboard Kendaraan**
   - Menampilkan daftar semua kendaraan yang telah diinput
   - Kartu kendaraan dengan informasi lengkap:
     - Plat nomor
     - Status (AMAN atau OVERLOAD)
     - Berat kendaraan
     - Tujuan perjalanan
     - Waktu input
   - Tombol hapus per kendaraan
   - Tombol bersihkan semua data
   - Penyimpanan data menggunakan **Local Storage** (data persisten)

## 🚀 Cara Menggunakan

1. **Buka file `index.html` di browser**
   - Cukup double-click pada file atau buka melalui browser favorit Anda

2. **Isi form dengan data kendaraan:**
   - Plat Nomor: Contoh `AB 1234 CD`
   - Berat Kendaraan: Contoh `8.5` ton
   - Tujuan Perjalanan: Contoh `Jakarta - Bandung`

3. **Klik tombol "Periksa Kendaraan"**

4. **Hasil:**
   - Jika **AMAN** (≤ 10 ton): 
     - Alert hijau menampilkan pesan aman
     - Peta interaktif menampilkan jalur rekomendasi
   - Jika **OVERLOAD** (> 10 ton):
     - Alert merah menampilkan peringatan bahaya
     - Peta tidak ditampilkan

5. **Dashboard:**
   - Semua data kendaraan ditampilkan di bawah
   - Klik "Hapus" untuk menghapus data individual
   - Klik "Bersihkan Semua" untuk menghapus seluruh data

## 📁 Struktur File

```
GRUP_K_Website/
├── index.html      # File HTML utama
├── style.css       # File styling
├── script.js       # File JavaScript (logika)
└── README.md       # Dokumentasi ini
```

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Struktur halaman
- **CSS3**: Styling dan responsive design
- **JavaScript ES6**: Logika aplikasi
- **Leaflet.js**: Library peta interaktif
- **OpenStreetMap**: Penyedia peta
- **Local Storage**: Penyimpanan data di browser

## 📊 Contoh Data

| Plat Nomor | Berat (ton) | Tujuan | Status |
|-----------|-----------|--------|--------|
| AB 1234 CD | 8.5 | Jakarta - Bandung | ✅ AMAN |
| BC 5678 EF | 12.3 | Jakarta - Surabaya | ⚠️ OVERLOAD |
| CD 9012 GH | 6.0 | Jakarta - Tangerang | ✅ AMAN |

## ⚠️ Peringatan Keselamatan

- **Batas Aman: 10 ton**
- Kendaraan yang melebihi batas akan menampilkan warning
- Setiap kendaraan overload dicatat untuk monitoring
- Data disimpan secara otomatis di Local Storage

## 🎨 Fitur Desain

- **Responsive Design**: Dapat diakses dari desktop, tablet, dan mobile
- **Gradient Background**: Desain modern dengan warna gradient
- **Card System**: Kartu kendaraan yang rapi dan informatif
- **Animasi**: Transisi halus untuk user experience yang lebih baik
- **Alert Toast**: Notifikasi yang hilang otomatis setelah 5 detik

## 💾 Penyimpanan Data

Data kendaraan disimpan di **Local Storage** browser, sehingga:
- Data bertahan meski browser ditutup
- Data hilang jika cache/history browser dihapus
- Setiap browser memiliki penyimpanan terpisah

## 🔒 Validasi

- Semua field harus diisi
- Berat harus lebih besar dari 0
- Plat nomor tidak boleh duplikat
- Format plat nomor uppercase otomatis

## 📞 Catatan Pengembangan

Website ini adalah **prototype** dan dapat dikembangkan lebih lanjut dengan:
- Backend server untuk penyimpanan data permanen
- Database untuk riwayat kendaraan
- API integrasi dengan sistem perizinan kendaraan
- Notifikasi email/SMS untuk overload
- Analitik dan laporan statistik
- Authentication dan user management
- GPS integration untuk tracking real-time

## 📝 Lisensi

Bebas untuk digunakan dan dikembangkan lebih lanjut.

---

**Dibuat untuk:** Mencegah kecelakaan akibat kendaraan overload  
**Tahun:** 2026

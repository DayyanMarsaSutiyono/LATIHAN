# Sistem Absensi Mahasiswa

Aplikasi web sederhana untuk mencatat dan mengelola kehadiran mahasiswa.

## 📋 Fitur

- ✅ **Pencatatan Absensi**: Tambahkan data kehadiran mahasiswa dengan mudah
- 🔍 **Pencarian & Filter**: Cari data berdasarkan nama, NIM, kelas, dan status
- 📊 **Statistik Kehadiran**: Lihat ringkasan kehadiran, izin, sakit, dan alpa
- ✏️ **Edit Data**: Ubah data absensi yang sudah dicatat
- 🗑️ **Hapus Data**: Menghapus data yang tidak diperlukan
- 📥 **Export ke CSV**: Unduh data absensi dalam format CSV untuk keperluan lain
- 💾 **Penyimpanan Lokal**: Data disimpan di browser (localStorage)

## 🚀 Cara Menggunakan

### 1. Membuka Aplikasi
- Buka file `index.html` di browser favorit Anda

### 2. Menambah Data Absensi
1. Isi form di bagian "Tambah Data Absensi"
2. Masukkan:
   - **Nama Mahasiswa**: Nama lengkap
   - **NIM**: Nomor Induk Mahasiswa
   - **Kelas**: Pilih kelas (A, B, C, atau D)
   - **Tanggal**: Tanggal kehadiran
   - **Status**: Hadir, Izin, Sakit, atau Alpa
   - **Keterangan**: Catatan tambahan (opsional)
3. Klik tombol "Simpan Data"

### 3. Mencari & Filter Data
1. Gunakan kotak pencarian untuk mencari berdasarkan nama atau NIM
2. Filter berdasarkan kelas atau status
3. Klik tombol "Reset Filter" untuk menampilkan semua data

### 4. Edit Data
1. Klik tombol "Edit" pada baris data yang ingin diubah
2. Form akan terisi otomatis dengan data yang dipilih
3. Ubah data sesuai kebutuhan
4. Klik tombol "Update Data"

### 5. Hapus Data
1. Klik tombol "Hapus" pada baris data yang ingin dihapus
2. Konfirmasi penghapusan
3. Data akan dihapus

### 6. Export ke CSV
1. Klik tombol "📥 Export to CSV"
2. File CSV akan otomatis diunduh
3. Buka file dengan aplikasi spreadsheet seperti Excel atau Google Sheets

## 📂 Struktur File

```
absensi-app/
├── index.html      # File HTML utama
├── style.css       # File CSS untuk styling
├── script.js       # File JavaScript untuk logika
└── README.md       # Dokumentasi (file ini)
```

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Struktur halaman
- **CSS3**: Styling dan responsive design
- **JavaScript (Vanilla)**: Logika aplikasi tanpa framework
- **LocalStorage**: Penyimpanan data di browser

## 💾 Penyimpanan Data

Data disimpan di localStorage browser Anda. Ini berarti:
- ✅ Data tetap ada setelah browser ditutup
- ✅ Tidak perlu koneksi internet
- ❌ Data hanya disimpan di browser yang sama (tidak tersinkronisasi antar perangkat)
- ❌ Menghapus cache browser akan menghapus semua data

### Backup Data
Untuk membuat backup:
1. Klik "Export to CSV" untuk mengunduh data
2. Simpan file CSV di lokasi aman

## 📱 Responsif

Aplikasi dirancang untuk bekerja di berbagai ukuran layar:
- 📱 Mobile (hingga 480px)
- 📱 Tablet (480px - 768px)
- 💻 Desktop (768px ke atas)

## ⚙️ Cara Upgrade ke Backend

Untuk menggunakan database MySQL seperti yang direncanakan:

1. **Buat Backend API** (PHP/Node.js/Python)
   - Endpoint POST untuk menambah data
   - Endpoint GET untuk mengambil data
   - Endpoint PUT untuk update data
   - Endpoint DELETE untuk hapus data

2. **Modifikasi script.js**
   - Ganti localStorage dengan fetch API
   - Sesuaikan endpoint API

### Contoh dengan Fetch API:
```javascript
// Menambah data
fetch('/api/absensi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newData)
})
.then(response => response.json())
.then(data => {
    absensiData.push(data);
    displayTable();
});
```

## 📝 Catatan Penting

- Data disimpan dalam format JSON
- NIM harus unik (tidak ada duplikat untuk hari yang sama)
- Format tanggal menggunakan ISO 8601 (YYYY-MM-DD)
- Status kehadiran: Hadir, Izin, Sakit, Alpa

## 🐛 Troubleshooting

### Data tidak muncul setelah refresh
- Pastikan JavaScript diaktifkan di browser
- Cek localStorage di Developer Tools (F12 → Application → Local Storage)

### Tidak bisa input data
- Pastikan semua field yang wajib sudah terisi
- Periksa konsol untuk error (F12 → Console)

### Export CSV tidak bekerja
- Gunakan browser modern yang mendukung Blob API
- Nonaktifkan ad blocker jika perlu

## 📞 Kontak & Dukungan

Untuk pertanyaan atau laporan bug, silakan hubungi developer.

---

**Versi**: 1.0  
**Dibuat**: Mei 2026  
**Last Updated**: Mei 17, 2026

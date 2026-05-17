# 🚛 Aplikasi Manajemen Lalu Lintas Truk Berat

**Sistem survei dan monitoring real-time untuk mengelola traffic truk bermuatan berat**

## 📋 Daftar Isi
- [Fitur Utama](#fitur-utama)
- [Cara Menggunakan](#cara-menggunakan)
- [Struktur File](#struktur-file)
- [Browser Compatibility](#browser-compatibility)
- [Tips & Trik](#tips--trik)

---

## 🎯 Fitur Utama

### 📍 Halaman Formulir Input (Petugas Lapangan)
✅ Pengisian data cepat (< 2 menit)  
✅ GPS auto-detection lokasi survei  
✅ Dropdown selections (minim typing)  
✅ Upload foto dokumentasi  
✅ Offline capability - data tersimpan lokal  
✅ Real-time validasi nomor pelat  
✅ Mobile-first responsive design  

### 📊 Halaman Dashboard Monitoring (Petugas Pusat)
✅ Real-time data monitoring (auto-refresh 30 detik)  
✅ KPI Cards - Total, Daily, Average, Peak Time  
✅ Tabel data dengan sorting & filtering  
✅ Grafik Top 10 rute tersibuk  
✅ Grafik distribusi berat muatan  
✅ Export ke Excel & PDF  
✅ Pagination & responsive table  

### 🔧 Technical Features
✅ LocalStorage untuk offline persistence  
✅ Connection detection  
✅ Auto-sync saat online kembali  
✅ Chart.js untuk visualisasi  
✅ XLSX & HTML2PDF untuk export  

---

## 🚀 Cara Menggunakan

### 1. Membuka Aplikasi

#### Opsi A: Langsung di Browser (Recommended)
```bash
# Buka folder manajemenkendaraan, lalu buka file index.html di browser
# Atau gunakan Live Server di VS Code
```

#### Opsi B: Dengan Python Simple Server
```bash
cd manajemenkendaraan
python -m http.server 8000
# Buka di browser: http://localhost:8000
```

#### Opsi C: Dengan Node.js
```bash
cd manajemenkendaraan
npx http-server
# Buka di browser: http://localhost:8080
```

### 2. Pilih Role

Saat aplikasi dibuka, pilih salah satu:
- **📍 Petugas Lapangan** → Untuk input data survei
- **📊 Petugas Pusat** → Untuk monitoring & analisis

### 3. Petugas Lapangan - Formulir Input

**Step-by-step:**

1. **Lokasi Survei**
   - Klik tombol 🔄 untuk refresh lokasi GPS
   - Sistem otomatis mengambil koordinat

2. **Identitas Truk**
   - Pilih Jenis Truk dari dropdown
   - Input Nomor Pelat (format: B 1234 CD)
   - Pilih Berat Muatan (5-10, 10-20, 20-30, 30+ ton)
   - Pilih Kondisi Truk (Baik/Sedang/Rusak)

3. **Rute Perjalanan**
   - Pilih Lokasi Asal
   - Pilih Lokasi Tujuan
   - Waktu otomatis terisi (bisa diubah)

4. **Dokumentasi** (Opsional)
   - Klik 📷 Ambil Foto atau 📋 Pilih dari Galeri
   - Preview foto di bawah
   - Bisa add multiple photos

5. **Catatan** (Opsional)
   - Tulis catatan tambahan (max 250 karakter)

6. **Submit**
   - Klik tombol ✓ SIMPAN
   - Muncul success message
   - Data tersimpan lokal
   - Klik "Buat Entry Baru" untuk survey berikutnya

**Status Koneksi:**
- 🟢 Online = Data langsung disimpan
- 🟡 Offline = Data tersimpan lokal, auto-sync saat online

### 4. Petugas Pusat - Dashboard Monitoring

**Fitur Utama:**

1. **KPI Cards (Statistik Ringkas)**
   - 📦 Total Truk (semua waktu)
   - ⏰ Hari Ini (data today)
   - ⚖️ Rata-rata Berat Muatan
   - 🚨 Peak Time (jam tersibuk)

2. **Filtering**
   - Pilih Tanggal
   - Filter by Jenis Truk
   - Filter by Berat Muatan
   - Klik 🔄 Reset untuk clear filters

3. **Tabel Data**
   - Scroll horizontal untuk melihat semua kolom (mobile)
   - Klik nomor halaman untuk navigasi
   - Auto-refresh setiap 30 detik (checkbox toggle)
   - Status: ✓ Synced atau ⟳ Pending

4. **Grafik Analisis**
   - **Bar Chart:** Top 10 Rute Tersibuk
   - **Donut Chart:** Distribusi Berat Muatan

5. **Export Data**
   - 📊 Export Excel - data + statistik
   - 📄 Export PDF - report lengkap dengan grafik

---

## 📁 Struktur File

```
manajemenkendaraan/
│
├── index.html                 # Halaman welcome & role selection
├── form.html                  # Formulir input petugas lapangan
├── dashboard.html             # Dashboard monitoring petugas pusat
│
├── css/
│   └── style.css             # Stylesheet (mobile-first responsive)
│
├── js/
│   ├── app.js                # Core utilities & storage management
│   ├── form.js               # Form logic & validation
│   └── dashboard.js          # Dashboard logic & charts
│
├── UI-UX-DESIGN-GUIDE.md     # Panduan design lengkap
└── README.md                 # File ini
```

---

## 🌐 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Recommended |
| Firefox | ✅ Full | Compatible |
| Safari | ✅ Full | iOS & Mac |
| Edge | ✅ Full | Windows 10+ |
| Opera | ✅ Full | Compatible |
| IE 11 | ❌ No | Not supported |

**Mobile:**
- ✅ iOS Safari
- ✅ Chrome Mobile
- ✅ Firefox Mobile
- ✅ Samsung Internet

---

## 💾 Data Storage

### Dimana Data Disimpan?
- **Browser LocalStorage** - Automatic, no server needed
- **Max Size:** ~5-10MB per domain
- **Offline:** Data tetap tersimpan & accessible

### Struktur Data
```json
{
  "id": 1234567890,
  "timestamp": "2026-05-17T14:35:00Z",
  "location": "Jakarta Pusat",
  "truckType": "box",
  "plateNumber": "B 1234 CD",
  "weightCategory": "20-30",
  "origin": "pusat",
  "destination": "pelabuhan",
  "notes": "...",
  "photos": [...],
  "synced": true
}
```

### Export Data Keluar dari Aplikasi
- **Excel:** Berisi tabel lengkap + statistik
- **PDF:** Report profesional dengan grafik

---

## 🎮 Tips & Trik

### Demo Mode (dengan Sample Data)

Tekan **Ctrl + Shift + D** di Halaman Form untuk toggle demo mode:
```
✓ Demo mode enabled → Sample data loaded
✓ Demo mode disabled → Data cleared
```

Berguna untuk testing & presentation tanpa harus input manual.

### Shortcuts

| Shortcut | Aksi |
|----------|------|
| `Ctrl+Shift+D` | Toggle Demo Mode (Form page) |
| `Tab` | Navigate form fields |
| `Enter` | Submit form atau klik button |
| `Esc` | Close modal |

### Offline Testing

1. Buka aplikasi normal
2. Input beberapa entries
3. Buka DevTools → Network → Offline
4. Coba input entry baru - tetap bisa disimpan!
5. Set online kembali → auto-sync

### GPS Testing

Jika GPS tidak berfungsi:
- Izinkan akses lokasi di browser settings
- Gunakan Chrome DevTools untuk simulate lokasi (F12 → Sensors)
- Aplikasi akan fallback dengan estimasi lokasi berbasis IP

### Performance Tips

1. **Buka di Tab Baru** untuk dashboard auto-refresh optimal
2. **Disable Auto-refresh** jika data tidak berubah sering
3. **Gunakan Filter** untuk dataset besar
4. **Export Regularly** untuk backup data

---

## 🔐 Security & Privacy

- ✅ No data sent to external server (demo version)
- ✅ All data stored locally in browser
- ✅ HTTPS recommended untuk production
- ✅ Clear browser cache untuk clear semua data

---

## 🐛 Troubleshooting

### Masalah: GPS tidak terdeteksi
**Solusi:**
- Allowed lokasi permissions di browser
- Refresh halaman (F5)
- Coba browser lain
- Jika error, manual input lokasi (amankan di future release)

### Masalah: Data tidak muncul di Dashboard
**Solusi:**
- Refresh page (F5)
- Clear browser cache (Ctrl+Shift+Delete)
- Check filter - mungkin filter terlalu ketat
- Buka DevTools Console (F12) untuk lihat error

### Masalah: Export tidak berfungsi
**Solusi:**
- Check pop-up blocker browser
- Download harus enabled di browser settings
- Coba browser lain

### Masalah: Form tidak bisa submit
**Solusi:**
- Validasi nomor pelat format (B 1234 CD)
- Pastikan semua required field terisi
- Refresh page & coba lagi

---

## 📈 Pengembangan Lanjutan

### Fitur yang bisa ditambah:
- [ ] Backend server (Node.js/Django)
- [ ] Database (MongoDB/PostgreSQL)
- [ ] User authentication login/logout
- [ ] Multi-user role based access
- [ ] API untuk integrasi sistem lain
- [ ] Push notifications
- [ ] Offline sync dengan server
- [ ] Advanced analytics & reporting
- [ ] Map visualization (Google Maps)
- [ ] QR code scanning untuk nomor pelat

### Tech Stack untuk Production:
```
Frontend: React / Vue.js + TypeScript
Backend: Node.js (Express) / Python (Django)
Database: PostgreSQL / MongoDB
DevOps: Docker, CI/CD Pipeline
Monitoring: Sentry, LogRocket
```

---

## 📞 Support & Feedback

Jika ada bug atau fitur request:
1. Buka DevTools Console (F12)
2. Cek error messages
3. Screenshot error
4. Report issue dengan detail

---

## 📄 License

Aplikasi ini adalah demo/educational project. Bebas untuk dimodifikasi dan dikembangkan.

---

## 🙌 Credits

**Dibuat dengan:**
- HTML5, CSS3, Vanilla JavaScript
- Chart.js untuk visualisasi
- XLSX & HTML2PDF untuk export
- LocalStorage API untuk persistence

**Design inspired from:**
- Material Design
- Modern SaaS dashboards
- Mobile-first best practices

---

**Version:** 1.0 Beta  
**Last Updated:** May 17, 2026  
**Status:** ✅ Ready for Testing & Deployment

---

## 🎯 Quick Start Checklist

- [ ] Extract/Copy folder ke lokasi yang mudah diakses
- [ ] Buka `index.html` di browser (atau gunakan Live Server)
- [ ] Pilih role (Petugas Lapangan atau Pusat)
- [ ] Test form input atau dashboard
- [ ] Toggle demo mode (Ctrl+Shift+D) untuk sample data
- [ ] Test export Excel/PDF
- [ ] Test offline mode (DevTools → Network → Offline)
- [ ] Enjoy! 🎉

---

**Pertanyaan? Buka file HTML di browser dan mulai explore! 🚀**

# UI/UX Design Guide: Aplikasi Manajemen Lalu Lintas Truk Berat

**Untuk Survei dan Monitoring Truk Bermuatan Berat**

---

## 📋 1. USER STORIES

### 1.1 Halaman Formulir Input (Petugas Lapangan)

#### User Story 1: Pencatatan Cepat Data Truk
```
Sebagai: Petugas Lapangan
Saya ingin: Mencatat data truk dengan cepat dan efisien di lapangan
Agar: Proses survei dapat dilakukan dalam waktu singkat tanpa hambatan

Kriteria Penerimaan:
✓ Form dapat diselesaikan dalam < 2 menit
✓ Minimal input manual (gunakan dropdown/pilihan)
✓ Responsive di layar smartphone (minimal 320px width)
✓ Navigasi intuitif dan tombol CTA jelas
✓ Validasi real-time untuk input yang wajib
```

#### User Story 2: Offline Capability
```
Sebagai: Petugas Lapangan
Saya ingin: Tetap dapat mengisi form meski koneksi internet terganggu
Agar: Data tidak hilang dan tetap tersimpan lokal

Kriteria Penerimaan:
✓ Data tersimpan di cache lokal
✓ Indikator status koneksi jelas
✓ Sinkronisasi otomatis saat kembali online
```

#### User Story 3: Foto/Dokumentasi
```
Sebagai: Petugas Lapangan
Saya ingin: Dapat menambahkan foto truk/plat nomor sebagai bukti
Agar: Data tercatat lengkap dan valid

Kriteria Penerimaan:
✓ Upload foto dari kamera atau galeri
✓ Compress otomatis untuk efisiensi data
✓ Preview foto sebelum submit
```

---

### 1.2 Halaman Dashboard Monitoring (Petugas Pusat)

#### User Story 4: Monitoring Data Real-Time
```
Sebagai: Petugas Pusat
Saya ingin: Melihat data truk terbaru yang masuk secara real-time
Agar: Dapat membuat keputusan lalu lintas dengan data terkini

Kriteria Penerimaan:
✓ Data refresh otomatis setiap 30 detik (configurable)
✓ Tabel menampilkan minimal 10 record per halaman
✓ Sorting & filtering tersedia
✓ Kolom penting: Waktu, Plat Nomor, Jenis Truk, Rute, Berat
```

#### User Story 5: Analisis Tren Rute
```
Sebagai: Petugas Pusat
Saya ingin: Melihat rute mana saja yang paling padat dilalui truk berat
Agar: Dapat mengatur traffic management yang lebih baik

Kriteria Penerimaan:
✓ Grafik batang/pie menampilkan distribusi rute
✓ Filter berdasarkan tanggal/waktu
✓ Top 5-10 rute teratas terlihat jelas
✓ Tooltip/hover menampilkan detail count
```

#### User Story 6: Export & Report
```
Sebagai: Petugas Pusat
Saya ingin: Export data dalam format Excel/PDF untuk laporan
Agar: Data dapat dibagikan ke stakeholder lain

Kriteria Penerimaan:
✓ Tombol Export tersedia di dashboard
✓ Format output: Excel (.xlsx) atau PDF
✓ Include grafik summary di report
```

---

## 🏗️ 2. ARSITEKTUR INFORMASI

### 2.1 Information Hierarchy - Halaman Input

```
┌─────────────────────────────────────────┐
│         APLIKASI MANAJEMEN LALU LINTAS   │
├─────────────────────────────────────────┤
│                                          │
│  📍 LOKASI SURVEI (auto-detected)        │ ← GPS Location
│  Jalan Protokol, Jakarta - Koordinat GPS│
│                                          │
├─────────────────────────────────────────┤
│  INFORMASI TRUK (Level 1 - Identitas)   │
│                                          │
│  Jenis Truk: [Dropdown ▼]               │
│  ├─ Box Truck                           │
│  ├─ Dump Truck                          │
│  ├─ Tanker Truck                        │
│  ├─ Trailer                             │
│  └─ Lainnya                             │
│                                          │
│  Nomor Pelat: [____________] (auto-focus)│
│                                          │
│  Berat Truk: [Dropdown ▼] (Range)       │
│  ├─ 5-10 ton                            │
│  ├─ 10-20 ton                           │
│  ├─ 20-30 ton                           │
│  └─ 30+ ton                             │
│                                          │
├─────────────────────────────────────────┤
│  RUTE PERJALANAN (Level 2 - Tujuan)    │
│                                          │
│  Asal:        [Dropdown Lokasi ▼]       │
│  Tujuan:      [Dropdown Lokasi ▼]       │
│  Waktu Mulai: [Dropdown Jam ▼]          │
│                                          │
├─────────────────────────────────────────┤
│  DOKUMENTASI (Level 3 - Evidence)       │
│                                          │
│  [📷 Ambil Foto] [📋 Galeri]            │
│  Preview: [Img Preview Thumb]           │
│                                          │
├─────────────────────────────────────────┤
│  🔵 SIMPAN & BUAT BARU  ⚪ HAPUS         │
│                                          │
└─────────────────────────────────────────┘
```

### 2.2 Information Hierarchy - Halaman Dashboard

```
┌──────────────────────────────────────────────────────┐
│         DASHBOARD MONITORING LALU LINTAS              │
├──────────────────────────────────────────────────────┤
│                                                       │
│  📊 STATISTIK RINGKAS (Level 1 - KPI)               │
│  ┌─────────────┬──────────────┬──────────────┐      │
│  │ Total Truk  │ Hari Ini     │ Rata² Berat  │      │
│  │    142      │ 58 Truk      │  18.5 ton    │      │
│  └─────────────┴──────────────┴──────────────┘      │
│                                                       │
│  🗂️ FILTER & KONTROL (Level 2 - Navigation)         │
│  Tanggal: [─────] Ke: [─────] | Status: [Semua ▼]  │
│                                                       │
├──────────────────────────────────────────────────────┤
│                                                       │
│  📋 TABEL DATA MASUK (Level 3 - Main Content)       │
│  ┌────┬──────────┬──────────┬────────┬───────────┐  │
│  │ No │ Waktu    │ Plat     │ Rute   │ Berat     │  │
│  ├────┼──────────┼──────────┼────────┼───────────┤  │
│  │ 1  │ 14:32    │ B 1234 CD│ A→B    │ 25 ton    │  │
│  │ 2  │ 14:28    │ B 5678 EF│ C→D    │ 18 ton    │  │
│  │ 3  │ 14:15    │ B 9101 GH│ A→B    │ 22 ton    │  │
│  └────┴──────────┴──────────┴────────┴───────────┘  │
│  Halaman 1 of 5 | [«] 1 2 3 4 5 [»]                 │
│                                                       │
├──────────────────────────────────────────────────────┤
│                                                       │
│  📈 GRAFIK ANALISIS (Level 4 - Insights)            │
│                                                       │
│  ┌─ TOP 10 RUTE TERSIBUK ────────────────────────┐  │
│  │  Rute A→B: ████████████ 48 (33%)              │  │
│  │  Rute C→D: ████████ 35 (25%)                  │  │
│  │  Rute E→F: █████ 20 (14%)                     │  │
│  │  Rute G→H: ███ 15 (10%)                       │  │
│  │  Lainnya:  ████ 24 (18%)                      │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  ┌─ DISTRIBUSI BERAT MUATAN ─────────────────────┐  │
│  │  5-10 ton:   ██ 12%                            │  │
│  │  10-20 ton:  ███████ 52%                       │  │
│  │  20-30 ton:  ████ 28%                          │  │
│  │  30+ ton:    ██ 8%                             │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  [📥 Export Excel] [📄 Export PDF]                  │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## 🎨 3. WIREFRAME & REKOMENDASI LAYOUT

### 3.1 HALAMAN FORMULIR INPUT (Mobile-First)

#### Desktop View (1024px+)
```
┌────────────────────────────────────────────────────┐
│  ◀ FORMULIR SURVEI TRUK BERAT                      │
├────────────────────────────────────────────────────┤
│                                                     │
│  LOKASI SURVEI                                      │
│  ┌─────────────────────────────────────────────┐  │
│  │ 📍 Jalan Protokol, Jakarta Pusat            │  │
│  │ GPS: -6.2088° S, 106.8456° E                │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  IDENTITAS TRUK                                     │
│  ┌──────────────────────┬──────────────────────┐  │
│  │ Jenis Truk:          │ Nomor Pelat:         │  │
│  │ [Box Truck      ▼]   │ [B _ _ _ _ CD    ]   │  │
│  └──────────────────────┴──────────────────────┘  │
│                                                     │
│  ┌──────────────────────┬──────────────────────┐  │
│  │ Berat Muatan:        │ Kondisi Truk:        │  │
│  │ [10-20 ton      ▼]   │ [Baik        ▼]      │  │
│  └──────────────────────┴──────────────────────┘  │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  RUTE PERJALANAN                                    │
│  Asal:              [Pusat Kota    ▼]              │
│  Tujuan:            [Pelabuhan     ▼]              │
│  Waktu Keberangkatan: [14:30 ▼]                    │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  DOKUMENTASI                                        │
│  [📷 AMBIL FOTO] [📋 PILIH DARI GALERI]            │
│                                                     │
│  Foto 1: [████████ Preview ████████] [✕ Hapus]    │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                    Catatan (Opsional):              │
│  ┌──────────────────────────────────────────────┐  │
│  │ [Contoh: kerusakan jalan, kemacetan, dll...]│  │
│  │ ............................................   │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────┐            ┌──────────────────┐  │
│  │ ✓ SIMPAN     │            │ ⟲ BUAT BARU      │  │
│  └──────────────┘            └──────────────────┘  │
│                                                     │
└────────────────────────────────────────────────────┘
```

#### Mobile View (375px)
```
┌─────────────────────┐
│ ◀ FORMULIR SURVEI   │
├─────────────────────┤
│                      │
│ 📍 Jalan Protokol   │
│ GPS Aktif ●         │
│                      │
│ ─────────────────── │
│                      │
│ IDENTITAS TRUK      │
│                      │
│ Jenis Truk:         │
│ [Box Truck     ▼]   │
│                      │
│ Nomor Pelat:        │
│ [B _ _ _ _ CD   ]   │
│                      │
│ Berat Muatan:       │
│ [10-20 ton     ▼]   │
│                      │
│ Kondisi Truk:       │
│ [Baik           ▼]  │
│                      │
│ ─────────────────── │
│                      │
│ RUTE PERJALANAN     │
│                      │
│ Asal:               │
│ [Pusat Kota    ▼]   │
│                      │
│ Tujuan:             │
│ [Pelabuhan     ▼]   │
│                      │
│ Waktu Berangkat:    │
│ [14:30         ▼]   │
│                      │
│ ─────────────────── │
│                      │
│ DOKUMENTASI         │
│                      │
│ [📷 AMBIL FOTO]     │
│ [📋 GALERI]         │
│                      │
│ ─────────────────── │
│                      │
│ [✓ SIMPAN]          │
│ [⟲ BARU]            │
│                      │
└─────────────────────┘
```

#### Design Recommendations untuk Input Form:
- **Input Method**: Gunakan dropdown/select untuk 80% field
- **Keyboard Type**: Tel untuk nomor pelat (numeric keyboard)
- **Touch Target**: Min 48px height untuk semua button
- **Auto-Focus**: Fokus ke nomor pelat setelah pilih jenis truk
- **Clear Labels**: Gunakan ikon + teks untuk clarity
- **Error Handling**: Show inline validation (red border + text)
- **Progressive Disclosure**: Gunakan accordion untuk field opsional

---

### 3.2 HALAMAN DASHBOARD MONITORING

#### Desktop View (1440px)
```
┌──────────────────────────────────────────────────────────────┐
│                   DASHBOARD MONITORING LALU LINTAS            │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  STATISTIK RINGKAS                                             │
│  ┌──────────────┬──────────────┬──────────────┬────────────┐  │
│  │ 📦 TOTAL     │ ⏰ HARI INI  │ ⚖️  AVG BERAT│ 🚨 PUNCAK │  │
│  │   Truk       │   Masuk      │   Muatan     │   Hari    │  │
│  │   1,423      │   128        │   18.5 ton   │  15-17 WIB│  │
│  │   (+5% mjg)  │  (+12% mjg)  │             │            │  │
│  └──────────────┴──────────────┴──────────────┴────────────┘  │
│                                                                │
│  ────────────────────────────────────────────────────────────  │
│                                                                │
│  FILTER & KONTROL                                              │
│  [Tanggal: 2026-05-17 ─ 2026-05-17] [Status: Semua ▼]       │
│  [Jenis Truk: Semua ▼] [Berat: Semua ▼] [🔄 Reset]          │
│                                                                │
│  ────────────────────────────────────────────────────────────  │
│                                                                │
│  TABEL DATA MASUK (REAL-TIME ● Active)                        │
│  ┌────┬──────────┬──────────────┬──────────┬────────┬────────┐ │
│  │No  │Waktu     │Plat Nomor    │Jenis     │Rute    │Berat   │ │
│  ├────┼──────────┼──────────────┼──────────┼────────┼────────┤ │
│  │1   │14:35     │B 1234 CD     │Box Truck │A→B     │22 ton  │ │
│  │2   │14:33     │B 5678 EF     │Dump Trk  │C→D     │18 ton  │ │
│  │3   │14:30     │B 9101 GH     │Tanker    │E→F     │25 ton  │ │
│  │... │...       │...           │...       │...     │...     │ │
│  │50  │13:45     │B 9999 ZZ     │Trailer   │A→B     │28 ton  │ │
│  └────┴──────────┴──────────────┴──────────┴────────┴────────┘ │
│  Halaman 1 of 3  [◀ Prev] 1  2  3 [Next ▶]                    │
│                                                                │
│  ────────────────────────────────────────────────────────────  │
│                                                                │
│  ANALISIS & INSIGHTS                                           │
│  ┌─────────────────────────────┬─────────────────────────────┐ │
│  │ TOP 10 RUTE TERSIBUK         │ DISTRIBUSI BERAT MUATAN     │ │
│  │                              │                             │ │
│  │ Rute A→B ████████ 48 (33%)   │ 5-10 ton      12%  ██      │ │
│  │ Rute C→D ██████ 35 (25%)     │ 10-20 ton     52%  ███████ │ │
│  │ Rute E→F ████ 20 (14%)       │ 20-30 ton     28%  ████    │ │
│  │ Rute G→H ██ 15 (10%)         │ 30+ ton        8%  ██      │ │
│  │ Lainnya  ███ 24 (18%)        │                             │ │
│  │                              │                             │ │
│  └─────────────────────────────┴─────────────────────────────┘ │
│                                                                │
│  ────────────────────────────────────────────────────────────  │
│                                                                │
│  TIMELINE TRAFFIC PEAK                                         │
│  │ 08:00 ██░░░░░░░░  │ 12:00 ████░░░░░░░░  │ 16:00 ██████░░░  │
│  │ 10:00 ███░░░░░░░░  │ 14:00 █████░░░░░░  │ 18:00 ███░░░░░░░  │
│                                                                │
│  [📥 EXPORT EXCEL]  [📄 EXPORT PDF]  [🔄 REFRESH]            │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

#### Tablet View (768px)
```
┌──────────────────────────────────────┐
│      DASHBOARD MONITORING            │
├──────────────────────────────────────┤
│                                       │
│  STATISTIK RINGKAS (2 Column)        │
│  ┌──────────────┬──────────────┐    │
│  │ 📦 Total     │ ⏰ Hari Ini  │    │
│  │   1,423      │   128        │    │
│  └──────────────┴──────────────┘    │
│  ┌──────────────┬──────────────┐    │
│  │ ⚖️ Avg Berat │ 🚨 Peak      │    │
│  │  18.5 ton    │  15-17 WIB   │    │
│  └──────────────┴──────────────┘    │
│                                       │
│  FILTER                               │
│  [Tgl: 2026-05-17] [Status ▼]       │
│  [Jenis ▼] [Berat ▼]                │
│                                       │
│  TABEL (Full Width)                  │
│  ┌──────┬───────┬────────┬──────┐  │
│  │Waktu │Plat   │Jenis   │Berat │  │
│  ├──────┼───────┼────────┼──────┤  │
│  │14:35 │B 1234 │Box Trk │22 ton│  │
│  │14:33 │B 5678 │Dump Trk│18 ton│  │
│  └──────┴───────┴────────┴──────┘  │
│                                       │
│  GRAFIK (Stacked)                    │
│  ┌──────────────────────────────┐   │
│  │ TOP RUTE | BERAT DISTRIBUSI  │   │
│  │ A→B 33%  │ 10-20 ton: 52%    │   │
│  │ C→D 25%  │ 20-30 ton: 28%    │   │
│  │ E→F 14%  │ 5-10 ton: 12%     │   │
│  └──────────────────────────────┘   │
│                                       │
│  [📥 EXPORT] [📄 PDF]               │
│                                       │
└──────────────────────────────────────┘
```

#### Design Recommendations untuk Dashboard:
- **Real-time Updates**: WebSocket atau polling setiap 30 detik
- **Sortable Columns**: Klik header untuk sort ascending/descending
- **Color Coding**: Highlight row yang baru masuk (flash effect)
- **Responsive Chart**: Gunakan Chart.js atau D3.js
- **Pagination**: 50 record per halaman
- **Mobile-Friendly Table**: Swipe untuk scroll horizontal
- **Dark Mode Option**: Toggle light/dark theme

---

## 🎯 4. DESIGN PRINCIPLES & BEST PRACTICES

### 4.1 Mobile-First Approach (Input Form)

| Aspek | Rekomendasi |
|-------|-------------|
| **Tap Target Size** | Min 48x48px (ideal 56x56px) |
| **Input Method** | Dropdown > Text input > Date picker |
| **Form Length** | Max 6-8 field per screen |
| **Keyboard Type** | Use appropriate keyboard (tel, email, number) |
| **Validation** | Real-time inline validation, tidak modal alert |
| **Error Message** | Under field, red text, 14px font |
| **Button Size** | Full width atau min 120px height |
| **Spacing** | 16px margin antar section |

### 4.2 Data Visualization (Dashboard)

| Chart Type | Kapan Gunakan |
|-----------|---------------|
| **Horizontal Bar** | Membanding rute (top 10 rute tersibuk) |
| **Pie/Donut** | Distribusi kategori (berat muatan) |
| **Line Chart** | Trend waktu (traffic peak per jam) |
| **Table** | Detail transaksional data |
| **KPI Cards** | Angka penting di atas (total, daily, avg) |

### 4.3 Color Palette Recommendation

```
🎨 PRIMARY COLOR SCHEME:
- Primary Blue: #0066CC (actions, highlights)
- Success Green: #00AA44 (valid, submitted)
- Warning Orange: #FF9900 (caution, needs attention)
- Error Red: #DD0000 (errors, critical)
- Neutral Gray: #666666 (text, secondary)
- Background: #FFFFFF (light) / #F5F5F5 (subtle gray)

📊 DATA VISUALIZATION COLORS:
- Route Colors: 10 warna berbeda untuk top 10 rute
- Gradient: Light blue to dark blue untuk intensity
```

### 4.4 Typography

```
HEADING:
- H1 (Page Title): 28px, Bold, #000000
- H2 (Section): 20px, Semi-bold, #333333
- H3 (Subsection): 16px, Semi-bold, #666666

BODY:
- Regular Text: 14px, Regular, #333333
- Small Text: 12px, Regular, #666666
- Label: 12px, Semi-bold, #000000

BUTTON:
- 14px, Semi-bold, 48px height (mobile)
```

---

## 📱 5. FLOW & USER JOURNEY

### 5.1 User Journey - Petugas Lapangan

```
[Buka Aplikasi]
    ↓
[Izin GPS] → Auto-deteksi lokasi
    ↓
[Buka Form Input]
    ↓
[Pilih Jenis Truk] (Dropdown)
    ↓
[Scan/Input Nomor Pelat] (Keyboard numeric)
    ↓
[Pilih Berat Muatan] (Dropdown range)
    ↓
[Pilih Rute] (Dropdown asal & tujuan)
    ↓
[Ambil Foto] (Kamera / Galeri)
    ↓
[Review Data]
    ↓
[Klik SIMPAN]
    ↓
[Sinkronisasi ke Server] ← Offline-capable
    ↓
[Success Message + Option BUAT BARU]
```

### 5.2 User Journey - Petugas Pusat

```
[Buka Dashboard]
    ↓
[Otomatis Load Data + Auto-refresh 30s]
    ↓
[View KPI Cards] (Total, Daily, Avg, Peak)
    ↓
[OPTION A: Lihat Tabel]
    ├─ Sort/Filter
    ├─ Lihat Detail Row
    └─ Export ke Excel
    ↓
[OPTION B: Lihat Grafik]
    ├─ Top 10 Rute (Bar chart)
    ├─ Distribusi Berat (Pie chart)
    └─ Traffic Peak Timeline
    ↓
[OPTION C: Export Report]
    ├─ Export Excel dengan chart
    ├─ Export PDF
    └─ Send Email
```

---

## 🔧 6. TECHNICAL CONSIDERATIONS

### 6.1 Frontend Stack Recommendation

```
FRAMEWORK: React / Vue.js
STATE MANAGEMENT: Redux / Vuex (untuk sync data real-time)
CHARTING: Chart.js atau ECharts
TABLE: React Table / Element Plus Table
FORM VALIDATION: Formik + Yup
OFFLINE: Service Worker + IndexedDB
CAMERA: react-webcam / native Camera API
```

### 6.2 API Endpoints Needed

```
INPUT FORM:
POST /api/truck-survey          (Submit survey data)
POST /api/truck-survey/upload   (Upload foto)

DASHBOARD:
GET /api/surveys/list           (Ambil data dengan pagination)
GET /api/surveys/stats          (Ambil statistik KPI)
GET /api/surveys/routes/top10   (Top 10 rute)
GET /api/surveys/weight-distribution (Distribusi berat)
POST /api/surveys/export        (Export Excel/PDF)
```

### 6.3 Database Schema

```sql
-- Main Table
CREATE TABLE surveys (
    id INT PRIMARY KEY AUTO_INCREMENT,
    timestamp DATETIME DEFAULT NOW(),
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    truck_type VARCHAR(50),
    plate_number VARCHAR(20) UNIQUE,
    weight_ton INT,
    truck_condition VARCHAR(50),
    origin VARCHAR(100),
    destination VARCHAR(100),
    departure_time TIME,
    notes TEXT,
    photo_url VARCHAR(255),
    synced_status ENUM('pending','synced') DEFAULT 'pending',
    petugas_id INT,
    FOREIGN KEY (petugas_id) REFERENCES users(id)
);

-- Supporting Table untuk referensi
CREATE TABLE routes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    origin VARCHAR(100),
    destination VARCHAR(100),
    frequency INT DEFAULT 0
);
```

---

## ✅ 7. TESTING CHECKLIST

### 7.1 Form Input Testing
- [ ] Form responsive di 320px, 768px, 1024px
- [ ] Validasi field wajib berjalan real-time
- [ ] Foto upload berfungsi (kamera & galeri)
- [ ] Data tersimpan offline (buka DevTools → Storage)
- [ ] Sinkronisasi saat online kembali
- [ ] Button CTA mudah diklik (58px min)
- [ ] Keyboard type sesuai per field
- [ ] Success message muncul setelah submit

### 7.2 Dashboard Testing
- [ ] Data auto-refresh setiap 30 detik
- [ ] Tabel sorting & filtering bekerja
- [ ] Grafik render dengan benar
- [ ] Export Excel/PDF berisi data & chart
- [ ] Responsive di semua ukuran device
- [ ] Filter reset membersihkan semua filter
- [ ] Pagination navigasi bekerja

### 7.3 Performance
- [ ] Form load < 2 detik
- [ ] Dashboard load < 3 detik
- [ ] Auto-refresh tidak freeze UI
- [ ] Foto compress tanpa quality loss

---

## 📝 NOTES & NEXT STEPS

1. **Prototype dengan Figma/Adobe XD**: Buat interactive mockup sebelum dev
2. **Conduct User Testing**: Test dengan 5-10 petugas lapangan & pusat
3. **Accessibility**: Pastikan WCAG 2.1 AA compliance
4. **Performance**: Optimize image, lazy loading, caching
5. **Analytics**: Track user behavior untuk continuous improvement
6. **Documentation**: API docs, user manual, admin guide

---

**Design Guide Version**: 1.0  
**Last Updated**: May 17, 2026  
**Status**: ✅ Ready for Development


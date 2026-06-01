# Pencatatan Perawatan Rutin Mobil

Situs web sederhana untuk mencatat data perawatan rutin kendaraan, termasuk:

- Plat nomor
- Jenis kendaraan
- Kilometer kendaraan
- Tanggal perawatan
- Rincian perawatan

## Cara menggunakan

1. Pasang dependensi Python dengan:
   ```bash
   pip install -r requirements.txt
   ```
2. Jalankan server dari folder `perawatan-mobil`:
   ```bash
   python app.py
   ```
3. Buka browser di komputer utama:
   `http://127.0.0.1:5000`
4. Untuk mengakses dari device lain di jaringan lokal, temukan alamat IP komputer utama, misalnya `192.168.1.100`, lalu buka:
   `http://192.168.1.100:5000`
5. Isi formulir perawatan rutin dengan informasi kendaraan.
6. Tekan tombol "Simpan Data" untuk melihat histori perawatan.
7. Gunakan tombol "Hapus Semua" untuk mengosongkan catatan.

## Cara data terkumpul ke satu database

Web ini sekarang menggunakan server Python Flask yang menyimpan semua data ke database SQLite `records.db`.
Semua device yang membuka alamat server akan melihat dan menambahkan data ke database yang sama.

> Pastikan kedua device berada di jaringan Wi-Fi atau LAN yang sama dan port `5000` tidak diblokir firewall.

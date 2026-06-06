Backend Flask untuk API sederhana (upload, detect OCR, rekomendasi rute).

Cara jalankan:

1. Masuk ke folder backend:

   cd manajemenkendaraan/backend

2. Buat virtualenv dan install dependency:

   python -m venv .venv
   .\.venv\Scripts\activate
   pip install -r requirements.txt

3. Jalankan server:

   python app.py

Server akan berjalan di `http://localhost:5000`.

Catatan:
- OCR menggunakan `pytesseract` jika tersedia; pada Windows Anda perlu menginstall Tesseract-OCR terpisah.
- Endpoint utama: `POST /api/recommend-route` menerima JSON dengan `origin`, `destination`, `weightCategory`, `truckType`.

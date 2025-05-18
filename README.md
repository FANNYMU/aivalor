# AI Volar

Aplikasi modern untuk mengajukan pertanyaan dan mendapatkan jawaban dari dokumen Anda menggunakan kecerdasan buatan.

## Fitur

- Upload berbagai format file (PDF, DOCX, TXT, XLS, dll)
- Ekstraksi teks otomatis dari file yang diunggah
- Interaksi dengan AI untuk mengajukan pertanyaan berdasarkan konten dokumen
- Antarmuka pengguna modern dengan animasi halus
- Riwayat chat dengan AI

## Teknologi yang Digunakan

- React.js
- Tailwind CSS
- Framer Motion untuk animasi
- Groq SDK untuk AI
- PDF.js, Mammoth.js, dan library lain untuk parsing file

## Memulai

1. Clone repositori ini
2. Install dependensi dengan perintah `npm install`
3. Salin file `.env.example` menjadi `.env` dan masukkan API key Groq Anda
4. Jalankan aplikasi dengan perintah `npm run dev`

## Konfigurasi

Untuk menggunakan aplikasi ini, Anda memerlukan API key dari Groq. Daftar di [https://console.groq.com](https://console.groq.com) untuk mendapatkan API key.

## Pengembangan Lanjutan

Fitur yang akan datang:
- Sistem otentikasi pengguna
- Penyimpanan riwayat chat dan dokumen
- Dukungan untuk lebih banyak format file
- Opsi penyesuaian model AI

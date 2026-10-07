# Sistem Penyusunan & Ekspor Laporan Bulanan BerAKHLAK Pengawas SMA

Sistem otomatisasi penyusunan Laporan Hasil Kegiatan Bulanan Pengawas SMA berdasarkan Core Values ASN BerAKHLAK (Berorientasi Pelayanan, Akuntabel, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif) dengan fitur distribusi 1 input kegiatan ke multi-kategori, profil pengawas kustom, pratinjau interaktif, serta ekspor dokumen Microsoft Word (.docx) dan PDF berformat resmi F4 Landscape (Folio 215 × 330 mm) margin 1 cm.

### User Review & Critical Decisions

> [!IMPORTANT]
> Berdasarkan preferensi yang telah Anda konfirmasi:
> 1. **Profil Pengawas & Instansi Fleksibel**: Menyediakan modul manajemen profil pengawas (Nama, Gelar, NIP, Jabatan, Cabang Dinas, Kabupaten/Kota, Alamat Kantor, Kontak, Logo Instansi Prov Jawa Timur, dan QR Code/Tanda Tangan) yang tersimpan otomatis di penyimpanan lokal (Local Storage) dan dapat diperbarui sewaktu-waktu.
> 2. **Dokumentasi Fleksibel**: Kolom Keterangan mendukung unggah foto langsung (kamera/galeri dengan kompresi otomatis) serta input tautan Google Drive. Jika tautan Google Drive tidak diisi, laporan tetap valid dan dapat diproses tanpa kendala.
> 3. **Ekspor Mandiri & Bundel**: Pengguna dapat mengunduh dokumen laporan per unsur BerAKHLAK yang dipilih atau mengunduh sekaligus satu bundel (7 laporan BerAKHLAK) dalam format Word (.docx) F4 Landscape dan cetak langsung / simpan PDF.

- **Confirmed Decision 1**: Profil pengawas, instansi, dan periode laporan (Bulan & Tahun) dapat diedit bebas dan tersimpan permanen di perangkat pengguna.
- **Confirmed Decision 2**: Format tabel dan layout persis sesuai dokumen referensi Pengawas Jatim (Halaman Judul/Cover + Lembar Kegiatan dengan Deskripsi Self Asesmen, Tabel 7 Kolom, Blok Tanda Tangan & QR Verifikasi, serta Catatan Bukti Dukung Google Drive di bagian bawah).
- **Confirmed Decision 3**: Spesifikasi cetak & ekspor mengunci ukuran F4/Folio Landscape (215 mm × 330 mm) dengan margin rata 1 cm (top, bottom, left, right) sesuai regulasi dinas.

---

### 1. Overview & Core Concept

Aplikasi dirancang khusus untuk Pengawas SMA (dan tenaga pendidik/kependidikan ASN) untuk menghemat waktu pelaporan bulanan dari berjam-jam menjadi beberapa menit:
- **Pencatatan Cepat & Multi-Kategori**: Satu kali penginputan kegiatan dapat langsung dicentang ke satu atau lebih kategori BerAKHLAK:
  1. *Berorientasi Pelayanan*
  2. *Akuntabel*
  3. *Kompeten*
  4. *Harmonis*
  5. *Loyal*
  6. *Adaptif*
  7. *Kolaboratif*
- **Distribusi Otomatis**: Setiap laporan BerAKHLAK secara otomatis mengumpulkan kegiatan yang relevan, menomori ulang secara berurutan, dan memformat deskripsi serta foto dokumentasi.
- **Self Asesmen Pintar**: Setiap unsur memiliki teks Deskripsi Self Asesmen bawaan standar pengawas yang dapat disesuaikan atau diisi mandiri per bulan.
- **Pratinjau Otentik F4 Landscape**: Sebelum mengunduh, pengguna dapat melihat tampilan persis (WYSIWYG) seperti halaman fisik F4 dengan navigasi antar halaman, cover, dan tabel.
- **Dual Export Engine**:
  - **Microsoft Word (.docx)**: Dibuat langsung menggunakan struktur file OpenXML dengan spesifikasi ukuran kertas Folio/F4 (8.5 × 13 inci / 12191 × 18708 dxa), orientasi landscape, margin 1 cm (567 dxa), tabel bergaris hitam rapi, header berwarna soft pink/merah muda khas format Cabdin Jatim, dan sematan gambar foto dokumentasi.
  - **PDF / Print View**: Menggunakan CSS Paged Media `@page { size: 330mm 215mm; margin: 10mm; }` untuk menghasilkan file PDF tajam beresolusi tinggi tanpa penurunan kualitas font.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Atur Profil & Periode**: Pengguna memeriksa nama (misal *ARIYANTI, M.Pd*), NIP, Cabdin (*Cabang Dinas Pendidikan Wilayah Jember - Kab. Lumajang*), periode laporan (contoh: *September 2026*), dan tautan folder Drive utama.
2. **Entri / Impor Kegiatan**:
   - Isi form: Hari/Tanggal, Nama/Bentuk Kegiatan, Tempat/Platform Kegiatan, Sasaran/Pihak Terlibat, Hasil Kegiatan, Unggah Foto Dokumentasi, dan Tautan Berkas (opsional).
   - Centang kategori BerAKHLAK yang sesuai (bisa memilih lebih dari satu, misal: *Kolaboratif* dan *Akuntabel*).
   - Tekan tombol **Simpan Kegiatan**.
3. **Filter & Kelola Data**: Lihat tabel daftar seluruh kegiatan, filter berdasarkan kategori BerAKHLAK, cari kata kunci, ubah, atau hapus entri. Dilengkapi data sampel terverifikasi dari dokumen referensi September 2026 agar pengguna langsung melihat contoh nyata.
4. **Pratinjau Dokumen F4**: Buka tab **Pratinjau Laporan**, pilih nilai BerAKHLAK atau seluruh laporan, periksa tata letak halaman cover, halaman isi tabel, dan tanda tangan digital.
5. **Ekspor & Unduh**:
   - Tombol **Unduh Word (.docx)** (F4 Landscape, margin 1 cm).
   - Tombol **Unduh / Cetak PDF** (F4 Landscape presisi).
   - Tombol **Unduh Bundel (.zip / batch DOCX)** untuk semua 7 kategori BerAKHLAK sekaligus.

#### Visual Identity & Theme
- **Nuansa & Estetika**: Profesional kedinasan modern (*Government/Executive Administrative*), bersih, tegap, dengan dominasi palet biru navy (`#0F172A`, `#1E3A8A`) dipadu abu-abu dingin (`#F8FAFC`, `#E2E8F0`) dan aksen emas/emerald terukur.
- **Tipografi**:
  - Antarmuka aplikasi: `Plus Jakarta Sans` untuk kejelasan teks administratif dan label yang padat.
  - Dokumen laporan (Word & PDF preview): `Times New Roman` atau serif formal bergaris tegas sesuai pakem administrasi kedinasan Indonesia.
  - Angka & tanggal: `tabular-nums` untuk perataan vertikal yang rapi.
- **Header Tabel Laporan**: Menggunakan aksen warna merah muda pastel (`#F8D7DA` / `#FCE7EA`) yang identik dengan dokumen fisik referensi Cabdin Jatim.

---

### 3. Key Product Decisions & Trade-Offs

- **Trade-Off 1: Mesin Pembuatan Word (.docx) Sisi Klien**:
  - *Pendekatan*: Menggunakan library `docx` untuk merakit file dokumen Microsoft Word murni di peramban secara deterministik dengan ukuran `PageSize` $18708 \times 12191$ dxa (330mm $\times$ 215mm) dan margin $567$ dxa (10mm).
  - *Keunggulan*: Dokumen Word dapat langsung diedit di Microsoft Word / WPS Office tanpa ketergantungan server atau risiko kebocoran data pribadi.
- **Trade-Off 2: Penyimpanan Data Lokal (IndexedDB / LocalStorage)**:
  - *Pendekatan*: Seluruh data kegiatan dan gambar dokumentasi disimpan di browser lokal menggunakan penyimpanan persisten dengan penanganan kompresi foto cerdas (resolusi optimal untuk tabel dokumen).
  - *Keunggulan*: Privasi pengawas terjamin 100%, bekerja offline saat dinas lapangan ke sekolah terpencil, dan responsivitas instan tanpa jeda jaringan.
- **Trade-Off 3: Template Deskripsi Self Asesmen Bawaan**:
  - *Pendekatan*: Menyediakan 7 template kalimat Self Asesmen bawaan untuk setiap Core Value (misal Kolaboratif: *"Saya responsif terhadap informasi dari pimpinan dan Korwas/MKPS..."*), dengan kebebasan bagi pengawas untuk mengedit kalimat tersebut sesuai dinamika tugas bulanannya.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LAPORAN BERAKHLAK PENGAWAS                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│   Profil & Setup  │     │ Form Multi-Kategori│    │  Koleksi Kegiatan │
│ - Data Pengawas   │     │ - Tanggal & Tempat│     │ - Filter BerAKHLAK│
│ - Instansi/Cabdin │     │ - Sasaran & Hasil │     │ - Pencarian Kata  │
│ - TTD & QR Valid  │     │ - Upload Foto     │     │ - Edit & Hapus    │
│ - Periode Bulan   │     │ - Multi-Checkbox  │     │ - Data Sampel     │
└─────────┬─────────┘     └─────────┬─────────┘     └─────────┬─────────┘
          │                         │                         │
          └─────────────────────────┼─────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   DISTRIBUSI DATA KE 7 UNSUR BERAKHLAK                 │
│  [Pelayanan] [Akuntabel] [Kompeten] [Harmonis] [Loyal] [Adaptif] [Kolaboratif]
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
          ┌─────────────────────────┴─────────────────────────┐
          ▼                                                   ▼
┌───────────────────────────────────┐     ┌───────────────────────────────────┐
│     PRATINJAU DOKUMEN F4          │     │        ENGINE EKSPOR RESMI        │
│ - Halaman Sampul (Cover Resmi)    │     │ 1. Word Generator (docx):         │
│ - Lembar Kegiatan (Tabel 7 Kolom) │     │    - Kertas F4 (215 x 330 mm)     │
│ - Blok Tanda Tangan & QR          │     │    - Margin 1 cm keliling         │
│ - Tautan Bukti Folder Drive       │     │ 2. PDF Generator (Print CSS F4):  │
│ - Navigasi Halaman Interaktif     │     │    - Format siap cetak / PDF      │
└───────────────────────────────────┘     │ 3. Batch ZIP Export (7 Dokumen)   │
                                          └───────────────────────────────────┘
```

#### Komponen Utama
1. **Header & Navigation Bar**: Logo Pemprov Jatim / Tut Wuri Handayani, judul sistem, indikator jumlah kegiatan bulan berjalan, dan tombol cepat pratinjau.
2. **Tab Pengaturan Profil & Periode**: Pengaturan nama, NIP, Cabang Dinas, Kabupaten/Kota, jabatan, dan nomor kontak.
3. **Tab Entri Kegiatan**: Form input interaktif dengan checkbox 7 nilai BerAKHLAK, pemilih tanggal cerdas (otomatis format *Rabu, 2 September 2026*), kompresi foto otomatis, dan validasi kelengkapan.
4. **Tab Bank Kegiatan**: Menampilkan daftar tabel kegiatan dengan filter per nilai BerAKHLAK, pencarian cepat, ekspor/impor data JSON untuk backup.
5. **Modal & View Pratinjau F4**: Komponen visualisasi dokumen F4 Landscape berasio 1.53:1 dengan pembagian halaman otomatis, cover resmi, tabel header bergaris ganda, dan footer tanda tangan.
6. **Modul Dokumen Word & PDF**: Generator file `.docx` dan skrip pencetakan PDF berspesifikasi F4 Landscape 1 cm margin.

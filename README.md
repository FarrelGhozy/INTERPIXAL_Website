# INTERPIXAL_Website — Integrated 698 Plat G (Dummy Preview)

Profil dummy angkatan 2024 Konsulat Pekalongan (Plat G).

## Struktur folder

```
.
├── index.html                  # struktur + konten saja (92KB, tanpa CSS/JS inline)
├── css/
│   └── styles.css              # custom styles pecahan dari index.html
├── js/
│   ├── tailwind-config.js      # config Tailwind CDN (prototype)
│   └── app.js                  # drawer, filter, modal, slider, form dummy
├── assets/
│   ├── logos/
│   │   ├── logo-general.png          # dummy 512px (ganti file asli, nama sama)
│   │   ├── logo-konsulat.png         # dummy 512px (ganti file asli, nama sama)
│   │   ├── logo-general-circle.png   # varian lingkaran dummy
│   │   └── logo-konsulat-circle.png  # varian lingkaran dummy
│   ├── images/
│   │   ├── og-cover.png        # cover share WA/IG 1200x630 dummy
│   │   ├── ketua/ketua-dummy.png
│   │   ├── wilayah/*.png       # 6 daerah (pekalongan, batang, pemalang, tegal, brebes, perantauan)
│   │   ├── galeri/*.png        # 5 foto (yudisium, perfotoan, panggung, silaturahmi, baksos)
│   │   └── korda/*.png         # avatar korda + alumni dummy
│   └── favicon/favicon.png
└── README.md
```

## Cara pakai

- Buka `index.html` langsung di browser untuk preview (semua aset sudah lokal, bisa offline kecuali Tailwind CDN + Fonts + FontAwesome).
- Ganti ke data real tanpa ubah kode: timpa file di `assets/` dengan nama yang sama.
  - Logo asli → `assets/logos/logo-general.png` & `logo-konsulat.png`
  - Foto ketua → `assets/images/ketua/ketua-dummy.png` (atau tambah file baru + update `src`)
  - Foto wilayah/galeri → timpa file di folder masing-masing.

## Catatan dummy

Semua nama, angka (total 154), kontak WA, IG/TikTok `@integrated698.pkl_dummy`, dan teks adalah contoh untuk gambaran. Cari kata `dummy` di `index.html` / `js/app.js` untuk menemukan yang perlu diganti saat launching.

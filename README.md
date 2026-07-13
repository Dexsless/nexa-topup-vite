# NEXA TOPUP

NEXA TOPUP adalah demo website top-up game modern dan responsif yang dibangun dengan React, Vite, TypeScript, dan Tailwind CSS. Proyek ini menggunakan data lokal serta simulasi checkout di sisi browser, sehingga dapat dijalankan tanpa backend maupun payment gateway.

> **Penting:** seluruh transaksi, invoice, harga, promo, dan status pembayaran pada proyek ini adalah data simulasi. Aplikasi tidak memproses pembayaran atau top-up sungguhan.

## Fitur

- Beranda responsif dengan header sticky, pencarian game, menu mobile, carousel promosi, promo spesial, daftar game populer, voucher, banner keuntungan, dan panduan top-up.
- Katalog semua game dengan pencarian, filter kategori, loading skeleton, dan empty state.
- Halaman promo dan detail top-up dinamis untuk setiap game.
- Form top-up bertahap dengan validasi User ID, Zone ID untuk game tertentu, nominal, metode pembayaran, WhatsApp, kode promo, persetujuan, dan ringkasan pesanan.
- Metode pembayaran mock: QRIS, GoPay, DANA, OVO, ShopeePay, dan Virtual Account.
- Simulasi checkout dengan feedback loading, error, sukses, serta invoice dummy.
- Pengecekan dan detail transaksi dari riwayat sementara yang disimpan di `localStorage`.
- Toast notification, fallback gambar, lazy loading, metadata SEO dasar, favicon, navigasi keyboard, label input, dan kontras warna yang baik.
- Desain satu kolom pada mobile serta grid adaptif untuk tablet dan desktop.

## Route

| Route | Keterangan |
| --- | --- |
| `/` | Beranda dan pencarian game |
| `/games` | Semua game, pencarian, dan filter kategori |
| `/promos` | Daftar promo |
| `/game/:slug` | Detail game dan form top-up |
| `/check-transaction` | Simulasi pencarian invoice |
| `/transaction/:invoice` | Detail status transaksi mock |
| `/contact` | Pusat bantuan dan form masukan demo |
| `/terms` | Ketentuan penggunaan demo |
| `/privacy` | Kebijakan privasi demo |
| `*` | Halaman 404 |

## Teknologi

- React 19
- Vite 8
- TypeScript
- Tailwind CSS 4
- React Router
- Lucide React
- Inter melalui `@fontsource/inter`
- ESLint

## Prasyarat

- Node.js 20.19 atau lebih baru
- npm 10 atau lebih baru

## Menjalankan secara lokal

1. Clone repository lalu masuk ke direktori proyek.
2. Instal dependency:

   ```bash
   npm install
   ```

3. Jalankan development server:

   ```bash
   npm run dev
   ```

4. Buka URL lokal yang ditampilkan Vite, umumnya `http://localhost:5173`.

## Pemeriksaan kualitas dan build

Jalankan lint:

```bash
npm run lint
```

Buat production build:

```bash
npm run build
```

Pratinjau hasil build dari folder `dist`:

```bash
npm run preview
```

## Konfigurasi environment

Salin `.env.example` menjadi `.env` jika ingin menyiapkan konfigurasi lokal. Aplikasi demo ini tidak membutuhkan environment variable agar dapat berjalan.

```env
VITE_API_BASE_URL=
```

`VITE_API_BASE_URL` disediakan sebagai titik konfigurasi untuk integrasi API atau payment gateway di masa depan. Jangan commit `.env`, token, API key, credential, atau data rahasia. Hanya variable dengan awalan `VITE_` yang dapat dibaca oleh kode client Vite; karena itu, jangan pernah menaruh secret sebenarnya di dalam variable tersebut.

## Struktur proyek

```text
.
|-- public/
|   |-- images/games/
|   |-- favicon.svg
|   `-- og-card.svg
|-- src/
|   |-- components/
|   |-- data/
|   |   |-- content.ts
|   |   |-- games.ts
|   |   |-- paymentMethods.ts
|   |   `-- promos.ts
|   |-- layouts/
|   |-- pages/
|   |-- services/
|   |   `-- transactionService.ts
|   |-- types/
|   |-- App.tsx
|   |-- index.css
|   `-- main.tsx
|-- .env.example
|-- index.html
|-- package.json
|-- vercel.json
`-- vite.config.ts
```

Data game, promo, metode pembayaran, dan konten tampilan dipisahkan dari komponen agar mudah diganti atau dihubungkan ke API nantinya. `transactionService.ts` menjadi batas integrasi untuk mengganti simulasi browser dengan layanan transaksi yang sebenarnya.

## Deploy ke Vercel

1. Push source code ke repository GitHub.
2. Di Vercel, pilih **Add New Project** lalu import repository tersebut.
3. Gunakan konfigurasi berikut:

   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. Tambahkan environment variable hanya jika aplikasi telah dihubungkan ke API yang sesuai.
5. Jalankan deployment dan uji semua route secara langsung serta melalui refresh browser.

Proyek menyertakan `vercel.json` dengan SPA rewrite ke `/index.html`. Konfigurasi ini diperlukan agar route React Router seperti `/game/:slug` dan `/transaction/:invoice` tetap dapat dibuka atau di-refresh tanpa menghasilkan 404 dari server Vercel.

## Data mock dan batasan demo

- Game, nominal, harga, promo, banner, voucher, publisher, dan metode pembayaran berasal dari data lokal.
- Checkout hanya membuat invoice dummy; tidak ada pembayaran, verifikasi akun game, maupun pengiriman item sebenarnya.
- Riwayat transaksi disimpan di `localStorage` browser dan dapat hilang jika data situs dibersihkan atau aplikasi dibuka dari browser/perangkat lain.
- Status transaksi tidak disinkronkan ke server dan tidak cocok untuk penggunaan produksi.
- Integrasi produksi memerlukan backend aman, database, autentikasi, validasi server, webhook, serta payment gateway resmi.
- Nama dan logo game tetap merupakan milik masing-masing pemegang hak. Proyek ini tidak berafiliasi dengan publisher atau platform game mana pun.

## Kredensial demo

Tidak ada akun atau kredensial demo. Seluruh fitur yang tersedia dapat digunakan langsung tanpa login.

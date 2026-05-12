# 🎮 GameTop - Neo Brutalism Game Top Up Platform

Platform top up game modern dengan desain Neo Brutalism yang responsif, cepat, dan siap production.

## ✨ Fitur Utama

### 🏠 Halaman Utama (Beranda)
- **Hero Section** dengan banner promo carousel
- **Search Game** real-time dengan dropdown hasil
- **Kategori Game** filter (Popular, Trending, New, RPG, FPS, MOBA)
- **List Recommended** game pilihan
- **List Promo** game dengan diskon
- **List Semua Game** dengan grid responsif
- **Footer Modern** dengan info kontak dan metode pembayaran
- **Bottom Navigation** khusus mobile (Home, History, Promo, Profile)

### 🎮 Fitur Top Up
- **Input User ID** dengan validasi
- **Input Server ID** (opsional, tergantung game)
- **Cek Username** otomatis via API/simulasi
- **Pilihan Nominal** dengan harga dan bonus
- **Pilihan Pembayaran**: QRIS, DANA, OVO, GoPay, Bank Transfer
- **Ringkasan Pesanan** real-time
- **Checkout** dengan generate invoice otomatis

### 💳 Portal Pembayaran
- **Status Real-time**: Belum Dibayar, Pending, Sukses, Gagal
- **Countdown Timer** pembayaran
- **QR Code** pembayaran
- **Detail Transaksi** lengkap
- **Auto Update** via Supabase Realtime
- **Refresh Status** manual

### 📜 History Pembelian
- **Cek History** dengan Invoice ID atau User ID
- **Detail Transaksi**: Status, Username, Nominal, Metode, Waktu
- **Search Transaction**
- **Copy Invoice ID**

### 🔐 Halaman Admin
- **Login** dengan password
- **Session Management**
- **Protected Route**
- **Dashboard Statistik**: Total Transaksi, Pendapatan, User, Produk
- **Manajemen Transaksi**: Lihat & Ubah Status
- **Manajemen Produk**: Tambah, Edit, Hapus
- **Manajemen Game**: View list
- **Search & Filter**
- **Dark Mode**

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js 14 + React 18 + TypeScript |
| Styling | Tailwind CSS + Neo Brutalism Design |
| Backend/API | Supabase (PostgreSQL + Realtime) |
| Auth | Cookie-based Admin Session |
| Hosting | Vercel |
| Icons | Lucide React |
| Toast | React Hot Toast |
| QR Code | qrcode.react |

## 📁 Struktur Folder

```
game-topup-neo-brutalism/
├── src/
│   ├── app/
│   │   ├── (main)/                 # Route group untuk halaman utama
│   │   │   ├── page.tsx             # Home/Beranda
│   │   │   ├── layout.tsx           # Layout dengan BottomNav
│   │   │   ├── [gameSlug]/
│   │   │   │   └── page.tsx         # Detail Game + Top Up
│   │   │   ├── history/
│   │   │   │   └── page.tsx         # Riwayat Pembelian
│   │   │   ├── promo/
│   │   │   │   └── page.tsx         # Halaman Promo
│   │   │   ├── profile/
│   │   │   │   └── page.tsx         # Profil User
│   │   │   └── payment/
│   │   │       └── page.tsx         # Status Pembayaran
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── page.tsx         # Login Admin
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx         # Dashboard Admin
│   │   │   └── layout.tsx           # Admin Layout
│   │   ├── api/
│   │   │   ├── check-username/
│   │   │   │   └── route.ts         # API Cek Username
│   │   │   ├── create-invoice/
│   │   │   │   └── route.ts         # API Buat Invoice
│   │   │   └── admin/
│   │   │       ├── login/
│   │   │       │   └── route.ts     # API Login
│   │   │       ├── check/
│   │   │       │   └── route.ts     # API Cek Session
│   │   │       └── logout/
│   │   │           └── route.ts     # API Logout
│   │   ├── layout.tsx               # Root Layout
│   │   └── globals.css              # Global Styles
│   ├── components/
│   │   ├── ui/                      # Reusable UI Components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Input.tsx
│   │   ├── layout/                  # Layout Components
│   │   │   ├── Header.tsx
│   │   │   └── BottomNav.tsx
│   │   ├── game/                    # Game Components
│   │   │   ├── GameCard.tsx
│   │   │   ├── GameList.tsx
│   │   │   └── SearchGame.tsx
│   │   ├── payment/                 # Payment Components
│   │   │   ├── PaymentMethodSelector.tsx
│   │   │   ├── ProductSelector.tsx
│   │   │   └── OrderSummary.tsx
│   │   ├── admin/                   # Admin Components
│   │   │   ├── StatCard.tsx
│   │   │   ├── TransactionTable.tsx
│   │   │   └── ProductForm.tsx
│   │   └── skeletons/               # Skeleton Loaders
│   │       └── index.tsx
│   ├── hooks/                       # Custom Hooks
│   │   ├── useDarkMode.ts
│   │   ├── useAdmin.ts
│   │   └── useRealtime.ts
│   ├── lib/                         # Library Config
│   │   ├── supabase.ts              # Browser Client
│   │   └── supabase-server.ts       # Server Client
│   ├── types/                       # TypeScript Types
│   │   └── index.ts
│   ├── utils/                       # Utility Functions
│   │   └── index.ts
│   └── middleware.ts                # Next.js Middleware
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql   # Database Schema
├── public/
│   └── images/                      # Static Images
├── package.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
├── tsconfig.json
├── .env.example
├── .env.local
└── README.md
```

## 🚀 Step-by-Step Setup

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/username/game-topup-neo-brutalism.git
cd game-topup-neo-brutalism

# Install dependencies
npm install
```

### 2. Setup Supabase

1. Buka [supabase.com](https://supabase.com) dan buat project baru
2. Copy **Project URL** dan **Anon Key** dari Project Settings > API
3. Copy **Service Role Key** (jangan share ke publik!)
4. Buka SQL Editor di Supabase Dashboard
5. Jalankan query dari file `supabase/migrations/001_initial_schema.sql`
6. Enable Realtime untuk table `transactions`:
   - Database > Replication > Tables
   - Toggle `transactions` ke ON

### 3. Setup Environment Variables

```bash
# Copy file environment
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin
ADMIN_PASSWORD=your-secure-admin-password

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Jalankan Project Local

```bash
# Development mode
npm run dev

# Buka http://localhost:3000
```

### 5. Build Production

```bash
# Build untuk production
npm run build

# Start production server
npm start
```

## 🌐 Deploy ke Vercel

### 1. Connect GitHub ke Vercel

1. Push project ke GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/game-topup-neo-brutalism.git
git push -u origin main
```

2. Buka [vercel.com](https://vercel.com) dan login
3. Klik **"Add New Project"**
4. Pilih repository GitHub yang sudah di-push
5. Klik **"Import"**

### 2. Konfigurasi Environment Variables di Vercel

1. Di Vercel Dashboard, masuk ke **Settings > Environment Variables**
2. Tambahkan semua variable dari `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_APP_URL` (isi dengan domain Vercel, contoh: `https://gametop.vercel.app`)

3. Klik **"Deploy"**

### 3. Setup Custom Domain (Opsional)

1. Di Vercel Dashboard, masuk ke **Domains**
2. Tambahkan domain custom Anda
3. Ikuti instruksi DNS dari Vercel

## 🗄️ Database Schema

### Tables

| Table | Deskripsi |
|-------|-----------|
| `games` | Data game yang tersedia |
| `products` | Paket top up per game |
| `transactions` | Data transaksi pembelian |
| `payment_methods` | Metode pembayaran |
| `promos` | Banner promo dan diskon |
| `admins` | Data admin (opsional) |

### Row Level Security (RLS)

- **games**: Public read
- **products**: Public read (active only)
- **payment_methods**: Public read (active only)
- **transactions**: Public insert, read by invoice_id
- **promos**: Public read (active only)

## 🎨 Desain System

### Neo Brutalism
- **Border**: 2px solid black (dark mode: gray)
- **Shadow**: 4px 4px 0px 0px #000 (offset hard shadow)
- **Radius**: 6px (rounded kecil)
- **Font**: Inter, bold weight
- **No blue tap highlight** pada mobile

### Warna Tema Terang
- Background: `#FAFAFA`
- Card: `#FFFFFF`
- Aksen: `#FFD700` (Kuning)
- Border: `#000000`

### Warna Tema Gelap
- Background: `#0a0a0a`
- Card: `#1a1a1a`
- Aksen: `#8B5CF6` (Ungu)
- Border: `#333333`

## 🔧 Customization

### Menambah Game Baru
1. Insert ke table `games` di Supabase
2. Tambahkan products di table `products`
3. Upload banner ke Supabase Storage (bucket `banners`)

### Menambah Metode Pembayaran
1. Insert ke table `payment_methods`
2. Tambahkan logo di `public/images/`
3. Update komponen `PaymentMethodSelector`

### Mengganti API Check Username
Edit file `src/app/api/check-username/route.ts`:
```typescript
// Ganti mock data dengan API provider sesungguhnya
const response = await fetch(`https://api.provider.com/check?userId=${userId}&game=${gameSlug}`);
const data = await response.json();
return NextResponse.json({ success: true, username: data.username });
```

## 📱 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 768px | 2 columns, BottomNav |
| Tablet | 768px - 1024px | 3 columns, Header nav |
| Desktop | > 1024px | 4 columns, Header nav |

## 🔒 Keamanan

- Admin session menggunakan HTTP-only cookie
- RLS di Supabase membatasi akses data
- Service Role Key hanya digunakan di Server Actions/API
- Tidak ada data sensitif di client-side

## 📝 Changelog

### v1.0.0
- Initial release
- Neo Brutalism design
- Full top up flow
- Admin dashboard
- Supabase integration
- Realtime updates

## 🤝 Kontribusi

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/nama-fitur`)
3. Commit perubahan (`git commit -m 'Add: nama fitur'`)
4. Push ke branch (`git push origin feature/nama-fitur`)
5. Buat Pull Request

## 📄 License

MIT License - bebas digunakan untuk personal maupun komersial.

---

**Dibuat dengan ❤️ menggunakan Next.js + Supabase + Tailwind CSS**

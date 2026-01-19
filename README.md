# SIMLAB2 - Sistem Manajemen Laboratorium

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Laravel](https://img.shields.io/badge/Laravel-10.10-red.svg)
![React](https://img.shields.io/badge/React-19.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Sistem Informasi Manajemen Laboratorium untuk Institusi Pendidikan**

[Teknologi](#teknologi-stack) • [Instalasi](#instalasi)

</div>

---

## Deskripsi

SIMLAB2 adalah sistem manajemen laboratorium berbasis web yang dirancang untuk mengelola seluruh kegiatan laboratorium di institusi pendidikan. Sistem ini menyediakan solusi lengkap untuk:

- **Peminjaman** ruang dan peralatan laboratorium dengan workflow approval bertingkat
- **Penjadwalan praktikum** dengan tracking sesi dan modul pembelajaran
- **Manajemen inventaris** peralatan dan bahan laboratorium
- **Manajemen pengguna** dengan 9 tingkat role berbeda
- **Pelaporan** dan monitoring aktivitas laboratorium
- **Publikasi** kegiatan yang ada dalam laboratorium dalam bentuk artikel

Sistem ini dibangun dengan arsitektur modern menggunakan **Laravel 10** untuk backend API dan **React 19** dengan **TypeScript** untuk frontend, menerapkan prinsip **Domain-Driven Design (DDD)** untuk kemudahan maintenance dan skalabilitas.

## Teknologi Stack

### Backend (back-simlab)

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Laravel** | 10.10 | PHP Framework untuk RESTful API |
| **PHP** | ^8.1 | Backend language |
| **Laravel Sanctum** | ^3.3 | API token authentication |
| **MySQL** | - | Primary database |
| **Guzzle HTTP** | ^7.2 | HTTP client |

---

### Frontend (front-simlab)

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **React** | 19.0.0 | UI Library |
| **TypeScript** | 5.7.2 | Type-safe development |
| **Vite** | 6.3.1 | Build tool & dev server |
| **React Router** | 7.6.0 | Client-side routing |
| **Tailwind CSS** | 4.1.5 | Utility-first CSS |
| **Radix UI** | - | Accessible component primitives |
| **shadcn/ui** | - | Pre-built UI components |
| **Lucide React** | 0.525.0 | Icon library |
| **GSAP** | 2.1.2 | Animation library |
| **TanStack Table** | 8.21.3 | Advanced data tables |
| **date-fns** | 4.1.0 | Date utilities |
| **Sonner** | 2.0.6 | Toast notifications |
| **SweetAlert2** | 11.21.0 | Modal alerts |

## Struktur Proyek

```
simlab2/
│
├── back-simlab/                      # Backend Laravel API
│   ├── app/
│   │   ├── Console/                  
│   │   ├── Exceptions/               
│   │   ├── Http/
│   │   │   ├── Controllers/Api/      
│   │   │   ├── Middleware/          
│   │   │   ├── Requests/             
│   │   │   └── Resources/            
│   │   ├── Mail/                     
│   │   ├── Models/                   
│   │   └── Providers/
│   ├── config/                       
│   ├── database/
│   │   ├── migrations/               
│   │   ├── factories/
│   │   └── seeders/
│   ├── routes/
│   │   ├── api.php                   
│   │   └── web.php
│   ├── resources/                    
│   ├── storage/                      
│   ├── tests/                        
│   ├── .env.example
│   ├── composer.json
│   └── artisan
│
└── front-simlab/                     # Frontend React App
    ├── src/
    │   ├── domain/                   # Domain layer 
    │   │   ├── booking/
    │   │   ├── laboratory-equipment/
    │   │   ├── laboratory-room/
    │   │   ├── practicum-scheduling/
    │   │   ├── User/
    │   │   └── ...
    │   ├── application/              # Application layer
    │   │   ├── services/
    │   │   ├── dtos/
    │   │   ├── contexts/
    │   │   └── hooks/
    │   ├── infrastructure/           # Infrastructure layer
    │   │   ├── repositories/
    │   │   ├── ApiClient.ts
    │   │   └── StorageManager.ts
    │   ├── presentation/             # Presentation layer
    │   │   ├── components/
    │   │   │   ├── ui/               
    │   │   │   └── custom/
    │   │   ├── pages/
    │   │   │   ├── admin/
    │   │   │   ├── landing/
    │   │   │   └── report/
    │   │   ├── layouts/
    │   │   ├── hooks/
    │   │   └── utils/
    │   ├── shared/                   
    │   ├── assets/                   
    │   ├── Router.tsx                
    │   ├── App.tsx
    │   └── main.tsx
    ├── public/
    ├── .env.example
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── tailwind.config.ts
```

---

## Instalasi

### Prerequisites

Pastikan sistem Anda memiliki:
- **PHP** >= 8.1
- **Composer** >= 2.x
- **Node.js** >= 18.x
- **npm** atau **yarn**
- **MySQL** >= 8.0
- **Git**

---

### 1. Clone Repository

```bash
git clone <repository-url>
cd simlab2
```

---

### 2. Setup Backend (back-simlab)

```bash
# Masuk ke folder backend
cd back-simlab

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Konfigurasi database di .env
# DB_DATABASE=simlab2
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# (Optional) Seed data
php artisan db:seed

# Generate Sanctum secret key
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Start development server
php artisan serve
# Backend akan running di http://localhost:8000
```

**Konfigurasi Email (untuk notifikasi):**

Edit `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="simlab@example.com"
```

---

### 3. Setup Frontend (front-simlab)

```bash
# Masuk ke folder frontend
cd ../front-simlab

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Konfigurasi backend URL di .env
# VITE_REACT_APP_BACKEND_URL=http://localhost:8000

# Start development server
npm run dev
# Frontend akan running di http://localhost:5173
```

---

## Roadmap

- [ ] Mobile application (React Native)
- [ ] Real-time notifications (WebSocket)
- [ ] Advanced reporting & analytics
- [ ] Integration dengan sistem akademik
- [ ] QR Code untuk peminjaman peralatan
- [ ] Export laporan ke berbagai format
- [ ] Multi-language support
- [ ] Dashboard analytics dengan charts
- [ ] Notification push untuk mobile

<div align="center">

**⭐ Star repository ini jika bermanfaat!**

Made with ❤️ for Education

</div>

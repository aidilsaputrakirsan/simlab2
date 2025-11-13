# SIMLAB2 - Sistem Manajemen Laboratorium

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Laravel](https://img.shields.io/badge/Laravel-10.10-red.svg)
![React](https://img.shields.io/badge/React-19.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Sistem Informasi Manajemen Laboratorium untuk Institusi Pendidikan**

[Fitur](#-fitur-utama) • [Teknologi](#-teknologi-stack) • [Instalasi](#-instalasi) • [Dokumentasi](#-dokumentasi)

</div>

---

## 📋 Deskripsi

SIMLAB2 adalah sistem manajemen laboratorium berbasis web yang dirancang untuk mengelola seluruh kegiatan laboratorium di institusi pendidikan. Sistem ini menyediakan solusi lengkap untuk:

- **Peminjaman** ruang dan peralatan laboratorium dengan workflow approval bertingkat
- **Penjadwalan praktikum** dengan tracking sesi dan modul pembelajaran
- **Manajemen inventaris** peralatan dan bahan laboratorium
- **Manajemen pengguna** dengan 9 tingkat role berbeda
- **Pelaporan** dan monitoring aktivitas laboratorium

Sistem ini dibangun dengan arsitektur modern menggunakan **Laravel 10** untuk backend API dan **React 19** dengan **TypeScript** untuk frontend, menerapkan prinsip **Domain-Driven Design (DDD)** untuk kemudahan maintenance dan skalabilitas.

---

## 🚀 Fitur Utama

### 1. **Sistem Peminjaman (Booking)**
- Peminjaman ruangan, peralatan, atau kombinasi keduanya
- Multi-step approval workflow
- Status tracking: Draft → Pending → Approved/Rejected/Revision → Returned
- Notifikasi email otomatis ke peminjam dan approver
- Verifikasi pengembalian oleh laboran
- Support untuk mahasiswa, dosen, dan pihak eksternal

### 2. **Penjadwalan Praktikum**
- Penjadwalan praktikum per semester/tahun akademik
- Manajemen modul dan sesi praktikum
- Tracking kehadiran dan catatan dosen
- Alokasi peralatan dan bahan per praktikum
- Approval workflow untuk jadwal praktikum
- Integrasi dengan struktur akademik (fakultas, jurusan, prodi)

### 3. **Manajemen Laboratorium**
- Inventaris ruang laboratorium dengan kapasitas dan harga
- Katalog peralatan dengan tracking ketersediaan
- Manajemen bahan laboratorium
- Pencatatan peralatan sementara
- Relasi ruangan dengan peralatan/bahan yang tersedia

### 4. **Manajemen Akademik**
- Struktur organisasi: Fakultas → Jurusan → Program Studi
- Manajemen tahun akademik (aktif/non-aktif)
- Jenis pengujian laboratorium
- Daftar praktikum dan modul pembelajaran
- Integrasi dengan institusi mitra

### 5. **Sistem Role-Based Access Control (RBAC)**

9 Role dengan permission berbeda:
- **Admin**: Full access ke seluruh sistem
- **Laboran**: Verifikasi peminjaman dan maintenance peralatan
- **Kepala Lab Terpadu**: Approval peminjaman dan jadwal praktikum
- **Kepala Lab Jurusan**: Approval jadwal praktikum per jurusan
- **Dosen**: Membuat jadwal praktikum dan peminjaman
- **Koorprodi**: Koordinasi program studi
- **Mahasiswa**: Request peminjaman dan lihat jadwal praktikum
- **Pihak Luar**: Request peminjaman dari eksternal
- **Admin Keuangan**: Manajemen pembayaran

### 6. **Pelaporan & Monitoring**
- Laporan peminjaman dengan filter
- Export data ke Excel/PDF
- Dashboard aktivitas laboratorium
- Tracking approval workflow
- Riwayat peminjaman dan praktikum

### 7. **Notifikasi Email**
- Notifikasi peminjaman ke user
- Notifikasi approval ke kepala lab dan laboran
- Notifikasi rejection
- Notifikasi ke supervisor/dosen pembimbing

---

## 🛠 Teknologi Stack

### Backend (back-simlab/)

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Laravel** | 10.10 | PHP Framework untuk RESTful API |
| **PHP** | ^8.1 | Backend language |
| **Laravel Sanctum** | ^3.3 | API token authentication |
| **MySQL** | - | Primary database |
| **Guzzle HTTP** | ^7.2 | HTTP client |
| **PHPUnit** | ^10.1 | Unit testing |
| **Vite** | - | Asset bundling |
| **Mailpit** | - | Email testing (dev) |

**Arsitektur Backend:**
- RESTful API architecture
- MVC pattern dengan API Resource
- Form Request Validation
- Eloquent ORM
- Role-based middleware
- Multi-step approval workflow
- Email notification system
- Migration-based database schema

**Database:** 29 tabel dengan relasi kompleks, foreign key constraints, dan cascade delete

---

### Frontend (front-simlab/)

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

**Arsitektur Frontend:**
- **Domain-Driven Design (DDD)** dengan 4 layer:
  - **Domain Layer**: Entities, Value Objects, Interfaces
  - **Application Layer**: Services, DTOs, Use Cases
  - **Infrastructure Layer**: API Clients, Repositories
  - **Presentation Layer**: Pages, Components, Hooks
- Context API untuk state management
- Repository pattern untuk data access
- Service layer untuk business logic
- Protected routes dengan RBAC
- Dependency injection via Context

**Statistics:**
- 403 TypeScript/TSX files
- 138 directories
- 25+ UI components
- 13+ service classes
- 15+ feature modules

---

## 📁 Struktur Proyek

```
simlab2/
│
├── back-simlab/                      # Backend Laravel API
│   ├── app/
│   │   ├── Console/                  # Artisan commands
│   │   ├── Exceptions/               # Custom exceptions
│   │   ├── Http/
│   │   │   ├── Controllers/Api/      # 15 API controllers
│   │   │   ├── Middleware/           # RoleMiddleware
│   │   │   ├── Requests/             # Form validations
│   │   │   └── Resources/            # API transformers
│   │   ├── Mail/                     # 5 email classes
│   │   ├── Models/                   # 30 Eloquent models
│   │   └── Providers/
│   ├── config/                       # Configuration files
│   ├── database/
│   │   ├── migrations/               # 29 schema migrations
│   │   ├── factories/
│   │   └── seeders/
│   ├── routes/
│   │   ├── api.php                   # Main API routes
│   │   └── web.php
│   ├── resources/                    # Views & assets
│   ├── storage/                      # File storage
│   ├── tests/                        # PHPUnit tests
│   ├── .env.example
│   ├── composer.json
│   └── artisan
│
└── front-simlab/                     # Frontend React App
    ├── src/
    │   ├── domain/                   # Domain layer (18 subdirs)
    │   │   ├── booking/
    │   │   ├── laboratory-equipment/
    │   │   ├── laboratory-room/
    │   │   ├── practicum-scheduling/
    │   │   ├── User/
    │   │   └── ...
    │   ├── application/              # Application layer (21 subdirs)
    │   │   ├── services/
    │   │   ├── dtos/
    │   │   ├── contexts/
    │   │   └── hooks/
    │   ├── infrastructure/           # Infrastructure layer (17 subdirs)
    │   │   ├── repositories/
    │   │   ├── ApiClient.ts
    │   │   └── StorageManager.ts
    │   ├── presentation/             # Presentation layer
    │   │   ├── components/
    │   │   │   ├── ui/               # 25+ shadcn components
    │   │   │   └── custom/
    │   │   ├── pages/
    │   │   │   ├── admin/
    │   │   │   ├── landing/
    │   │   │   └── report/
    │   │   ├── layouts/
    │   │   ├── hooks/
    │   │   └── utils/
    │   ├── shared/                   # Shared utilities
    │   ├── assets/                   # Static assets
    │   ├── Router.tsx                # Route configuration
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

## 🔧 Instalasi

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

### 4. Akses Aplikasi

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Mailpit** (Email testing): http://localhost:8025

---

## 🔑 API Endpoints

### Authentication
```
POST   /api/register          - User registration
POST   /api/login             - User login
GET    /api/user/me           - Get current user
POST   /api/logout            - Logout
```

### Booking/Peminjaman
```
GET    /api/bookings                          - List bookings
POST   /api/bookings                          - Create booking
GET    /api/bookings/have-draft               - Check draft
GET    /api/bookings/{id}/detail              - Booking detail
POST   /api/bookings/{id}/equipment-material  - Add items
POST   /api/bookings/{id}/verify              - Verify booking
POST   /api/bookings/{id}/verify-return       - Verify return
GET    /api/bookings/verification             - Pending verifications
```

### Laboratory Resources
```
GET    /api/laboratory-rooms          - List rooms
GET    /api/laboratory-equipments     - List equipment
GET    /api/laboratory-materials      - List materials
```

### Practicum Scheduling
```
GET    /api/practicum-schedule/{id}/detail    - Schedule detail
POST   /api/practicum-schedule                - Create schedule
POST   /api/practicum-schedule/{id}/verify    - Verify schedule
GET    /api/practicum-schedule/my-classes     - Lecturer's classes
```

### Admin Management (Role: admin|laboran)
```
CRUD   /api/academic-years
CRUD   /api/faculties
CRUD   /api/majors
CRUD   /api/study-programs
CRUD   /api/testing-types
CRUD   /api/practicums
CRUD   /api/users
PUT    /api/academic-years/{id}/toggle-status
```

**Full API Documentation**: Lihat `back-simlab/routes/api.php`

---

## 👥 User Roles & Permissions

| Role | Kode | Permissions |
|------|------|-------------|
| **Admin** | `admin` | Full system access |
| **Admin Keuangan** | `admin_keuangan` | Payment management |
| **Kepala Lab Terpadu** | `kepala_lab_terpadu` | Approve bookings & schedules |
| **Kepala Lab Jurusan** | `kepala_lab_jurusan` | Create & approve practicum schedules |
| **Dosen** | `dosen` | Create bookings & schedules, manage classes |
| **Koorprodi** | `koorprodi` | Program coordinator access |
| **Laboran** | `laboran` | Verify bookings, manage equipment |
| **Mahasiswa** | `mahasiswa` | Create bookings, view schedules |
| **Pihak Luar** | `pihak_luar` | External party bookings |

---

## 🗄️ Database Schema

**29 Tabel Utama:**

1. **User Management**: users, password_reset_tokens, personal_access_tokens
2. **Academic Structure**: faculties, majors, study_programs, academic_years, institutions
3. **Laboratory**: laboratory_rooms, laboratory_equipments, laboratory_materials, laboratory_temporary_equipment
4. **Booking**: bookings, booking_equipment, booking_materials, booking_approvals
5. **Practicum**: practicums, practicum_modules, practicum_schedulings, practicum_classes, practicum_sessions, practicum_scheduling_equipment, practicum_scheduling_materials, practicum_approvals
6. **Testing**: testing_types
7. **Payment**: payments, payment_items
8. **System**: failed_jobs, jobs

**Key Relationships:**
- Users → Study Programs, Institutions
- Bookings → Academic Years, Users, Laboratory Resources
- Practicums → Study Programs, Academic Years
- Approvals → Users (multi-level workflow)

---

## 🧪 Development

### Backend Development

```bash
# Run tests
php artisan test

# Code formatting
./vendor/bin/pint

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Create migration
php artisan make:migration create_table_name

# Create model with controller & migration
php artisan make:model ModelName -mcr

# Create form request
php artisan make:request RequestName
```

### Frontend Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

---

## 📦 Build & Deployment

### Backend Production Build

```bash
cd back-simlab

# Optimize configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set APP_ENV=production in .env
# Set APP_DEBUG=false in .env

# Run migrations in production
php artisan migrate --force
```

### Frontend Production Build

```bash
cd front-simlab

# Build static files
npm run build

# Output akan ada di dist/
# Deploy folder dist/ ke web server
```

**Production Environment Variables:**

Backend `.env`:
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
DB_HOST=your-db-host
SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.com
```

Frontend `.env`:
```env
VITE_REACT_APP_BACKEND_URL=https://api.your-domain.com
```

---

## 🔐 Security Features

- **Authentication**: Laravel Sanctum token-based
- **Authorization**: Role-based access control (RBAC)
- **CSRF Protection**: Enabled pada web routes
- **Password Hashing**: Bcrypt
- **SQL Injection**: Protected via Eloquent ORM
- **XSS Protection**: Input sanitization
- **CORS Configuration**: Configurable via cors.php
- **API Rate Limiting**: Configurable throttle
- **Foreign Key Constraints**: Data integrity

---

## 📱 Responsive Design

Frontend fully responsive untuk:
- Desktop (1920px+)
- Laptop (1366px - 1920px)
- Tablet (768px - 1366px)
- Mobile (320px - 768px)

Menggunakan Tailwind CSS mobile-first breakpoints.

---

## 🎨 UI/UX Features

- **Dark Mode**: Toggle light/dark theme
- **Animations**: GSAP untuk smooth transitions
- **Toast Notifications**: Sonner untuk feedback
- **Modal Dialogs**: SweetAlert2 untuk confirmations
- **Data Tables**: TanStack Table dengan sorting, filtering, pagination
- **Form Validation**: Real-time validation feedback
- **Loading States**: Skeleton loaders dan spinners
- **Accessible Components**: Radix UI (WCAG compliant)
- **Icon System**: Lucide React icons

---

## 📊 Workflow Examples

### Workflow Peminjaman (Booking)

```
1. User (Mahasiswa/Dosen/Pihak Luar) membuat booking
   └─> Status: DRAFT

2. User melengkapi data dan submit
   └─> Status: PENDING
   └─> Email ke Kepala Lab Terpadu

3. Kepala Lab Terpadu verifikasi
   ├─> APPROVED: Lanjut ke Laboran
   ├─> REJECTED: Selesai (email notifikasi)
   └─> REVISION: Kembali ke user

4. Laboran verifikasi akhir
   ├─> APPROVED: Ready untuk digunakan
   └─> Status: RETURNED (setelah pengembalian)
```

### Workflow Penjadwalan Praktikum

```
1. Kepala Lab Jurusan membuat jadwal praktikum
   └─> Status: DRAFT

2. Submit jadwal
   └─> Status: PENDING
   └─> Email ke Kepala Lab Terpadu

3. Kepala Lab Terpadu approve
   └─> Status: APPROVED

4. Laboran verifikasi ketersediaan alat/bahan
   └─> Status: APPROVED (final)

5. Dosen dapat manage sesi dan catatan
```

---

## 🧩 Extensibility

### Menambah Role Baru

1. **Backend**: Tambah role di enum UserRole (User model)
2. **Backend**: Update RoleMiddleware untuk permission
3. **Frontend**: Tambah role di domain/User/UserRole.ts
4. **Frontend**: Update protected routes di Router.tsx

### Menambah Fitur Baru

**Backend:**
1. Buat migration: `php artisan make:migration`
2. Buat model: `php artisan make:model ModelName`
3. Buat controller: `php artisan make:controller Api/ControllerName`
4. Tambah routes di `routes/api.php`

**Frontend (DDD Pattern):**
1. **Domain**: Buat entities & interfaces
2. **Infrastructure**: Buat repository implementation
3. **Application**: Buat service class & DTOs
4. **Presentation**: Buat pages & components

---

## 🐛 Troubleshooting

### Backend Issues

**Error: "SQLSTATE[HY000] [2002] Connection refused"**
```bash
# Check MySQL service
sudo service mysql start

# Verify .env database credentials
```

**Error: "Key path does not exist"**
```bash
php artisan key:generate
```

**CORS Error**
```bash
# Update config/cors.php
# Set 'supports_credentials' => true
# Add frontend URL ke 'allowed_origins'
```

### Frontend Issues

**Error: "Cannot find module '@/domain/...'"**
```bash
# Check vite.config.ts alias
# Pastikan @ -> ./src configured
```

**API Connection Error**
```bash
# Check VITE_REACT_APP_BACKEND_URL in .env
# Ensure backend is running
```

**Build Error**
```bash
# Clear node_modules and rebuild
rm -rf node_modules
npm install
npm run build
```

---

## 📝 Testing

### Backend Testing

```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter TestName

# Run with coverage
php artisan test --coverage
```

### Frontend Testing

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

**Coding Standards:**
- Backend: PSR-12 (Laravel Pint)
- Frontend: ESLint configured rules
- TypeScript strict mode
- Meaningful commit messages

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Development Team

**Architecture**: Domain-Driven Design (DDD)
**Backend**: Laravel 10 API
**Frontend**: React 19 + TypeScript
**UI Library**: Radix UI + shadcn/ui

---

## 📞 Support

Untuk pertanyaan dan dukungan:
- **Issues**: Gunakan GitHub Issues
- **Documentation**: Lihat folder `docs/` (jika ada)
- **Email**: admin@simlab.com

---

## 🎯 Roadmap

- [ ] Mobile application (React Native)
- [ ] Real-time notifications (WebSocket)
- [ ] Advanced reporting & analytics
- [ ] Integration dengan sistem akademik
- [ ] QR Code untuk peminjaman peralatan
- [ ] Export laporan ke berbagai format
- [ ] Multi-language support
- [ ] Dashboard analytics dengan charts
- [ ] Notification push untuk mobile

---

## 🙏 Acknowledgments

- Laravel Framework
- React Team
- Radix UI & shadcn/ui
- Tailwind CSS
- Semua open-source contributors

---

<div align="center">

**⭐ Star repository ini jika bermanfaat!**

Made with ❤️ for Education

</div>

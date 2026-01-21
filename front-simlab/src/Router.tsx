import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider } from "./presentation/contexts/AuthContext";
import { Login } from "./presentation/pages/LoginPage";
import AdminLayout from "./presentation/layouts/AdminLayout";
import Dashboard from "./presentation/pages/admin/Dashboard";
import AcademicYearPage from "./presentation/pages/admin/academic-year/AcademicYearPage";
import TestingTypePage from "./presentation/pages/admin/testing-type/TestingTypePage";
import MajorPage from "./presentation/pages/admin/major/MajorPage";
import StudyProgramPage from "./presentation/pages/admin/study-program/StudyProgramPage";
import AdminPage from "./presentation/pages/admin/user/admin/AdminPage";
import LaboranPage from "./presentation/pages/admin/user/laboran/LaboranPage";
import MahasiswaPage from "./presentation/pages/admin/user/mahasiswa/MahasiswaPage";
import PihakLuarPage from "./presentation/pages/admin/user/pihak-luar/PihakLuarPage";
import { RegisterPage } from "./presentation/pages/RegisterPage";
import LaboratoryRoomPage from "./presentation/pages/admin/laboratory-room/LaboratoryRoomPage";
import LaboratoryEquipmentPage from "./presentation/pages/admin/laboratory-equipment/LaboratoryEquipmentPage";
import LaboratoryEquipmentPageLanding from "./presentation/pages/landing/laboratory-equipment/LaboratoryEquipmentPage";
import LaboratoryMaterialPage from "./presentation/pages/admin/laboratory-material/LaboratoryMaterialPage";
import LaboratoryMaterialPageLanding from "./presentation/pages/landing/laboratory-material/LaboratoryMaterialPage";
import KoorprodiPage from "./presentation/pages/admin/user/koorprodi/KoorprodiPage";
import DosenPage from "./presentation/pages/admin/user/dosen/DosenPage";
import { ProtectedRoute } from "./application/routes/ProtectedRoute";
import BookingPage from "./presentation/pages/admin/booking/BookingPage";
import BookingCreatePage from "./presentation/pages/admin/booking/BookingCreatePage";
import BookingManagePage from "./presentation/pages/admin/booking/BookingManagePage";
import { BookingDetailPage } from "./presentation/pages/admin/booking/BookingDetailPage";
import NotFound404Page from "./presentation/pages/errors/NotFound404Page";
import KepalaLabPage from "./presentation/pages/admin/user/kepala-lab/KepalaLabPage";
import BookingVerification from "./presentation/pages/admin/booking/BookingVerification";
import PracticumSchedulingPage from "./presentation/pages/admin/practicum-scheduling/PracticumSchedulingPage";
import PracticumSchedulingCreatePage from "./presentation/pages/admin/practicum-scheduling/PracticumSchedulingCreatePage";
import PracticumSchedulingDetailPage from "./presentation/pages/admin/practicum-scheduling/PracticumSchedulingDetailPage";
import PracticumSchedulingManagePage from "./presentation/pages/admin/practicum-scheduling/PracticumSchedulingManagePage";
import PracticumSchedulingVerification from "./presentation/pages/admin/practicum-scheduling/PracticumSchedulingVerification";
import MainPage from "./presentation/pages/landing/MainPage";
import NewsContent from "./presentation/pages/landing/news/NewsContent";
import FacultyPage from "./presentation/pages/admin/faculty/FacultyPage";
import PracticumPage from "./presentation/pages/admin/practicum/PracticumPage";
import PracticumModulePage from "./presentation/pages/admin/practicum-module/PracticumModulePage";
import NewsPage from "./presentation/pages/landing/news/NewsPage";
import { userRole } from "./domain/User/UserRole";
import KepalaLabJurusanPage from "./presentation/pages/admin/user/kepala-lab-jurusan/KepalaLabJurusanPage";
import { PracticumSchedulingProvider } from "./presentation/pages/admin/practicum-scheduling/context/PracticumSchedulingContext";
import { DepedencyProvider } from "./presentation/contexts/DepedencyProvider";
import { BookingProvider } from "./presentation/pages/admin/booking/context/BookingContext";
import TestingCategoryPage from "./presentation/pages/admin/testing-category/TestingCategoryPage";
import TestingRequestPage from "./presentation/pages/admin/testing-request/TestingRequestPage";
import TestingRequestCreatePage from "./presentation/pages/admin/testing-request/TestingRequestCreatePage";
import TestingRequestVerification from "./presentation/pages/admin/testing-request/TestingRequestVerification";
import TestingRequestDetailPage from "./presentation/pages/admin/testing-request/TestingRequestDetailPage";
import BaseLayout from "./presentation/layouts/BaseLayout";
import InstitutionPage from "./presentation/pages/admin/institution/InstitutionPage";
import AdminPengujianPage from "./presentation/pages/admin/user/admin-pengujian/AdminPengujianPage";
import BookingReportPage from "./presentation/pages/admin/report/BookingReport";
import PublicationCategoryPage from "./presentation/pages/admin/publication-category/PublicationCategoryPage";
import PublicationPage from "./presentation/pages/admin/publication/PublicationPage";
import PublicationFormPage from "./presentation/pages/admin/publication/PublicationFormPage";
import PaymentPage from "./presentation/pages/admin/payment/PaymentPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <BaseLayout />,
        children: [
            {
                path: '',
                element: (
                    <DepedencyProvider>
                        < MainPage />
                    </DepedencyProvider>
                )
            },
            {
                path: 'alat-laboratorium',
                element: (
                    <DepedencyProvider>
                        <LaboratoryEquipmentPageLanding />
                    </DepedencyProvider>
                )
            },
            {
                path: 'bahan-laboratorium',
                element: (
                    <DepedencyProvider>
                        <LaboratoryMaterialPageLanding />
                    </DepedencyProvider>
                )
            },
            {
                path: 'berita',
                element: (
                    <DepedencyProvider>
                        <NewsPage />
                    </DepedencyProvider>
                )
            },
            {
                path: 'berita/:slug',
                element: (
                    <DepedencyProvider>
                        <NewsContent />
                    </DepedencyProvider>
                )
            },
            {
                path: 'login',
                element: (
                    <AuthProvider>
                        <Login />
                    </AuthProvider>
                )
            },
            {
                path: 'register',
                element: (
                    <AuthProvider>
                        <RegisterPage />
                    </AuthProvider>
                )
            },
        ]
    },
    {
        path: '/panel',
        element: (
            <AuthProvider>
                <DepedencyProvider>
                    <AdminLayout />
                </DepedencyProvider>
            </AuthProvider>
        ),
        children: [
            {
                path: '',
                element: (
                    <Dashboard />
                )
            },
            {
                path: 'tahun-akademik',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <AcademicYearPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'institusi',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <InstitutionPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'kategori-pengujian',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <TestingCategoryPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'jenis-pengujian',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <TestingTypePage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'kategori-publikasi',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <PublicationCategoryPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'publikasi',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <PublicationPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'publikasi/create',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <PublicationFormPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'publikasi/:id/edit',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <PublicationFormPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'fakultas',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <FacultyPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'jurusan',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <MajorPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'prodi',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <StudyProgramPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'praktikum',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <PracticumPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'modul-praktikum',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <PracticumModulePage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'ruangan-laboratorium',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin, userRole.Laboran]}>
                        <LaboratoryRoomPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'alat-laboratorium',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin, userRole.Laboran]}>
                        <LaboratoryEquipmentPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'bahan-laboratorium',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin, userRole.Laboran]}>
                        <LaboratoryMaterialPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'admin',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <AdminPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'admin-pengujian',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <AdminPengujianPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'kepala-lab-terpadu',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <KepalaLabPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'koorprodi',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <KoorprodiPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'kepala-lab-jurusan',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <KepalaLabJurusanPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'dosen',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <DosenPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'laboran',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <LaboranPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'mahasiswa',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <MahasiswaPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'pihak-luar',
                element: (
                    <ProtectedRoute allowedRoles={[userRole.Admin]}>
                        <PihakLuarPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'peminjaman',
                children: [
                    {
                        path: '',
                        element: (
                            <ProtectedRoute allowedRoles={[userRole.Dosen, userRole.Mahasiswa, userRole.KepalaLabTerpadu, userRole.Kooprodi, userRole.PihakLuar, userRole.KepalaLabJurusan]}>
                                <BookingProvider>
                                    <BookingPage />
                                </BookingProvider>
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'create',
                        element: (
                            <ProtectedRoute allowedRoles={[userRole.Dosen, userRole.Mahasiswa, userRole.KepalaLabTerpadu, userRole.Kooprodi, userRole.PihakLuar, userRole.KepalaLabJurusan]}>
                                <BookingProvider>
                                    <BookingCreatePage />
                                </BookingProvider>
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: ':id/manage',
                        element: (
                            <ProtectedRoute allowedRoles={[userRole.Dosen, userRole.Mahasiswa, userRole.KepalaLabTerpadu, userRole.Kooprodi, userRole.PihakLuar, userRole.KepalaLabJurusan]}>
                                <BookingProvider>
                                    <BookingManagePage />
                                </BookingProvider>
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: ':id/detail',
                        element: (
                            <ProtectedRoute allowedRoles={[userRole.Admin, userRole.Dosen, userRole.Mahasiswa, userRole.KepalaLabTerpadu, userRole.Laboran, userRole.PihakLuar, userRole.KepalaLabJurusan, userRole.AdminPengujian]}>
                                <BookingProvider>
                                    <BookingDetailPage />
                                </BookingProvider>
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'verif',
                        element: (
                            <ProtectedRoute allowedRoles={[userRole.KepalaLabTerpadu, userRole.Laboran]}>
                                <BookingVerification />
                            </ProtectedRoute>
                        )
                    },
                ],
            },
            {
                path: 'penjadwalan-praktikum',
                children: [
                    {
                        path: '',
                        element: (
                            <ProtectedRoute allowedRoles={[userRole.KepalaLabJurusan, userRole.Dosen]}>
                                <PracticumSchedulingProvider>
                                    <PracticumSchedulingPage />
                                </PracticumSchedulingProvider>
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'create',
                        element: (
                            <ProtectedRoute allowedRoles={[userRole.KepalaLabJurusan, userRole.KepalaLabTerpadu, userRole.Kooprodi]}>
                                <PracticumSchedulingProvider>
                                    <PracticumSchedulingCreatePage />
                                </PracticumSchedulingProvider>
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: ':id/manage',
                        element: (
                            <ProtectedRoute allowedRoles={[userRole.KepalaLabJurusan, userRole.Mahasiswa, userRole.KepalaLabTerpadu, userRole.Kooprodi]}>
                                <PracticumSchedulingProvider>
                                    <PracticumSchedulingManagePage />
                                </PracticumSchedulingProvider>
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: ':id/detail',
                        element: (
                            <ProtectedRoute allowedRoles={[userRole.KepalaLabJurusan, userRole.KepalaLabTerpadu, userRole.Laboran, userRole.Kooprodi, userRole.Dosen, userRole.Admin]}>
                                <PracticumSchedulingDetailPage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'verif',
                        element: (
                            <ProtectedRoute allowedRoles={[userRole.KepalaLabTerpadu, userRole.Laboran]}>
                                <PracticumSchedulingVerification />
                            </ProtectedRoute>
                        )
                    },
                ],
            },
            {
                path: 'pengujian',
                children: [
                    {
                        path: '',
                        element: (
                            <ProtectedRoute allowedRoles={[userRole.Dosen, userRole.Mahasiswa, userRole.KepalaLabTerpadu, userRole.Kooprodi, userRole.PihakLuar, userRole.KepalaLabJurusan]}>
                                <TestingRequestPage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'create',
                        element: (
                            <ProtectedRoute allowedRoles={[userRole.Dosen, userRole.Mahasiswa, userRole.KepalaLabTerpadu, userRole.Kooprodi, userRole.PihakLuar, userRole.KepalaLabJurusan]}>
                                <TestingRequestCreatePage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: ':id/detail',
                        element: (
                            <ProtectedRoute allowedRoles={[userRole.KepalaLabJurusan, userRole.KepalaLabTerpadu, userRole.Laboran, userRole.Mahasiswa, userRole.Dosen, userRole.AdminPengujian, userRole.Kooprodi]}>
                                <TestingRequestDetailPage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'verif',
                        element: (
                            <ProtectedRoute allowedRoles={[userRole.KepalaLabTerpadu, userRole.Laboran]}>
                                <TestingRequestVerification />
                            </ProtectedRoute>
                        )
                    },
                ],
            },
            {
                path: 'pembayaran',
                children: [
                    {
                        path: '',
                        element: (
                            <ProtectedRoute allowedRoles={[userRole.AdminPengujian]}>
                                <PaymentPage />
                            </ProtectedRoute>
                        )
                    },
                ],
            },
            {
                path: 'laporan',
                children: [
                    {
                        path: '',
                        element: (
                            <Navigate to={'/404'} replace />
                        )
                    },
                    {
                        path: 'peminjaman',
                        element: (
                            <ProtectedRoute allowedRoles={[userRole.Admin, userRole.Laboran]}>
                                <BookingReportPage />
                            </ProtectedRoute>
                        )
                    },
                ],
            },
        ]
    },
    {
        path: '*',
        element: (
            <NotFound404Page />
        )
    },
])
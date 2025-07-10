import { createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./application/context/AuthContext";
import { Login } from "./presentation/pages/LoginPage";
import AdminLayout from "./presentation/layouts/AdminLayout";
import Dashboard from "./presentation/pages/admin/Dashboard";
import AcademicYearPage from "./presentation/pages/admin/academic-year/AcademicYearPage";
import TestingTypePage from "./presentation/pages/admin/testing-type/TestingTypePage";
import MajorPage from "./presentation/pages/admin/major/MajorPage";
import StudyProgramPage from "./presentation/pages/admin/study-program/StudyProgramPage";
import PracticalWorkPage from "./presentation/pages/admin/practical-work/PracticalWorkPage";
import AdminPage from "./presentation/pages/admin/user/admin/AdminPage";
import LaboranPage from "./presentation/pages/admin/user/laboran/LaboranPage";
import MahasiswaPage from "./presentation/pages/admin/user/mahasiswa/MahasiswaPage";
import PihakLuarPage from "./presentation/pages/admin/user/pihak-luar/PihakLuarPage";
import { RegisterPage } from "./presentation/pages/RegisterPage";
import LaboratoryRoomPage from "./presentation/pages/admin/laboratory-room/LaboratoryRoomPage";
import LaboratoryEquipmentPage from "./presentation/pages/admin/laboratory-equipment/LaboratoryEquipmentPage";
import LaboratoryMaterialPage from "./presentation/pages/admin/laboratory-material/LaboratoryMaterialPage";
import KoorprodiPage from "./presentation/pages/admin/user/koorprodi/KoorprodiPage";
import DosenPage from "./presentation/pages/admin/user/dosen/DosenPage";
import KepalaLabUnitPage from "./presentation/pages/admin/user/kepala-lab-unit/KepalaLabUnitPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <>Landing Page Disini</>
    },
    {
        path: '/login',
        element: <AuthProvider><Login /></AuthProvider>
    },
    {
        path: '/register',
        element: <AuthProvider><RegisterPage /></AuthProvider>
    },
    {
        path: '/panel',
        element: <AuthProvider><AdminLayout /></AuthProvider>,
        children: [
            {
                path: '',
                element: <Dashboard />
            },
            {
                path: 'tahun-akademik',
                element: <AcademicYearPage />
            },
            {
                path: 'jenis-pengujian',
                element: <TestingTypePage />
            },
            {
                path: 'jurusan',
                element: <MajorPage />
            },
            {
                path: 'prodi',
                element: <StudyProgramPage />
            },
            {
                path: 'praktikum',
                element: <PracticalWorkPage />
            },
            {
                path: 'ruangan-laboratorium',
                element: <LaboratoryRoomPage />
            },
            {
                path: 'alat-laboratorium',
                element: <LaboratoryEquipmentPage />
            },
            {
                path: 'bahan-laboratorium',
                element: <LaboratoryMaterialPage />
            },
            {
                path: 'admin',
                element: <AdminPage />
            },
            {
                path: 'koorprodi',
                element: <KoorprodiPage />
            },
            {
                path: 'kepala-lab-unit',
                element: <KepalaLabUnitPage />
            },
            {
                path: 'dosen',
                element: <DosenPage />
            },
            {
                path: 'laboran',
                element: <LaboranPage />
            },
            {
                path: 'mahasiswa',
                element: <MahasiswaPage />
            },
            {
                path: 'pihak-luar',
                element: <PihakLuarPage />
            }
        ]
    }
])
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import { useRef, useMemo } from "react"
import { useNavigate } from 'react-router-dom';
import Header from '@/presentation/components/Header';
import ItkLogo from '../../assets/itk_logo.png'
import { useAuth } from '@/application/hooks/useAuth';
import { userRole } from '@/domain/User/UserRole';
import { WeeklyScheduleCalendar } from '@/presentation/components/custom/WeeklyScheduleCalendar';
import { useWeeklySchedule } from './dashboard/hooks/useWeeklySchedule';
import { useLaboratoryRoomSelect } from './laboratory-room/hooks/useLaboratoryRoomSelect';
import { AdminPengujianDashboard } from './dashboard/components/AdminPengujianDashboard';

// Roles yang TIDAK boleh melihat dashboard jadwal (tampil logo saja)
const EXCLUDED_ROLES = [
    userRole.Dosen, // Dosen biasa tanpa role tambahan
    userRole.Mahasiswa,
    userRole.PihakLuar
]

const Dashboard = () => {
    const sectionRef = useRef<HTMLDivElement | null>(null)
    const navigate = useNavigate()
    const { user } = useAuth()
    const {
        weeklySchedule,
        isLoading,
        selectedRoomId,
        handleWeekChange,
        handleRoomFilter
    } = useWeeklySchedule()
    const { laboratoryRooms } = useLaboratoryRoomSelect()

    useGSAP(() => {
        if (!sectionRef.current) return

        const tl = gsap.timeline()
        tl.fromTo(sectionRef.current,
            {
                opacity: 0,
                y: 100
            },
            {
                opacity: 1,
                y: 0,
                duration: 1
            },
        )
    }, [])

    // Check if user is Admin Pengujian
    const isAdminPengujian = useMemo(() => {
        return user?.role === userRole.AdminPengujian
    }, [user?.role])

    // Check if user should see the schedule dashboard
    const shouldShowSchedule = useMemo(() => {
        if (!user?.role) return false
        if (isAdminPengujian) return false // Admin Pengujian punya dashboard sendiri
        return !EXCLUDED_ROLES.includes(user.role as userRole)
    }, [user?.role, isAdminPengujian])

    // Room options for filter
    const roomOptions = useMemo(() => {
        return laboratoryRooms.map(room => ({
            id: room.id,
            name: room.name
        }))
    }, [laboratoryRooms])

    // Handle click on empty slot - redirect to scheduling form
    const handleSlotClick = (_date: string, _slotId: number, _roomId: number) => {
        // Only kepala_lab_jurusan can create schedules
        if (user?.role === userRole.KepalaLabJurusan) {
            navigate('/panel/penjadwalan-praktikum/create')
        }
    }

    // Render dashboard content based on role
    const renderDashboardContent = () => {
        // Admin Pengujian - Dashboard khusus pengujian
        if (isAdminPengujian) {
            return <AdminPengujianDashboard />
        }

        // Roles dengan jadwal praktikum
        if (shouldShowSchedule) {
            return (
                <WeeklyScheduleCalendar
                    data={weeklySchedule}
                    isLoading={isLoading}
                    onWeekChange={handleWeekChange}
                    onRoomFilter={handleRoomFilter}
                    selectedRoomId={selectedRoomId}
                    roomOptions={roomOptions}
                    onSlotClick={handleSlotClick}
                />
            )
        }

        // Default - Logo ITK
        return (
            <div className="flex flex-1 flex-col items-center justify-center">
                <img src={ItkLogo} className='h-[60vh] w-auto' alt="ITK Logo" />
            </div>
        )
    }

    return (
        <>
            <Header title='Dashboard'/>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                {renderDashboardContent()}
            </div>
        </>
    )
}

export default Dashboard

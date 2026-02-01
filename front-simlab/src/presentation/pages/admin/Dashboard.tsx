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

// Roles yang TIDAK boleh melihat dashboard jadwal
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

    // Check if user should see the schedule dashboard
    const shouldShowSchedule = useMemo(() => {
        if (!user?.role) return false
        return !EXCLUDED_ROLES.includes(user.role as userRole)
    }, [user?.role])

    // Room options for filter
    const roomOptions = useMemo(() => {
        return laboratoryRooms.map(room => ({
            id: room.id,
            name: room.name
        }))
    }, [laboratoryRooms])

    // Handle click on empty slot - redirect to scheduling form
    const handleSlotClick = (date: string, slotId: number, roomId: number) => {
        // Only kepala_lab_jurusan can create schedules
        if (user?.role === userRole.KepalaLabJurusan) {
            navigate('/panel/penjadwalan-praktikum/create')
        }
    }

    return (
        <>
            <Header title='Dashboard'/>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                {shouldShowSchedule ? (
                    <WeeklyScheduleCalendar
                        data={weeklySchedule}
                        isLoading={isLoading}
                        onWeekChange={handleWeekChange}
                        onRoomFilter={handleRoomFilter}
                        selectedRoomId={selectedRoomId}
                        roomOptions={roomOptions}
                        onSlotClick={handleSlotClick}
                    />
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center">
                        <img src={ItkLogo} className='h-[60vh] w-auto' alt="ITK Logo" />
                    </div>
                )}
            </div>
        </>
    )
}

export default Dashboard

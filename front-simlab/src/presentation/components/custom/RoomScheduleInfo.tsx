import { RoomScheduleData, RoomScheduleSession } from "@/domain/laboratory-room/RoomSchedule"
import { Badge } from "@/presentation/components/ui/badge"
import { AlertCircle, Calendar, Clock, Loader2 } from "lucide-react"
import { useMemo } from "react"

// Definisi sesi praktikum (sama dengan datetime-picker.tsx)
const PRACTICUM_SESSIONS = [
    { id: '1', label: 'Sesi 1', startTime: '07:30', endTime: '10:00' },
    { id: '2', label: 'Sesi 2', startTime: '10:20', endTime: '12:00' },
    { id: '3', label: 'Sesi 3', startTime: '13:00', endTime: '15:30' },
    { id: '4', label: 'Sesi 4', startTime: '15:50', endTime: '17:30' },
]

interface RoomScheduleInfoProps {
    roomSchedules: RoomScheduleData | null
    isLoading: boolean
}

// Helper function to detect which session a schedule belongs to
const detectSessionLabel = (startTime: string, endTime: string): string => {
    const session = PRACTICUM_SESSIONS.find(s => s.startTime === startTime && s.endTime === endTime)
    return session?.label || `${startTime} - ${endTime}`
}

// Group sessions by date
const groupSessionsByDate = (sessions: RoomScheduleSession[]): Record<string, RoomScheduleSession[]> => {
    return sessions.reduce((acc, session) => {
        const date = session.date
        if (!acc[date]) {
            acc[date] = []
        }
        acc[date].push(session)
        return acc
    }, {} as Record<string, RoomScheduleSession[]>)
}

// Format date to Indonesian locale
const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

export const RoomScheduleInfo: React.FC<RoomScheduleInfoProps> = ({ roomSchedules, isLoading }) => {
    const groupedSessions = useMemo(() => {
        if (!roomSchedules?.sessions) return {}
        return groupSessionsByDate(roomSchedules.sessions)
    }, [roomSchedules])

    const sortedDates = useMemo(() => {
        return Object.keys(groupedSessions).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    }, [groupedSessions])

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Memuat jadwal ruangan...</span>
            </div>
        )
    }

    if (!roomSchedules) {
        return null
    }

    if (roomSchedules.sessions.length === 0) {
        return (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700 dark:text-green-400">
                    Ruangan <strong>{roomSchedules.room.name}</strong> belum memiliki jadwal. Semua sesi tersedia.
                </span>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                    Jadwal yang sudah terpakai di {roomSchedules.room.name}:
                </span>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-3">
                {sortedDates.map((date) => (
                    <div key={date} className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-amber-800 dark:text-amber-300">
                            <Calendar className="h-3 w-3" />
                            {formatDate(date)}
                        </div>
                        <div className="flex flex-wrap gap-2 pl-5">
                            {groupedSessions[date].map((session) => (
                                <div
                                    key={session.id}
                                    className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 rounded text-xs"
                                >
                                    <Clock className="h-3 w-3 text-amber-600" />
                                    <span className="font-medium">{detectSessionLabel(session.startTime, session.endTime)}</span>
                                    <span className="text-muted-foreground">-</span>
                                    <span className="text-muted-foreground truncate max-w-32" title={`${session.practicumName} - ${session.className}`}>
                                        {session.practicumName} ({session.className})
                                    </span>
                                    <Badge variant={session.status === 'approved' ? 'success' : 'warning'} className="text-[10px] px-1 py-0">
                                        {session.status === 'approved' ? 'Approved' : 'Pending'}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                Pilih tanggal dan sesi yang tidak bertabrakan dengan jadwal di atas.
            </p>
        </div>
    )
}

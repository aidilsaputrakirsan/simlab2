import { WeeklyScheduleData, ScheduleSlot } from "@/domain/dashboard/WeeklySchedule"
import { Badge } from "@/presentation/components/ui/badge"
import { Button } from "@/presentation/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/presentation/components/ui/popover"
import { Combobox } from "@/presentation/components/custom/combobox"
import { cn } from "@/presentation/lib/utils"
import { ChevronLeft, ChevronRight, Calendar, Clock, User, BookOpen, Loader2 } from "lucide-react"
import { useMemo } from "react"

interface WeeklyScheduleCalendarProps {
    data: WeeklyScheduleData | null
    isLoading: boolean
    onWeekChange: (weekStart: string) => void
    onRoomFilter: (roomId: number | null) => void
    selectedRoomId: number | null
    roomOptions: { id: number; name: string }[]
    onSlotClick?: (date: string, slotId: number, roomId: number) => void
}

const SlotCell: React.FC<{
    slot: ScheduleSlot | null
    date: string
    slotId: number
    roomId: number
    onSlotClick?: (date: string, slotId: number, roomId: number) => void
}> = ({ slot, date, slotId, roomId, onSlotClick }) => {
    if (!slot) {
        return (
            <button
                onClick={() => onSlotClick?.(date, slotId, roomId)}
                className="w-full h-full min-h-[60px] bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded text-xs text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors flex items-center justify-center"
            >
                Tersedia
            </button>
        )
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className={cn(
                        "w-full h-full min-h-[60px] rounded text-xs p-1 text-left transition-colors flex flex-col justify-center",
                        slot.status === 'approved'
                            ? "bg-blue-100 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-900/50"
                            : "bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-900/50"
                    )}
                >
                    <span className="font-medium truncate text-gray-800 dark:text-gray-200">{slot.practicumName}</span>
                    <span className="text-gray-500 dark:text-gray-400 truncate">Kelas {slot.className}</span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-3" align="start">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{slot.practicumName}</span>
                        <Badge variant={slot.status === 'approved' ? 'success' : 'warning'} className="text-[10px]">
                            {slot.status === 'approved' ? 'Approved' : 'Pending'}
                        </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-3 w-3" />
                            <span>Kelas {slot.className}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            <span>{slot.lecturerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>{slot.startTime} - {slot.endTime}</span>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export const WeeklyScheduleCalendar: React.FC<WeeklyScheduleCalendarProps> = ({
    data,
    isLoading,
    onWeekChange,
    onRoomFilter,
    selectedRoomId,
    roomOptions,
    onSlotClick
}) => {
    const handlePrevWeek = () => {
        if (!data) return
        const prevWeek = new Date(data.weekStart)
        prevWeek.setDate(prevWeek.getDate() - 7)
        onWeekChange(prevWeek.toISOString().split('T')[0])
    }

    const handleNextWeek = () => {
        if (!data) return
        const nextWeek = new Date(data.weekStart)
        nextWeek.setDate(nextWeek.getDate() + 7)
        onWeekChange(nextWeek.toISOString().split('T')[0])
    }

    const handleThisWeek = () => {
        const today = new Date()
        const dayOfWeek = today.getDay()
        const monday = new Date(today)
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
        onWeekChange(monday.toISOString().split('T')[0])
    }

    const formatWeekRange = useMemo(() => {
        if (!data) return ''
        const start = new Date(data.weekStart)
        const end = new Date(data.weekEnd)
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
        return `${start.toLocaleDateString('id-ID', options)} - ${end.toLocaleDateString('id-ID', options)}`
    }, [data])

    const roomSelectOptions = useMemo(() => {
        return [
            { id: 0, name: 'Semua Ruangan' },
            ...roomOptions
        ]
    }, [roomOptions])

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    if (!data) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-20 text-muted-foreground">
                    Gagal memuat jadwal
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Jadwal Praktikum Mingguan
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={handlePrevWeek}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleThisWeek}>
                                Minggu Ini
                            </Button>
                            <Button variant="outline" size="icon" onClick={handleNextWeek}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-muted-foreground">{formatWeekRange}</p>
                        <Combobox
                            options={roomSelectOptions}
                            value={selectedRoomId?.toString() || '0'}
                            onChange={(val) => onRoomFilter(val === '0' ? null : Number(val))}
                            placeholder="Filter Ruangan"
                            optionLabelKey="name"
                            optionValueKey="id"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <div className="min-w-[800px]">
                    {/* Header - Days */}
                    <div className="grid grid-cols-[120px_repeat(7,1fr)] gap-1 mb-2">
                        <div className="text-xs font-medium text-muted-foreground p-2">Ruangan</div>
                        {data.dates.map((dateInfo) => (
                            <div
                                key={dateInfo.date}
                                className={cn(
                                    "text-center p-2 rounded text-xs",
                                    dateInfo.isToday
                                        ? "bg-primary text-primary-foreground font-bold"
                                        : "bg-muted font-medium"
                                )}
                            >
                                <div>{dateInfo.dayShort}</div>
                                <div className="text-[10px] opacity-80">
                                    {new Date(dateInfo.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Rooms */}
                    {data.rooms.map((room) => (
                        <div key={room.roomId} className="mb-4">
                            {/* Room Name */}
                            <div className="grid grid-cols-[120px_repeat(7,1fr)] gap-1 mb-1">
                                <div className="text-xs font-semibold p-2 bg-primary text-primary-foreground rounded flex items-center">
                                    {room.roomName}
                                </div>
                                {data.dates.map((dateInfo) => (
                                    <div key={dateInfo.date} className="text-[10px] text-center text-muted-foreground">
                                        {/* Placeholder for alignment */}
                                    </div>
                                ))}
                            </div>

                            {/* Sessions per time slot */}
                            {data.timeSlots.map((slot) => (
                                <div key={slot.id} className="grid grid-cols-[120px_repeat(7,1fr)] gap-1 mb-1">
                                    <div className="text-[10px] p-2 bg-muted/50 rounded flex flex-col justify-center">
                                        <span className="font-medium">{slot.label}</span>
                                        <span className="text-muted-foreground">{slot.start}-{slot.end}</span>
                                    </div>
                                    {data.dates.map((dateInfo) => (
                                        <SlotCell
                                            key={`${dateInfo.date}-${slot.id}`}
                                            slot={room.schedule[dateInfo.date]?.[slot.id] ?? null}
                                            date={dateInfo.date}
                                            slotId={slot.id}
                                            roomId={room.roomId}
                                            onSlotClick={onSlotClick}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t text-xs">
                    <span className="text-muted-foreground">Keterangan:</span>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                        <span>Tersedia</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                        <span>Approved</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-amber-100 border border-amber-300 rounded"></div>
                        <span>Pending</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

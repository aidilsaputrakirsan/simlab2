export interface TimeSlot {
    id: number
    label: string
    start: string
    end: string
}

export interface DateInfo {
    date: string
    dayName: string
    dayShort: string
    isToday: boolean
}

export interface ScheduleSlot {
    sessionId: number
    practicumName: string
    className: string
    lecturerName: string
    status: string
    startTime: string
    endTime: string
}

export interface RoomSchedule {
    roomId: number
    roomName: string
    schedule: Record<string, Record<number, ScheduleSlot | null>> // date -> slotId -> slot
}

export interface WeeklyScheduleData {
    weekStart: string
    weekEnd: string
    dates: DateInfo[]
    timeSlots: TimeSlot[]
    rooms: RoomSchedule[]
}

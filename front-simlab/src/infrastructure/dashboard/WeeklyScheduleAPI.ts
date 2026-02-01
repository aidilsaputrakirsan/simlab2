import {
    WeeklyScheduleData,
    DateInfo,
    TimeSlot,
    RoomSchedule,
    ScheduleSlot
} from "@/domain/dashboard/WeeklySchedule"

export interface TimeSlotAPI {
    id: number
    label: string
    start: string
    end: string
}

export interface DateInfoAPI {
    date: string
    day_name: string
    day_short: string
    is_today: boolean
}

export interface ScheduleSlotAPI {
    session_id: number
    practicum_name: string
    class_name: string
    lecturer_name: string
    status: string
    start_time: string
    end_time: string
}

export interface RoomScheduleAPI {
    room_id: number
    room_name: string
    schedule: Record<string, Record<number, ScheduleSlotAPI | null>>
}

export interface WeeklyScheduleDataAPI {
    week_start: string
    week_end: string
    dates: DateInfoAPI[]
    time_slots: TimeSlotAPI[]
    rooms: RoomScheduleAPI[]
}

export function toDomain(api: WeeklyScheduleDataAPI): WeeklyScheduleData {
    return {
        weekStart: api.week_start,
        weekEnd: api.week_end,
        dates: api.dates.map((d): DateInfo => ({
            date: d.date,
            dayName: d.day_name,
            dayShort: d.day_short,
            isToday: d.is_today,
        })),
        timeSlots: api.time_slots.map((t): TimeSlot => ({
            id: t.id,
            label: t.label,
            start: t.start,
            end: t.end,
        })),
        rooms: api.rooms.map((r): RoomSchedule => ({
            roomId: r.room_id,
            roomName: r.room_name,
            schedule: Object.fromEntries(
                Object.entries(r.schedule).map(([date, slots]) => [
                    date,
                    Object.fromEntries(
                        Object.entries(slots).map(([slotId, slot]) => [
                            Number(slotId),
                            slot ? {
                                sessionId: slot.session_id,
                                practicumName: slot.practicum_name,
                                className: slot.class_name,
                                lecturerName: slot.lecturer_name,
                                status: slot.status,
                                startTime: slot.start_time,
                                endTime: slot.end_time,
                            } : null
                        ])
                    )
                ])
            ),
        })),
    }
}

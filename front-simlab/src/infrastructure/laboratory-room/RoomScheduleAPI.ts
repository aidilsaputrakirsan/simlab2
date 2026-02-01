import { RoomScheduleData, RoomScheduleSession } from "@/domain/laboratory-room/RoomSchedule"

export interface RoomScheduleSessionAPI {
    id: number
    date: string
    start_time: string
    end_time: string
    practicum_name: string
    class_name: string
    status: string
}

export interface RoomScheduleDataAPI {
    room: {
        id: number
        name: string
    }
    sessions: RoomScheduleSessionAPI[]
}

export function toDomain(api: RoomScheduleDataAPI): RoomScheduleData {
    return {
        room: api.room,
        sessions: api.sessions.map((session): RoomScheduleSession => ({
            id: session.id,
            date: session.date,
            startTime: session.start_time,
            endTime: session.end_time,
            practicumName: session.practicum_name,
            className: session.class_name,
            status: session.status,
        }))
    }
}

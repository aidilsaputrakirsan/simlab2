export interface RoomScheduleSession {
    id: number
    date: string
    startTime: string
    endTime: string
    practicumName: string
    className: string
    status: string
}

export interface RoomScheduleData {
    room: {
        id: number
        name: string
    }
    sessions: RoomScheduleSession[]
}

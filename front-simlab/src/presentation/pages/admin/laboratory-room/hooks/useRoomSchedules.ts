import { RoomScheduleData } from "@/domain/laboratory-room/RoomSchedule"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useCallback, useState } from "react"

export const useRoomSchedules = () => {
    const { laboratoryRoomService } = useDepedencies()
    const [roomSchedules, setRoomSchedules] = useState<RoomScheduleData | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetchRoomSchedules = useCallback(async (
        roomId: number,
        params?: {
            start_date?: string
            end_date?: string
            exclude_scheduling_id?: number
        }
    ) => {
        if (!roomId) {
            setRoomSchedules(null)
            return
        }

        setIsLoading(true)
        try {
            const response = await laboratoryRoomService.getScheduledSessions(roomId, params)
            setRoomSchedules(response.data ?? null)
        } catch (error) {
            console.error('Failed to fetch room schedules:', error)
            setRoomSchedules(null)
        } finally {
            setIsLoading(false)
        }
    }, [laboratoryRoomService])

    const clearRoomSchedules = useCallback(() => {
        setRoomSchedules(null)
    }, [])

    return {
        roomSchedules,
        isLoading,
        fetchRoomSchedules,
        clearRoomSchedules
    }
}

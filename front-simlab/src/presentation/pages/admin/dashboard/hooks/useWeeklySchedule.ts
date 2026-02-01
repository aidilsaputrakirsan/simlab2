import { WeeklyScheduleData } from "@/domain/dashboard/WeeklySchedule"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useCallback, useEffect, useState } from "react"

export const useWeeklySchedule = () => {
    const { dashboardService } = useDepedencies()
    const [weeklySchedule, setWeeklySchedule] = useState<WeeklyScheduleData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [weekStart, setWeekStart] = useState<string | undefined>(undefined)
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)

    const fetchWeeklySchedule = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await dashboardService.getWeeklySchedule({
                week_start: weekStart,
                room_id: selectedRoomId ?? undefined
            })
            setWeeklySchedule(response.data ?? null)
        } catch (error) {
            console.error('Failed to fetch weekly schedule:', error)
            setWeeklySchedule(null)
        } finally {
            setIsLoading(false)
        }
    }, [dashboardService, weekStart, selectedRoomId])

    useEffect(() => {
        fetchWeeklySchedule()
    }, [fetchWeeklySchedule])

    const handleWeekChange = useCallback((newWeekStart: string) => {
        setWeekStart(newWeekStart)
    }, [])

    const handleRoomFilter = useCallback((roomId: number | null) => {
        setSelectedRoomId(roomId)
    }, [])

    return {
        weeklySchedule,
        isLoading,
        weekStart,
        selectedRoomId,
        handleWeekChange,
        handleRoomFilter,
        refetch: fetchWeeklySchedule
    }
}

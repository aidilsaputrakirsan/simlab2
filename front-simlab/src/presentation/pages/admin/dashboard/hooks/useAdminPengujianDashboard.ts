import { AdminPengujianDashboardData } from "@/domain/dashboard/AdminPengujianDashboard"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useCallback, useEffect, useState } from "react"

export const useAdminPengujianDashboard = () => {
    const { dashboardService } = useDepedencies()
    const [dashboardData, setDashboardData] = useState<AdminPengujianDashboardData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchDashboard = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await dashboardService.getAdminPengujianDashboard()
            setDashboardData(response.data ?? null)
        } catch (error) {
            console.error('Failed to fetch admin pengujian dashboard:', error)
            setDashboardData(null)
        } finally {
            setIsLoading(false)
        }
    }, [dashboardService])

    useEffect(() => {
        fetchDashboard()
    }, [fetchDashboard])

    return {
        dashboardData,
        isLoading,
        refetch: fetchDashboard
    }
}

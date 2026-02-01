import { DashboardRepository } from "@/infrastructure/dashboard/DashboardRepository"

export class DashboardService {
    private readonly dashboardRepository = new DashboardRepository()

    async getWeeklySchedule(params?: {
        week_start?: string
        room_id?: number
    }) {
        return await this.dashboardRepository.getWeeklySchedule(params)
    }

    async getAdminPengujianDashboard() {
        return await this.dashboardRepository.getAdminPengujianDashboard()
    }
}

import { AdminPengujianDashboardData } from "@/domain/dashboard/AdminPengujianDashboard"
import { WeeklyScheduleData } from "@/domain/dashboard/WeeklySchedule"
import { ApiResponse } from "@/presentation/shared/Types"
import { fetchApi } from "../ApiClient"
import { generateQueryStringFromObject } from "../Helper"
import { WeeklyScheduleDataAPI, toDomain } from "./WeeklyScheduleAPI"

export class DashboardRepository {
    async getWeeklySchedule(params?: {
        week_start?: string
        room_id?: number
    }): Promise<ApiResponse<WeeklyScheduleData>> {
        const queryString = params ? generateQueryStringFromObject(params) : ''
        const response = await fetchApi(`/dashboard/weekly-schedule?${queryString}`, { method: 'GET' })

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as WeeklyScheduleDataAPI

            return {
                ...json,
                data: toDomain(data)
            }
        }
        throw json
    }

    async getAdminPengujianDashboard(): Promise<ApiResponse<AdminPengujianDashboardData>> {
        const response = await fetchApi(`/dashboard/admin-pengujian`, { method: 'GET' })

        const json = await response.json() as ApiResponse
        if (response.ok) {
            return {
                ...json,
                data: json.data as AdminPengujianDashboardData
            }
        }
        throw json
    }
}

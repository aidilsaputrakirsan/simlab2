import { LaboratoryRoomRepository } from "@/infrastructure/laboratory-room/LaboratoryRoomRepository";
import { LaboratoryRoomInputDTO, LaboratoryRoomParam } from "./LaboratoryRoomDTO";
import { ApiResponse, PaginatedResponse } from "@/presentation/shared/Types";
import { LaboratoryRoomView } from "./LaboratoryRoomView";
import { LaboratoryRoomSelectView } from "./LaboratoryRoomSelectView";

export class LaboratoryRoomService {
    private readonly laboratoryRoomRepository = new LaboratoryRoomRepository()

    async getLaboratoryRoomData(params: LaboratoryRoomParam): Promise<PaginatedResponse<LaboratoryRoomView>> {
        const laboratoryRoom = await this.laboratoryRoomRepository.getAll(params)

        return {
            ...laboratoryRoom,
            data: laboratoryRoom.data.map(LaboratoryRoomView.fromDomain)
        }
    }

    async createData(data: LaboratoryRoomInputDTO) {
        return await this.laboratoryRoomRepository.createData(data)
    }

    async updateData(id: number, data: LaboratoryRoomInputDTO) {
        return await this.laboratoryRoomRepository.updateData(id, data)
    }

    async deleteData(id: number) {
        return await this.laboratoryRoomRepository.deleteData(id)
    }

    async getDataForSelect(): Promise<ApiResponse<LaboratoryRoomSelectView[]>> {
        const laboratoryRooms = await this.laboratoryRoomRepository.getDataForSelect()

        return {
            ...laboratoryRooms,
            data: laboratoryRooms.data ? laboratoryRooms.data.map(LaboratoryRoomSelectView.fromDomain) : undefined
        }
    }

    async getScheduledSessions(roomId: number, params?: {
        start_date?: string
        end_date?: string
        exclude_scheduling_id?: number
    }) {
        return await this.laboratoryRoomRepository.getScheduledSessions(roomId, params)
    }
}
import { LaboratoryRoomRepository } from "@/infrastructure/laboratory-room/LaboratoryRoomRepository";
import { LaboratoryRoomInputDTO, LaboratoryRoomParam } from "./dto/LaboratoryRoomDTO";
import { PaginatedResponse } from "@/shared/Types";
import { LaboratoryRoomView } from "./LaboratoryRoomView";

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
}
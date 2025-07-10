import { useCallback, useState } from "react"
import { LaboratoryRoomInputDTO } from "../dto/LaboratoryRoomDTO"
import { LaboratoryRoomService } from "../LaboratoryRoomService"
import { LaboratoryRoomView } from "../LaboratoryRoomView"

export const useLaboratoryRoom = ({
    currentPage,
    perPage,
    searchTerm,
    setTotalPages,
    setTotalItems,
}: {
    currentPage: number
    perPage: number
    searchTerm: string,
    setTotalPages: (v: number) => void
    setTotalItems: (v: number) => void
}) => {
    const [laboratoryRoom, setLaboratoryRoom] = useState<LaboratoryRoomView[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const service = new LaboratoryRoomService()

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await service.getLaboratoryRoomData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
        })
        setLaboratoryRoom(response.data ?? [])
        setTotalPages(response.last_page ?? 0)
        setTotalItems(response.total ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, searchTerm])

    const create = (dto: LaboratoryRoomInputDTO) => service.createData(dto)
    const update = (id: number, dto: LaboratoryRoomInputDTO) => service.updateData(id, dto)
    const remove = (id: number) => service.deleteData(id)

    return {
        laboratoryRoom,
        isLoading,
        getData,
        create,
        update,
        remove
    }
}
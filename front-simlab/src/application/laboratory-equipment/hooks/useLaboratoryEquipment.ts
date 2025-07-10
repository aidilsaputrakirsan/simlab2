import { useCallback, useState } from "react"
import { LaboratoryEquipmentService } from "../LaboratoryEquipmentService"
import { LaboratoryEquipmentInputDTO } from "../dto/LaboratoryEquipmentDTO"
import { LaboratoryEquipmentView } from "../LaboratoryEquipmentView"

export const useLaboratoryEquipment = ({
    currentPage,
    perPage,
    searchTerm,
    setTotalPages,
    setTotalItems,
    filter_laboratory_room
}: {
    currentPage: number
    perPage: number
    searchTerm: string,
    filter_laboratory_room?: number
    setTotalPages: (v: number) => void
    setTotalItems: (v: number) => void
}) => {
    const [laboratoryEquipment, setLaboratoryEquipment] = useState<LaboratoryEquipmentView[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const service = new LaboratoryEquipmentService()

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await service.getLaboratoryEquipmentData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            filter_laboratory_room: filter_laboratory_room
        })
        setLaboratoryEquipment(response.data ?? [])
        setTotalPages(response.last_page ?? 0)
        setTotalItems(response.total ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, searchTerm, filter_laboratory_room])

    const create = (dto: LaboratoryEquipmentInputDTO) => service.createData(dto)
    const update = (id: number, dto: LaboratoryEquipmentInputDTO) => service.updateData(id, dto)
    const remove = (id: number) => service.deleteData(id)

    return {
        laboratoryEquipment,
        isLoading,
        getData,
        create,
        update,
        remove
    }
}
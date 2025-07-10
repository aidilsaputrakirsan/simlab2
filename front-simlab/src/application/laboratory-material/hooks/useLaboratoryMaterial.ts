import { useCallback, useState } from "react"
import { LaboratoryMaterialService } from "../LaboratoryMaterialService"
import { LaboratoryMaterialInputDTO } from "../dto/LaboratoryMaterialDTO"
import { LaboratoryMaterialView } from "../LaboratoryMaterialView"

export const useLaboratoryMaterial = ({
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
    const [laboratoryMaterial, setLaboratoryMaterial] = useState<LaboratoryMaterialView[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const service = new LaboratoryMaterialService()

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await service.getLaboratoryMaterialData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
        })
        setLaboratoryMaterial(response.data ?? [])
        setTotalPages(response.last_page ?? 0)
        setTotalItems(response.total ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, searchTerm])

    const create = (dto: LaboratoryMaterialInputDTO) => service.createData(dto)
    const update = (id: number, dto: LaboratoryMaterialInputDTO) => service.updateData(id, dto)
    const remove = (id: number) => service.deleteData(id)

    return {
        laboratoryMaterial,
        isLoading,
        getData,
        create,
        update,
        remove
    }
}
import { useCallback, useState } from "react"
import { TestingTypeView } from "../TestingTypeView"
import { TestingTypeService } from "../TestingTypeService"
import { TestingTypeInputDTO } from "../dtos/TestingTypeDTO"

export const useTestingType = ({
    currentPage,
    perPage,
    searchTerm,
    setTotalPages,
    setTotalItems,
}: {
    currentPage: number
    perPage: number
    searchTerm: string
    setTotalPages: (v: number) => void
    setTotalItems: (v: number) => void
}) => {
    const [testingType, setTestingType] = useState<TestingTypeView[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const service = new TestingTypeService()

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await service.getTestingTypeData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm
        })
        setTestingType(response.data ?? [])
        setTotalPages(response.last_page ?? 0)
        setTotalItems(response.total ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, searchTerm])

    const create = (dto: TestingTypeInputDTO) => service.createData(dto)
    const update = (id: number, dto: TestingTypeInputDTO) => service.updateData(id, dto)
    const remove = (id: number) => service.deleteData(id)

    return {
        testingType,
        isLoading,
        getData,
        create,
        update,
        remove
    }
}
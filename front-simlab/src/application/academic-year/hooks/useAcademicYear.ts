// application/hooks/useAcademicYear.ts
import { useCallback, useState } from "react"
import { AcademicYearService } from "../AcademicYearService"
import { AcademicYearView } from "../AcademicYearView"
import { AcademicYearInputDTO } from "../dtos/AcademicYearDTO"

export const useAcademicYear = ({
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
    const [academicYear, setAcademicYear] = useState<AcademicYearView[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const service = new AcademicYearService()

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await service.getAcademicYearData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
        })
        setAcademicYear(response.data ?? [])
        setTotalPages(response.last_page ?? 0)
        setTotalItems(response.total ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, searchTerm])

    const create = (dto: AcademicYearInputDTO) => service.createData(dto)
    const update = (id: number, dto: AcademicYearInputDTO) => service.updateData(id, dto)
    const toggleStatus = (id: number) => service.toggleStatus(id)
    const remove = (id: number) => service.deleteData(id)

    return {
        academicYear,
        isLoading,
        getData,
        create,
        update,
        remove,
        toggleStatus,
    }
}

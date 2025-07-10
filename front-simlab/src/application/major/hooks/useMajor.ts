import { useCallback, useState } from "react"
import { MajorView } from "../MajorView"
import { MajorService } from "../MajorService"
import { MajorInputDTO } from "@/application/dto/MajorDTO"

export const useMajor = ({
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
    const [major, setMajor] = useState<MajorView[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const service = new MajorService()

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await service.getMajorData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm
        })
        setMajor(response.data ?? [])
        setTotalPages(response.last_page ?? 0)
        setTotalItems(response.total ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, searchTerm])

    const create = (dto: MajorInputDTO) => service.createData(dto)
    const update = (id: number, dto: MajorInputDTO) => service.updateData(id, dto)
    const remove = (id: number) => service.deleteData(id)

    return {
        major,
        isLoading,
        getData,
        create,
        update,
        remove
    }
}
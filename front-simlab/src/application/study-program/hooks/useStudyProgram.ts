import { useCallback, useState } from "react"
import { StudyProgramView } from "../StudyProgramView"
import { StudyProgramService } from "../StudyProgramService"
import { StudyProgramInputDTO } from "../dto/StudyProgramDTO"

export const useStudyProgram = ({
    currentPage,
    perPage,
    searchTerm,
    setTotalPages,
    setTotalItems,
    filter_major
}: {
    currentPage: number
    perPage: number
    searchTerm: string,
    filter_major?: number
    setTotalPages: (v: number) => void
    setTotalItems: (v: number) => void
}) => {
    const [studyProgram, setStudyProgram] = useState<StudyProgramView[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const service = new StudyProgramService()

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await service.getStudyProgramData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            filter_major: filter_major
        })
        setStudyProgram(response.data ?? [])
        setTotalPages(response.last_page ?? 0)
        setTotalItems(response.total ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, searchTerm, filter_major])

    const create = (dto: StudyProgramInputDTO) => service.createData(dto)
    const update = (id: number, dto: StudyProgramInputDTO) => service.updateData(id, dto)
    const remove = (id: number) => service.deleteData(id)

    return {
        studyProgram,
        isLoading,
        getData,
        create,
        update,
        remove
    }
}
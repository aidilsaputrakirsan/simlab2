import { useCallback, useState } from "react"
import { UserView } from "../UserView"
import { UserService } from "../UserService"
import { Role } from "@/shared/Types"
import { UserInputDTO } from "../dto/UserDTO"

export const useUser = ({
    currentPage,
    perPage,
    searchTerm,
    filter_study_program,
    role,
    setTotalPages,
    setTotalItems,
}: {
    currentPage: number
    perPage: number
    searchTerm: string,
    filter_study_program?: number,
    role: Role,
    setTotalPages: (v: number) => void
    setTotalItems: (v: number) => void
}) => {
    const [user, setUser] = useState<UserView[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const service = new UserService()

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await service.getUserData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            filter_prodi: filter_study_program,
            role: role
        })
        setUser(response.data ?? [])
        setTotalPages(response.last_page ?? 0)
        setTotalItems(response.total ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, searchTerm, filter_study_program, role])

    const create = (dto: UserInputDTO) => service.createData(dto)
    const update = (id: number, dto: UserInputDTO) => service.updateData(id, dto)
    const remove = (id: number) => service.deleteData(id)
    const restoreToDosen = (id: number) => service.restoreToDosen(id)

    return {
        user,
        isLoading,
        getData,
        create,
        update,
        remove,
        restoreToDosen
    }
}
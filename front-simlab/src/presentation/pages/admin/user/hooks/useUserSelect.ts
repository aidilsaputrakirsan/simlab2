import { UserSelectView } from "@/application/user/UserSelectView"
import { userRole } from "@/domain/User/UserRole"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useEffect, useState } from "react"

interface useUserSelectProps {
    roles: userRole | userRole[]
    major_id?: number
}

export const useUserSelect = ({ roles, major_id }: useUserSelectProps) => {
    const { userService } = useDepedencies()
    const [users, setUsers] = useState<UserSelectView[]>([])
    const [selectedUser, setSelectedUser] = useState<number>(0)

    useEffect(() => {
        const getUsers = async () => {
            const response = await userService.getDataForSelect(roles, major_id)
            setUsers(response.data ?? [])
        }

        getUsers()
    }, [userService, major_id])

    return {
        users,
        selectedUser,
        setSelectedUser
    }
}

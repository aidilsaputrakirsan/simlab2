import { useState } from 'react'
import Table from '../../../../components/Table'
import { AdminColumn } from './AdminColumn'
import Header from '@/presentation/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import AdminFormDialog from './components/AdminFormDialog'
import { UserInputDTO } from '@/application/user/UserDTO'
import { toast } from 'sonner'
import { userRole } from '@/domain/User/UserRole'
import { useDepedencies } from '@/presentation/contexts/useDepedencies'
import { useUserDataTable } from '../hooks/useUserDataTable'
import MainContent from '@/presentation/components/MainContent'

const AdminPage = () => {
    const {
        users,
        isLoading,
        searchTerm,
        refresh,

        // TableHandler
        perPage,
        handleSearch,
        handlePageChange,
        handlePerPageChange,
        totalItems,
        totalPages,
        currentPage
    } = useUserDataTable({ filter_study_program: 0, role: userRole.Admin })

    const { userService } = useDepedencies()

    const [isOpen, setIsOpen] = useState(false)
    const [id, setId] = useState<number | null>(null)

    const openModal = (id: number | null = null) => {
        setId(id)
        setIsOpen(true)
    }

    const handleSave = async (formData: UserInputDTO): Promise<void> => {
        if (!id) return;

        const res = await userService.updateData(id, formData)
        toast.success(res.message)
        refresh()
        setIsOpen(false)
    }

    return (
        <>
            <Header title='Menu Admin' />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Admin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={users}
                            columns={AdminColumn({ openModal })}
                            loading={isLoading}
                            searchTerm={searchTerm}
                            handleSearch={(e) => handleSearch(e)}
                            perPage={perPage}
                            handlePerPageChange={(e) => handlePerPageChange(e)}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange}
                            handleRefresh={refresh} />
                    </CardContent>
                </Card>
                <AdminFormDialog
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    data={users}
                    dataId={id}
                    handleSave={handleSave}
                    title={'Edit Data Admin'}
                />
            </MainContent>

        </>
    )
}

export default AdminPage

import { useState } from 'react'
import Table from '../../../../components/Table'
import { LaboranColumn } from './LaboranColumn'
import { toast } from 'sonner'
import { UserInputDTO } from '@/application/user/UserDTO'
import Header from '@/presentation/components/Header'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Button } from '@/presentation/components/ui/button'
import { Plus } from 'lucide-react'
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog'
import LaboranFormDialog from './components/LaboranFormDialog'
import { userRole } from '@/domain/User/UserRole'
import { useUserDataTable } from '../hooks/useUserDataTable'
import { useDepedencies } from '@/presentation/contexts/useDepedencies'
import MainContent from '@/presentation/components/MainContent'
import { UserView } from '@/application/user/UserView'

const LaboranPage = () => {
    const { userService } = useDepedencies()
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
        currentPage,
    } = useUserDataTable({ filter_study_program: 0, role: userRole.Laboran })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedLaboran, setSelectedlaboran] = useState<UserView>()
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)
    const [confirmType, setConfirmType] = useState<"delete" | "status">('delete')

    const isEdit = !!selectedLaboran

    const openAdd = () => {
        setSelectedlaboran(undefined)
        setIsOpen(true)
    }

    const openEdit = (user: UserView) => {
        setSelectedlaboran(user)
        setIsOpen(true)
    }

    const openConfirm = (type: 'delete' | 'status', user: UserView) => {
        setSelectedlaboran(user)
        setConfirmType(type)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: UserInputDTO): Promise<void> => {
        const res = selectedLaboran
            ? await userService.updateData(selectedLaboran.id, formData)
            : await userService.createData(formData)

        toast.success(res.message)
        refresh()
        setIsOpen(false)
    }

    const handleConfirm = async () => {
        if (!selectedLaboran) return
        const res = confirmType === 'delete'
            ? await userService.deleteData(selectedLaboran.id)
            : await userService.toggleManager(selectedLaboran.id)

        toast.success(res.message)
        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title='Menu Laboran' />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Laboran</CardTitle>
                        <CardAction>
                            <Button variant={"default"} onClick={() => openAdd()}>
                                Tambah
                                <Plus />
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={users}
                            columns={LaboranColumn({ openModal: openEdit, openConfirm })}
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
                <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleConfirm} />
                <LaboranFormDialog
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    laboran={selectedLaboran}
                    handleSave={handleSave}
                    title={!isEdit ? 'Tambah Laboran' : 'Edit Laboran'}
                />
            </MainContent>
        </>
    )
}

export default LaboranPage

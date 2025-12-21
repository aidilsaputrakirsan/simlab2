import { useDepedencies } from '@/presentation/contexts/useDepedencies'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import React, { useState } from 'react'
import { useUserDataTable } from '../hooks/useUserDataTable'
import { userRole } from '@/domain/User/UserRole'
import { UserView } from '@/application/user/UserView'
import { toast } from 'sonner'
import { UserInputDTO } from '@/application/user/UserDTO'
import MainContent from '@/presentation/components/MainContent'
import { Button } from '@/presentation/components/ui/button'
import { Plus } from 'lucide-react'
import Table from '@/presentation/components/Table'
import { AdminPengujianColumn } from './AdminPengujianColumn'
import AdminPengujianFormDialog from './components/AdminPengujianFormDialog'
import Header from '@/presentation/components/Header'
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog'

const AdminPengujianPage = () => {
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
        currentPage
    } = useUserDataTable({ filter_study_program: 0, role: userRole.AdminPengujian })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedAdminPengujian, setSelectedAdminPengujian] = useState<UserView | undefined>(undefined)
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const isEdit = !!selectedAdminPengujian

    const openAdd = () => {
        setSelectedAdminPengujian(undefined)
        setIsOpen(true)
    }

    const openEdit = (adminPengujian: UserView) => {
        setSelectedAdminPengujian(adminPengujian)
        setIsOpen(true)
    }

    const openConfirm = (adminPengujian: UserView) => {
        setSelectedAdminPengujian(adminPengujian)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: UserInputDTO): Promise<void> => {
        const res = selectedAdminPengujian
            ? await userService.updateData(selectedAdminPengujian.id, formData)
            : await userService.createData(formData)

        toast.success(res.message)
        refresh()
        setIsOpen(false)
    }

    const handleConfirm = async () => {
        if (!selectedAdminPengujian) return
        const res = await userService.deleteData(selectedAdminPengujian.id)
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
                            columns={AdminPengujianColumn({ openModal: openEdit, openConfirm })}
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
                <AdminPengujianFormDialog
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    adminPengujian={selectedAdminPengujian}
                    handleSave={handleSave}
                    title={!isEdit ? 'Tambah Laboran' : 'Edit Laboran'}
                />
            </MainContent>
        </>
    )
}

export default AdminPengujianPage
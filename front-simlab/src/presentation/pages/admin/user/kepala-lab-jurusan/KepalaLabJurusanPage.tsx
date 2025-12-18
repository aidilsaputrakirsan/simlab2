import { UserInputDTO } from '@/application/user/UserDTO'
import Header from '@/presentation/components/Header'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { useState } from 'react'
import { toast } from 'sonner'
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog'
import { KepalaLabJurusanColumn } from './KepalaLabJurusanColumn'
import Table from '@/presentation/components/Table'
import { userRole } from '@/domain/User/UserRole'
import { useDepedencies } from '@/presentation/contexts/useDepedencies'
import { useStudyProgramSelect } from '../../study-program/hooks/useStudyProgramSelect'
import { useUserDataTable } from '../hooks/useUserDataTable'
import MainContent from '@/presentation/components/MainContent'
import { UserView } from '@/application/user/UserView'
import UserFormDialog from '../components/UserFormDialog'
import { Button } from '@/presentation/components/ui/button'
import { Plus } from 'lucide-react'

const KepalaLabJurusanPage = () => {
    const { userService } = useDepedencies()
    const { studyPrograms } = useStudyProgramSelect()
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
    } = useUserDataTable({ filter_study_program: 0, role: userRole.KepalaLabJurusan })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedKepalaLabJurusan, setSelectedKepalaLabJurusan] = useState<UserView | undefined>(undefined)
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const isEdit = !!selectedKepalaLabJurusan

    const openAdd = () => {
        setSelectedKepalaLabJurusan(undefined)
        setIsOpen(true)
    }

    const openEdit = (kepalaLabJurusan: UserView) => {
        setSelectedKepalaLabJurusan(kepalaLabJurusan)
        setIsOpen(true)
    }

    const openConfirm = (kepalaLabJurusan: UserView) => {
        setSelectedKepalaLabJurusan(kepalaLabJurusan)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: UserInputDTO): Promise<void> => {
        const res = selectedKepalaLabJurusan
            ? await userService.updateData(selectedKepalaLabJurusan.id, formData)
            : await userService.createData(formData)

        toast.success(res.message)
        refresh()
        setIsOpen(false)
    }

    const handleRestoreDosen = async () => {
        if (!selectedKepalaLabJurusan) return
        const res = await userService.restoreToDosen(selectedKepalaLabJurusan.id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title='Menu Kepala Lab Jurusan' />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Kepala Lab Jurusan</CardTitle>
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
                            columns={KepalaLabJurusanColumn({ openModal: openEdit, openConfirm })}
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
                <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleRestoreDosen} />
                <UserFormDialog
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    studyPrograms={studyPrograms}
                    handleSave={handleSave}
                    user={selectedKepalaLabJurusan}
                    role={userRole.KepalaLabJurusan}
                    title={!isEdit ? 'Tambah Kepala Lab Jurusan' : 'Edit Kepala Lab Jurusan'}
                />
            </MainContent>
        </>
    )
}

export default KepalaLabJurusanPage

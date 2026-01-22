import { UserInputDTO } from '@/application/user/UserDTO'
import Header from '@/presentation/components/Header'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { useState } from 'react'
import { toast } from 'sonner'
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog'
import Table from '@/presentation/components/Table'
import { KepalaLabColumn } from './KepalaLabColumn'
import { userRole } from '@/domain/User/UserRole'
import { useDepedencies } from '@/presentation/contexts/useDepedencies'
import { useUserDataTable } from '../hooks/useUserDataTable'
import { useStudyProgramSelect } from '../../study-program/hooks/useStudyProgramSelect'
import MainContent from '@/presentation/components/MainContent'
import UserFormDialog from '../components/UserFormDialog'
import { UserView } from '@/application/user/UserView'
import { Button } from '@/presentation/components/ui/button'
import { Plus } from 'lucide-react'

const KepalaLabPage = () => {
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
        currentPage
    } = useUserDataTable({ filter_study_program: 0, role: userRole.KepalaLabTerpadu })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedKepalaLab, setSelectedKepalaLab] = useState<UserView | undefined>(undefined)
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const isEdit = !!selectedKepalaLab

    const openAdd = () => {
        setSelectedKepalaLab(undefined)
        setIsOpen(true)
    }

    const openEdit = (kepalaLab: UserView) => {
        setSelectedKepalaLab(kepalaLab)
        setIsOpen(true)
    }

    const openConfirm = (kepalaLab: UserView) => {
        setSelectedKepalaLab(kepalaLab)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: UserInputDTO): Promise<void> => {
        const res = selectedKepalaLab
            ? await userService.updateData(selectedKepalaLab.id, formData)
            : await userService.createData(formData)

        toast.success(res.message)
        refresh()
        setIsOpen(false)
    }

    const handleRestoreDosen = async () => {
        if (!selectedKepalaLab) return
        const res = await userService.restoreToDosen(selectedKepalaLab.id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title='Menu Kepala Lab. Unit' />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Kepala Laboratorium</CardTitle>
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
                            columns={KepalaLabColumn({ openModal: openEdit, openConfirm })}
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
                    user={selectedKepalaLab}
                    role={userRole.KepalaLabTerpadu}
                    title={!isEdit ? 'Tambah Kepala Lab Terpadu' : 'Edit Kepala Lab Terpadu'}
                />
            </MainContent>
        </>
    )
}

export default KepalaLabPage

import { UserInputDTO } from '@/application/user/UserDTO'
import Header from '@/presentation/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { ModalType } from '@/presentation/shared/Types'
import { useState } from 'react'
import { toast } from 'sonner'
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog'
import { KepalaLabJurusanColumn } from './KepalaLabJurusanColumn'
import Table from '@/presentation/components/Table'
import KepalaLabJurusanFormDialog from './components/KepalaLabJurusanFormDialog'
import { userRole } from '@/domain/User/UserRole'
import { useDepedencies } from '@/presentation/contexts/useDepedencies'
import { useStudyProgramSelect } from '../../study-program/hooks/useStudyProgramSelect'
import { useUserDataTable } from '../hooks/useUserDataTable'
import MainContent from '@/presentation/components/MainContent'

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
    const [id, setId] = useState<number | null>(null)
    const [type, setType] = useState<ModalType>('Add')
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const openModal = (modalType: ModalType, id: number | null = null) => {
        setType(modalType)
        setId(id)
        setIsOpen(true)
    }

    const openConfirm = (id: number) => {
        setId(id)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: UserInputDTO): Promise<void> => {
        try {
            if (!id) return
            const res = await userService.updateData(id, formData)
            toast.success(res.message)
            refresh()
            setIsOpen(false)
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleRestoreDosen = async () => {
        if (!id) return
        const res = await userService.restoreToDosen(id)
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
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={users}
                            columns={KepalaLabJurusanColumn({ openModal, openConfirm })}
                            loading={isLoading}
                            searchTerm={searchTerm}
                            handleSearch={(e) => handleSearch(e)}
                            perPage={perPage}
                            handlePerPageChange={(e) => handlePerPageChange(e)}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange} 
                            handleRefresh={refresh}/>
                    </CardContent>
                </Card>
                <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleRestoreDosen} />
                <KepalaLabJurusanFormDialog
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    data={users}
                    studyPrograms={studyPrograms}
                    dataId={id}
                    handleSave={handleSave}
                    title={type == 'Add' ? 'Tambah Dosen' : 'Edit Dosen'}
                />
            </MainContent>
        </>
    )
}

export default KepalaLabJurusanPage

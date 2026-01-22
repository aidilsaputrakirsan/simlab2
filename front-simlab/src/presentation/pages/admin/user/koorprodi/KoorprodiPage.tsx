import { useState } from 'react'
import Header from '@/presentation/components/Header'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import Table from '@/presentation/components/Table'
import { KoorprodiColumn } from './KoorprodiColumn'
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog'
import { toast } from 'sonner'
import { userRole } from '@/domain/User/UserRole'
import { Combobox } from '@/presentation/components/custom/combobox'
import { useDepedencies } from '@/presentation/contexts/useDepedencies'
import { useStudyProgramSelect } from '../../study-program/hooks/useStudyProgramSelect'
import { useUserDataTable } from '../hooks/useUserDataTable'
import MainContent from '@/presentation/components/MainContent'
import { UserView } from '@/application/user/UserView'
import { UserInputDTO } from '@/application/user/UserDTO'
import { Button } from '@/presentation/components/ui/button'
import { Plus } from 'lucide-react'
import UserFormDialog from '../components/UserFormDialog'

const KoorprodiPage = () => {
    const { userService } = useDepedencies()
    const { studyPrograms, selectedStudyProgram, setSelectedStudyProgram } = useStudyProgramSelect()
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
        setCurrentPage
    } = useUserDataTable({ filter_study_program: selectedStudyProgram, role: userRole.Kooprodi })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedKooprodi, setSelectedKooprodi] = useState<UserView | undefined>(undefined)
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const isEdit = !!selectedKooprodi

    const openAdd = () => {
        setSelectedKooprodi(undefined)
        setIsOpen(true)
    }

    const openEdit = (koorprodi: UserView) => {
        setSelectedKooprodi(koorprodi)
        setIsOpen(true)
    }

    const openConfirm = (koorprodi: UserView) => {
        setSelectedKooprodi(koorprodi)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: UserInputDTO): Promise<void> => {
        const res = selectedKooprodi
            ? await userService.updateData(selectedKooprodi.id, formData)
            : await userService.createData(formData)

        toast.success(res.message)
        refresh()
        setIsOpen(false)
    }

    const handleRestoreDosen = async () => {
        if (!selectedKooprodi) return
        const res = await userService.restoreToDosen(selectedKooprodi.id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title='Menu Admin' />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Admin</CardTitle>
                        <CardAction>
                            <Button variant={"default"} onClick={() => openAdd()}>
                                Tambah
                                <Plus />
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full mb-3 md:w-1/3">
                            <Combobox
                                options={studyPrograms}
                                value={selectedStudyProgram?.toString() || ''}
                                onChange={(val) => {
                                    setSelectedStudyProgram(val ? Number(val) : 0)
                                    setCurrentPage(1)
                                }}
                                placeholder="Pilih Prodi"
                                optionLabelKey='name'
                                optionValueKey='id'
                                isFilter
                            />
                        </div>
                        <Table
                            data={users}
                            columns={KoorprodiColumn({ openModal: openEdit , openConfirm })}
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
                    user={selectedKooprodi}
                    role={userRole.Kooprodi}
                    title={!isEdit ? 'Tambah Koorprodi' : 'Edit Koorprodi'}
                />
            </MainContent>
        </>
    )
}

export default KoorprodiPage
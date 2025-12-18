import Header from '@/presentation/components/Header'
import Table from '@/presentation/components/Table'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { useState } from 'react'
import { DosenColumn } from './DosenColumn'
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog'
import { toast } from 'sonner';
import { UserInputDTO } from '@/application/user/UserDTO';
import { Button } from '@/presentation/components/ui/button';
import { Plus } from 'lucide-react';
import { Combobox } from '@/presentation/components/custom/combobox';
import { userRole } from '@/domain/User/UserRole';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import { useStudyProgramSelect } from '../../study-program/hooks/useStudyProgramSelect';
import { useUserDataTable } from '../hooks/useUserDataTable';
import MainContent from '@/presentation/components/MainContent';
import { UserView } from '@/application/user/UserView'
import UserFormDialog from '../components/UserFormDialog'

const DosenPage = () => {
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
    } = useUserDataTable({ filter_study_program: selectedStudyProgram, role: userRole.Dosen })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedDosen, setSelectedDosen] = useState<UserView | undefined>(undefined)
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const isEdit = !!selectedDosen

    const openAdd = () => {
        setSelectedDosen(undefined)
        setIsOpen(true)
    }

    const openEdit = (dosen: UserView) => {
        setSelectedDosen(dosen)
        setIsOpen(true)
    }

    const openConfirm = (dosen: UserView) => {
        setSelectedDosen(dosen)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: UserInputDTO): Promise<void> => {
        const res = selectedDosen
            ? await userService.updateData(selectedDosen.id, formData)
            : await userService.createData(formData)

        toast.success(res.message)
        refresh()
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!selectedDosen) return
        const res = await userService.deleteData(selectedDosen.id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title='Menu Dosen' />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Dosen</CardTitle>
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
                            columns={DosenColumn({ openModal: openEdit, openConfirm })}
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
                <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleDelete} />
                <UserFormDialog
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    studyPrograms={studyPrograms}
                    handleSave={handleSave}
                    user={selectedDosen}
                    role={userRole.KepalaLabJurusan}
                    title={!isEdit ? 'Tambah Dosen' : 'Edit Dosen'}
                />
            </MainContent>
        </>
    )
}

export default DosenPage

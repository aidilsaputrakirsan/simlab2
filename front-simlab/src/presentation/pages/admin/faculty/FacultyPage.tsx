import { useState } from 'react';
import Header from '@/presentation/components/Header';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from '@/presentation/components/ui/button';
import { Plus } from 'lucide-react';
import Table from '@/presentation/components/Table';
import { FacultyColumn } from './FacultyColumn';
import { FacultyInputDTO } from '@/application/faculty/FacultyDTO';
import { toast } from 'sonner';
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog';
import FacultyFormDialog from './components/FacultyFormDialog';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import { useFacultyDataTable } from './hooks/useFacultyDataTable';
import { FacultyView } from '@/application/faculty/FacultyView';
import MainContent from '@/presentation/components/MainContent';

const FacultyPage = () => {
    const { facultyService } = useDepedencies()
    const {
        faculties,
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
    } = useFacultyDataTable()

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedFaculty, setSelectedFaculty] = useState<FacultyView | undefined>(undefined)
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const isEdit = !!selectedFaculty

    const openAdd = () => {
        setSelectedFaculty(undefined)
        setIsOpen(true)
    }

    const openEdit = (faculty: FacultyView) => {
        setSelectedFaculty(faculty)
        setIsOpen(true)
    }

    const openConfirm = (faculty: FacultyView) => {
        setSelectedFaculty(faculty)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: FacultyInputDTO): Promise<void> => {
        const res = selectedFaculty
            ? await facultyService.updateData(selectedFaculty.id, formData)
            : await facultyService.createData(formData)
        
        toast.success(res.message)
        refresh()
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!selectedFaculty) return
        const res = await facultyService.deleteData(selectedFaculty.id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title='Menu Fakultas' />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Fakultas</CardTitle>
                        <CardAction>
                            <Button variant={"default"} onClick={() => openAdd()}>
                                Tambah
                                <Plus />
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={faculties}
                            columns={FacultyColumn({ openModal: openEdit, openConfirm })}
                            loading={isLoading}
                            searchTerm={searchTerm}
                            handleSearch={(e) => handleSearch(e)}
                            perPage={perPage}
                            handlePerPageChange={(e) => handlePerPageChange(e)}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange} />
                    </CardContent>
                </Card>
            </MainContent>
            <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleDelete} />
            <FacultyFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                faculty={selectedFaculty}
                handleSave={handleSave}
                title={!isEdit ? 'Tambah Fakultas' : 'Edit Fakultas'}
            />
        </>
    )
}

export default FacultyPage
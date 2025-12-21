import Header from '@/presentation/components/Header'
import MainContent from '@/presentation/components/MainContent'
import { Button } from '@/presentation/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import { Plus } from 'lucide-react';
import { useInstitutionDataTable } from './hooks/useInstitutionDataTable';
import Table from '@/presentation/components/Table';
import { InstitutionColumn } from './InstitutionColumn';
import { InstitutionView } from '@/application/institution/InstitutionView.';
import { useState } from 'react';
import { InstitutionInputDTO } from '@/application/institution/dto/InstitutionDTO';
import { toast } from 'sonner';
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog';
import InstitutionFormDialog from './components/InstitutionFormDialog';

const InstitutionPage = () => {
    const { institutionService } = useDepedencies()
    const {
        institutions,
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
    } = useInstitutionDataTable()

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedInstitution, setSelectedInstitution] = useState<InstitutionView | undefined>(undefined)
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const isEdit = !!selectedInstitution

    const openAdd = () => {
        setSelectedInstitution(undefined)
        setIsOpen(true)
    }

    const openEdit = (major: InstitutionView) => {
        setSelectedInstitution(major)
        setIsOpen(true)
    }

    const openConfirm = (major: InstitutionView) => {
        setSelectedInstitution(major)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: InstitutionInputDTO): Promise<void> => {
        const res = selectedInstitution
            ? await institutionService.updateData(selectedInstitution.id, formData)
            : await institutionService.createData(formData)

        toast.success(res.message)
        refresh()
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!selectedInstitution) return
        const res = await institutionService.deleteData(selectedInstitution.id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title='Menu Institusi' />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Institusi</CardTitle>
                        <CardAction>
                            <Button variant={"default"} onClick={() => openAdd()}>
                                Tambah
                                <Plus />
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={institutions}
                            columns={InstitutionColumn({ openModal: openEdit, openConfirm })}
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
            <InstitutionFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                institution={selectedInstitution}
                handleSave={handleSave}
                title={!isEdit ? 'Tambah Institusi' : 'Edit Institusi'}
            />
        </>
    )
}

export default InstitutionPage
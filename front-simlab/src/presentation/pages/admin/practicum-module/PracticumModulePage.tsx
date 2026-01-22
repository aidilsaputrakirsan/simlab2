import { useState } from 'react'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import Header from '@/presentation/components/Header';
import { Button } from '@/presentation/components/ui/button';
import { Plus } from 'lucide-react';
import Table from '@/presentation/components/Table';
import { PracticumModuleColumn } from './PracticumModuleColumn';
import { toast } from 'sonner';
import { PracticumModuleInputDTO } from '@/application/practicum-module/PracticumModuleDTO';
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog';
import { Combobox } from '@/presentation/components/custom/combobox';
import PracticumModuleFormDialog from './components/PracticumModuleFormDialog';
import { usePracticumSelect } from '../practicum/hooks/usePracticumSelect';
import { usePracticumModuleDataTable } from './hooks/usePracticumModuleDataTable';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import MainContent from '@/presentation/components/MainContent';
import { PracticumModuleView } from '@/application/practicum-module/PracticumModuleView';

const PracticumModulePage = () => {
    const { practicums, selectedPracticum, setSelectedPracticum } = usePracticumSelect()
    const { practicumModuleService } = useDepedencies()

    const {
        practicumModules,
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
    } = usePracticumModuleDataTable({ filter_practicum: selectedPracticum })

    const [isOpen, setIsOpen] = useState(false)
    const [selectedPracticumModule, setSelectedPracticumModule] = useState<PracticumModuleView | undefined>(undefined)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmType, setConfirmType] = useState<"delete" | "status" | null>(null)

    const isEdit = !!selectedPracticumModule

    const openAdd = () => {
        setSelectedPracticumModule(undefined)
        setIsOpen(true)
    }

    const openEdit = (practicumModule: PracticumModuleView) => {
        setSelectedPracticumModule(practicumModule)
        setIsOpen(true)
    }

    const openConfirm = (type: "delete" | "status", practicumModule: PracticumModuleView) => {
        setConfirmType(type)
        setSelectedPracticumModule(practicumModule)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: PracticumModuleInputDTO): Promise<void> => {
        const res = selectedPracticumModule
            ? await practicumModuleService.updateData(selectedPracticumModule.id, formData)
            : await practicumModuleService.createData(formData)
        
        toast.success(res.message)
        refresh()
        setIsOpen(false)
    }

    const handleConfirm = async () => {
        if (!selectedPracticumModule || !confirmType) return
        const res = confirmType === 'delete'
            ? await practicumModuleService.deleteData(selectedPracticumModule.id)
            : await practicumModuleService.toggleStatus(selectedPracticumModule.id)

        toast.success(res.message)
        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title='Menu Modul Praktikum' />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Modul Praktikum</CardTitle>
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
                                options={practicums}
                                value={selectedPracticum?.toString() || ''}
                                onChange={(value: string) => setSelectedPracticum(Number(value))}
                                placeholder="Pilih Praktikum"
                                optionLabelKey='name'
                                optionValueKey='id'
                                isFilter
                            />
                        </div>
                        <Table
                            data={practicumModules}
                            columns={PracticumModuleColumn({ openModal: openEdit, openConfirm })}
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
            <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleConfirm} />
            <PracticumModuleFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                practicumModule={selectedPracticumModule}
                practicums={practicums}
                handleSave={handleSave}
                title={!isEdit ? 'Tambah Modul Praktikum' : 'Edit Modul Praktikum'}
            />
        </>
    )
}

export default PracticumModulePage
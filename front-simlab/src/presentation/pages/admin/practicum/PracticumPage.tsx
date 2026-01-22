import { useState } from "react"
import Table from "../../../components/Table";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import { PracticumInputDTO } from "@/application/practicum/PracticumDTO";
import { PracticumColumn } from "./PracticumColumn";
import { Combobox } from "@/presentation/components/custom/combobox";
import PracticumFormDialog from "./components/PracticumFormDialog";
import { useStudyProgramSelect } from "../study-program/hooks/useStudyProgramSelect";
import { usePracticumDataTable } from "./hooks/usePracticumDataTable";
import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import MainContent from "@/presentation/components/MainContent";
import { PracticumView } from "@/application/practicum/PracticumView";

const PracticumPage = () => {
    const { studyPrograms, selectedStudyProgram, setSelectedStudyProgram } = useStudyProgramSelect()

    const { practicumService } = useDepedencies()
    const {
        practicums,
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
    } = usePracticumDataTable({ filter_study_program: selectedStudyProgram })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedPracticum, setSelectedPracticum] = useState<PracticumView | undefined>(undefined)
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const isEdit = !!selectedPracticum

    const openAdd = () => {
        setSelectedPracticum(undefined)
        setIsOpen(true)
    }

    const openEdit = (practicum: PracticumView) => {
        setSelectedPracticum(practicum)
        setIsOpen(true)
    }

    const openConfirm = (practicum: PracticumView) => {
        setSelectedPracticum(practicum)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: PracticumInputDTO): Promise<void> => {
        const res = selectedPracticum
            ? await practicumService.updateData(selectedPracticum.id, formData)
            : await practicumService.createData(formData)

        toast.success(res.message)
        refresh()
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!selectedPracticum) return
        const res = await practicumService.deleteData(selectedPracticum.id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title="Menu Data Praktikum" />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Data Praktikum</CardTitle>
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
                            data={practicums}
                            columns={PracticumColumn({ openModal: openEdit, openConfirm })}
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
            <PracticumFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                practicum={selectedPracticum}
                studyProgram={studyPrograms}
                handleSave={handleSave}
                title={!isEdit ? 'Tambah data praktikum' : 'Edit data praktikum'}
            />
        </>
    )
}

export default PracticumPage
import { useState } from "react"
import Table from "../../../components/Table";
import { StudyProgramColumn } from "./StudyProgramColumn";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import { toast } from "sonner";
import { StudyProgramInputDTO } from "@/application/study-program/StudyProgramDTO";
import StudyProgramFormDialog from "./components/StudyProgramFormDialog";
import { Combobox } from "@/presentation/components/custom/combobox";
import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import { useStudyProgramDataTable } from "./hooks/useStudyProgramDataTable";
import { useMajorSelect } from "../major/hooks/useMajorSelect";
import MainContent from "@/presentation/components/MainContent";
import { StudyProgramView } from "@/application/study-program/StudyProgramView";

const StudyProgramPage = () => {
    const { majors, selectedMajor, setSelectedMajor } = useMajorSelect()
    const { studyProgramService } = useDepedencies()
    const {
        studyPrograms,
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
    } = useStudyProgramDataTable({ filter_major: selectedMajor })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedStudyProgram, setSelectedStudyProgram] = useState<StudyProgramView | undefined>(undefined)
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const isEdit = !!selectedStudyProgram

    const openAdd = () => {
        setSelectedStudyProgram(undefined)
        setIsOpen(true)
    }

    const openEdit = (studyProgram: StudyProgramView) => {
        setSelectedStudyProgram(studyProgram)
        setIsOpen(true)
    }

    const openConfirm = (studyProgram: StudyProgramView) => {
        setSelectedStudyProgram(studyProgram)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: StudyProgramInputDTO): Promise<void> => {
        const res = selectedStudyProgram
            ? await studyProgramService.updateData(selectedStudyProgram.id, formData)
            : await studyProgramService.createData(formData)

        toast.success(res.message)
        refresh()
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!selectedStudyProgram) return
        const res = await studyProgramService.deleteData(selectedStudyProgram.id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title="Menu Program Studi" />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Program Studi</CardTitle>
                        <CardAction>
                            <Button variant={"default"} onClick={() => openAdd()}>
                                Tambah
                                <Plus />
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full mb-3 md:w-1/3">
                            <div className="relative">
                                <Combobox
                                    options={majors}
                                    value={selectedMajor?.toString() || ''}
                                    onChange={(val) => {
                                        setSelectedMajor(val ? Number(val) : 0)
                                        setCurrentPage(1)
                                    }}
                                    placeholder="Pilih Jurusan"
                                    optionLabelKey='name'
                                    optionValueKey='id'
                                    isFilter
                                />
                            </div>
                        </div>
                        <Table
                            data={studyPrograms}
                            columns={StudyProgramColumn({ openModal: openEdit, openConfirm })}
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
            <StudyProgramFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                studyProgram={selectedStudyProgram}
                majors={majors}
                handleSave={handleSave}
                title={!isEdit ? 'Tambah program studi' : 'Edit program studi'}
            />
        </>
    )
}

export default StudyProgramPage
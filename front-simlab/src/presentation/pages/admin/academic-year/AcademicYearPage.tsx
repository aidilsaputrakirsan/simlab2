import { useState } from "react"
import { AcademicYearColumn } from "./AcademicYearColumn";
import Table from "../../../components/Table";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import Header from "@/presentation/components/Header";
import { Plus } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import { toast } from "sonner";
import { AcademicYearInputDTO } from "@/application/academic-year/AcademicYearDTO";
import AcademicYearFormDialog from "./components/AcademicYearFormDialog";
import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import { useAcademicYearDataTable } from "./hooks/useAcademicYearDataTable";
import { AcademicYearView } from "@/application/academic-year/AcademicYearView";
import MainContent from "@/presentation/components/MainContent";

const AcademicYearPage = () => {

    const { academicYearService } = useDepedencies()
    const {
        academicYears,
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
    } = useAcademicYearDataTable()

    const [isOpen, setIsOpen] = useState(false)
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<AcademicYearView>()
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmType, setConfirmType] = useState<"delete" | "status" | null>(null)

    const isEdit = !!selectedAcademicYear

    const openAdd = () => {
        setSelectedAcademicYear(undefined)
        setIsOpen(true)
    }

    const openEdit = (academicYear: AcademicYearView) => {
        setSelectedAcademicYear(academicYear)
        setIsOpen(true)
    }

    const openConfirm = (type: "delete" | "status", academicYear: AcademicYearView) => {
        setConfirmType(type)
        setSelectedAcademicYear(academicYear)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: AcademicYearInputDTO): Promise<void> => {
        const res = isEdit
            ? await academicYearService.updateData(selectedAcademicYear.id, formData)
            : await academicYearService.createData(formData)
        toast.success(res.message)

        refresh()
        setIsOpen(false)
        setSelectedAcademicYear(undefined)
    }

    const handleConfirm = async () => {
        if (!selectedAcademicYear || !confirmType) return
        const res = confirmType == 'delete'
            ? await academicYearService.deleteData(selectedAcademicYear.id)
            : await academicYearService.toggleStatus(selectedAcademicYear.id)

        toast.success(res.message)
        refresh()
        setConfirmOpen(false)
        setSelectedAcademicYear(undefined)
    }


    return (
        <>
            <Header title='Menu Tahun Akademik' />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Tahun Akademik</CardTitle>
                        <CardAction>
                            <Button variant={"default"} onClick={() => openAdd()}>
                                Tambah
                                <Plus />
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={academicYears}
                            columns={AcademicYearColumn({ openModal: openEdit, openConfirm })}
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
            <AcademicYearFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                academicYear={selectedAcademicYear}
                handleSave={handleSave}
                title={!isEdit ? 'Tambah Tahun Akademik' : 'Edit Tahun Akademik'}
            />
        </>
    )
}

export default AcademicYearPage
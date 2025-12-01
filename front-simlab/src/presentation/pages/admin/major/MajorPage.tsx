import { useEffect, useState } from "react"
import Table from "../../../components/Table";
import { MajorColumn } from "./MajorColumn";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import MajorFormDialog from "./components/MajorFormDialog";
import { MajorInputDTO } from "@/application/major/MajorDTO";
import { Combobox } from "@/presentation/components/custom/combobox";
import { useFacultySelect } from "../faculty/hooks/useFacultySelect";
import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import { useMajorDataTable } from "./hooks/useMajorDataTable";
import { MajorView } from "@/application/major/MajorView";
import MainContent from "@/presentation/components/MainContent";

const MajorPage = () => {
    const { faculties, selectedFaculty, setSelectedFaculty } = useFacultySelect()

    useEffect(() => {
        setCurrentPage(1)
    }, [selectedFaculty])

    const { majorService } = useDepedencies()
    const {
        majors,
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
    } = useMajorDataTable({ filter_faculty: selectedFaculty })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedMajor, setSelectedMajor] = useState<MajorView | undefined>(undefined)
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const isEdit = !!selectedMajor

    const openAdd = () => {
        setSelectedMajor(undefined)
        setIsOpen(true)
    }

    const openEdit = (major: MajorView) => {
        setSelectedMajor(major)
        setIsOpen(true)
    }

    const openConfirm = (major: MajorView) => {
        setSelectedMajor(major)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: MajorInputDTO): Promise<void> => {
        const res = selectedMajor
            ? await majorService.updateData(selectedMajor.id, formData)
            : await majorService.createData(formData)

        toast.success(res.message)
        refresh()
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!selectedMajor) return
        const res = await majorService.deleteData(selectedMajor.id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title="Menu Jurusan" />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Jurusan</CardTitle>
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
                                options={faculties}
                                value={selectedFaculty?.toString() || ''}
                                onChange={(value) => setSelectedFaculty(Number(value))}
                                placeholder="Pilih Fakultas"
                                optionLabelKey='name'
                                optionValueKey='id'
                                isFilter
                            />
                        </div>
                        <Table
                            data={majors}
                            columns={MajorColumn({ openModal: openEdit, openConfirm })}
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
            <MajorFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                major={selectedMajor}
                faculties={faculties}
                handleSave={handleSave}
                title={!isEdit ? 'Tambah Jurusan' : 'Edit Jurusan'}
            />
        </>
    )
}

export default MajorPage
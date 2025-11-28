import { useRef, useState } from "react"
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import { AcademicYearColumn } from "./AcademicYearColumn";
import Table from "../../../components/Table";
import { ModalType } from "../../../shared/Types";
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

const AcademicYearPage = () => {
    const sectionRef = useRef<HTMLDivElement | null>(null)

    useGSAP(() => {
        if (!sectionRef.current) return

        const tl = gsap.timeline()
        tl.fromTo(sectionRef.current,
            {
                opacity: 0,
                y: 100
            },
            {
                opacity: 1,
                y: 0,
                duration: 1
            },
        )
    }, [])

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
    const [type, setType] = useState<ModalType>('Add')
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<AcademicYearView | undefined>(undefined)

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmType, setConfirmType] = useState<"delete" | "status" | null>(null)

    const openModal = (modalType: ModalType, academicYear?: AcademicYearView) => {
        setType(modalType)
        setSelectedAcademicYear(academicYear ?? undefined)
        setIsOpen(true)
    }

    const openConfirm = (type: "delete" | "status", academicYear: AcademicYearView) => {
        setConfirmType(type)
        setSelectedAcademicYear(academicYear)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: AcademicYearInputDTO): Promise<void> => {
        if (selectedAcademicYear) {
            const res = await academicYearService.updateData(selectedAcademicYear.id, formData)
            toast.success(res.message)
        } else {
            const res = await academicYearService.createData(formData)
            toast.success(res.message)
        }
        refresh()
        setSelectedAcademicYear(undefined)
        setIsOpen(false)
    }

    const handleConfirm = async () => {
        if (!selectedAcademicYear) return
        if (confirmType == 'delete') {
            const res = await academicYearService.deleteData(selectedAcademicYear.id)
            toast.success(res.message)
        } else {
            const res = await academicYearService.toggleStatus(selectedAcademicYear.id)
            toast.success(res.message)
        }
        refresh()
        setSelectedAcademicYear(undefined)
        setConfirmOpen(false)
    }


    return (
        <>
            <Header title='Menu Tahun Akademik' />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Tahun Akademik</CardTitle>
                        <CardAction>
                            <Button variant={"default"} onClick={() => openModal('Add')}>
                                Tambah
                                <Plus />
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={academicYears}
                            columns={AcademicYearColumn({ openModal, openConfirm })}
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
            </div>
            <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleConfirm} />
            <AcademicYearFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                academicYear={selectedAcademicYear}
                handleSave={handleSave}
                title={type == 'Add' ? 'Tambah Tahun Akademik' : 'Edit Tahun Akademik'}
            />
        </>
    )
}

export default AcademicYearPage
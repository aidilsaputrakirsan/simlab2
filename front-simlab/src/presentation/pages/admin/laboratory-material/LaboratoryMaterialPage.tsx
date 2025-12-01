import { useState } from "react"
import Table from "../../../components/Table";
import { LaboratoryMaterialColumn } from "./LaboratoryMaterialColumn";
import { toast } from "sonner";
import { LaboratoryMaterialInputDTO } from "@/application/laboratory-material/LaboratoryMaterialDTO";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import LaboratoryMaterialFormDialog from "./components/LaboratoryMaterialFormDialog";
import { Combobox } from "@/presentation/components/custom/combobox";
import LaboratoryMaterialDetailDialog from "./components/LaboratoryMaterialDetailDialog";
import { useLaboratoryRoomSelect } from "../laboratory-room/hooks/useLaboratoryRoomSelect";
import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import { useLaboratoryMaterialDataTable } from "./hooks/useLaboratoryMaterialDataTable";
import MainContent from "@/presentation/components/MainContent";
import { LaboratoryMaterialView } from "@/application/laboratory-material/LaboratoryMaterialView";

const LaboratoryMaterialPage = () => {
    const { laboratoryRooms, selectedLaboratoryRoom, setSelectedLaboratoryRoom } = useLaboratoryRoomSelect()

    const { laboratoryMaterialService } = useDepedencies()
    const {
        laboratoryMaterials,
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
    } = useLaboratoryMaterialDataTable({ filter_laboratory_room: selectedLaboratoryRoom })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false)
    const [selectedLaboratoryMaterial, setSelectedLaboratoryMaterial] = useState<LaboratoryMaterialView | undefined>(undefined)
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const isEdit = !!selectedLaboratoryMaterial

    const openAdd = () => {
        setSelectedLaboratoryMaterial(undefined)
        setIsOpen(true)
    }

    const openEdit = (laboratoryMaterial: LaboratoryMaterialView) => {
        setSelectedLaboratoryMaterial(laboratoryMaterial)
        setIsOpen(true)
    }

    const openConfirm = (laboratoryMaterial: LaboratoryMaterialView) => {
        setSelectedLaboratoryMaterial(laboratoryMaterial)
        setConfirmOpen(true)
    }

    const openModalDetail = (laboratoryMaterial: LaboratoryMaterialView) => {
        setSelectedLaboratoryMaterial(laboratoryMaterial)
        setIsDetailOpen(true)
    }

    const handleSave = async (formData: LaboratoryMaterialInputDTO): Promise<void> => {
        const res = selectedLaboratoryMaterial
            ? await laboratoryMaterialService.updateData(selectedLaboratoryMaterial.id, formData)
            : await laboratoryMaterialService.createData(formData)

        toast.success(res.message)
        refresh()
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!selectedLaboratoryMaterial) return
        const res = await laboratoryMaterialService.deleteData(selectedLaboratoryMaterial.id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title="Menu Ruangan Laboratorium" />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Bahan Laboratorium</CardTitle>
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
                                    options={laboratoryRooms}
                                    value={selectedLaboratoryRoom?.toString() || ''}
                                    onChange={(val) => {
                                        setSelectedLaboratoryRoom(val ? Number(val) : 0)
                                        setCurrentPage(1)
                                    }}
                                    placeholder="Pilih Ruangan Laboratorium"
                                    optionLabelKey='name'
                                    optionValueKey='id'
                                    isFilter
                                />
                            </div>
                        </div>
                        <Table
                            data={laboratoryMaterials}
                            columns={LaboratoryMaterialColumn({ openModal: openEdit, openConfirm, openModalDetail })}
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
            </MainContent>
            <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleDelete} />
            <LaboratoryMaterialFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                laboratoryRooms={laboratoryRooms}
                laboratoryMaterial={selectedLaboratoryMaterial}
                handleSave={handleSave}
                title={!isEdit ? 'Tambah Bahan Laboratorium' : 'Edit Bahan Laboratorium'}
            />
            <LaboratoryMaterialDetailDialog
                laboratoryMaterial={selectedLaboratoryMaterial}
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen} />
        </>
    )
}

export default LaboratoryMaterialPage
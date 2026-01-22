import { useState } from "react"
import Table from "../../../components/Table";
import { LaboratoryEquipmentColumn } from "./LaboratoryEquipmentColumn";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import { LaboratoryEquipmentInputDTO } from "@/application/laboratory-equipment/LaboratoryEquipmentDTO";
import { toast } from "sonner";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import LaboratoryEquipmentFormDialog from "./components/LaboratoryEquipmentFormDialog";
import { Combobox } from "@/presentation/components/custom/combobox";
import LaboratoryEquipmentDetailDialog from "./components/LaboratoryEquipmentDetailDialog";
import { useLaboratoryRoomSelect } from "../laboratory-room/hooks/useLaboratoryRoomSelect";
import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import { useLaboratoryEquipmentDataTable } from "./hooks/useLaboratoryEquipmentDataTable";
import MainContent from "@/presentation/components/MainContent";
import { LaboratoryEquipmentView } from "@/application/laboratory-equipment/LaboratoryEquipmentView";

const LaboratoryEquipmentPage = () => {
    const { laboratoryRooms, selectedLaboratoryRoom, setSelectedLaboratoryRoom } = useLaboratoryRoomSelect()
    const { laboratoryEquipmentService } = useDepedencies()
    const {
        laboratoryEquipments,
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
    } = useLaboratoryEquipmentDataTable({ filter_laboratory_room: selectedLaboratoryRoom })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isModalDetailOpen, setIsModalDetailOpen] = useState<boolean>(false)
    const [selectedLaboratoryEquipment, setSelectedEquipment] = useState<LaboratoryEquipmentView | undefined>(undefined)
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const isEdit = !!selectedLaboratoryEquipment

    const openAdd = () => {
        setSelectedEquipment(undefined)
        setIsOpen(true)
    }

    const openEdit = (laboratoryEquipment: LaboratoryEquipmentView) => {
        setSelectedEquipment(laboratoryEquipment)
        setIsOpen(true)
    }

    const openConfirm = (laboratoryEquipment: LaboratoryEquipmentView) => {
        setSelectedEquipment(laboratoryEquipment)
        setConfirmOpen(true)
    }

    const openModalDetail = (laboratoryEquipment: LaboratoryEquipmentView) => {
        setSelectedEquipment(laboratoryEquipment)
        setIsModalDetailOpen(true)
    }

    const handleSave = async (formData: LaboratoryEquipmentInputDTO): Promise<void> => {
        const res = selectedLaboratoryEquipment
            ? await laboratoryEquipmentService.updateData(selectedLaboratoryEquipment.id, formData)
            : await laboratoryEquipmentService.createData(formData)
        
        toast.success(res.message)
        refresh()
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!selectedLaboratoryEquipment) return
        const res = await laboratoryEquipmentService.deleteData(selectedLaboratoryEquipment.id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title="Menu Alat Laboratorium" />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Alat Laboratorium</CardTitle>
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
                            data={laboratoryEquipments}
                            columns={LaboratoryEquipmentColumn({ openModal: openEdit, openConfirm, openModalDetail })}
                            loading={isLoading}
                            searchTerm={searchTerm}
                            handleSearch={(e) => handleSearch(e)}
                            perPage={perPage}
                            handlePerPageChange={(e) => handlePerPageChange(e)}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange} 
                            handleRefresh={refresh}/>
                    </CardContent>
                </Card>
            </MainContent>
            <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleDelete} />
            <LaboratoryEquipmentFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                laboratoryRooms={laboratoryRooms}
                laboratoryEquipment={selectedLaboratoryEquipment}
                handleSave={handleSave}
                title={!isEdit ? 'Tambah Alat Laboratorium' : 'Edit Alat Laboratorium'}
            />
            <LaboratoryEquipmentDetailDialog 
                laboratoryEquipment={selectedLaboratoryEquipment}
                open={isModalDetailOpen} 
                onOpenChange={setIsModalDetailOpen} />
        </>
    )
}

export default LaboratoryEquipmentPage
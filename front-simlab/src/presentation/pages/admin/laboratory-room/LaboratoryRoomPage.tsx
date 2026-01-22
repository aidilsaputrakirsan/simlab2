import { useState } from "react"
import Table from "../../../components/Table";
import { LaboratoryRoomColumn } from "./LaboratoryRoomColumn";
import { LaboratoryRoomInputDTO } from "@/application/laboratory-room/LaboratoryRoomDTO";
import { toast } from "sonner";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import LaboratoryRoomFormDialog from "./components/LaboratoryRoomFormDialog";
import { useLaboratoryRoomDataTable } from "./hooks/useLaboratoryRoomDataTable";
import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import { useUserSelect } from "../user/hooks/useUserSelect";
import { userRole } from "@/domain/User/UserRole";
import MainContent from "@/presentation/components/MainContent";
import { LaboratoryRoomView } from "@/application/laboratory-room/LaboratoryRoomView";

const LaboratoryRoomPage = () => {
    const { laboratoryRoomService } =  useDepedencies()

    const {
        laboratoryRooms,
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
    } = useLaboratoryRoomDataTable()

    const { users } = useUserSelect({ role: userRole.Laboran })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedLaboratoryRoom, setSelectedLaboratoryRoom] = useState<LaboratoryRoomView | undefined>(undefined)
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const isEdit = !!selectedLaboratoryRoom

    const openAdd = () => {
        setSelectedLaboratoryRoom(undefined)
        setIsOpen(true)
    }

    const openEdit = (laboratoryRoom: LaboratoryRoomView) => {
        setSelectedLaboratoryRoom(laboratoryRoom)
        setIsOpen(true)
    }

    const openConfirm = (laboratoryRoom: LaboratoryRoomView) => {
        setSelectedLaboratoryRoom(laboratoryRoom)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: LaboratoryRoomInputDTO): Promise<void> => {
        const res = selectedLaboratoryRoom
            ? await laboratoryRoomService.updateData(selectedLaboratoryRoom.id, formData)
            : await laboratoryRoomService.createData(formData)

        toast.success(res.message)
        refresh()
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!selectedLaboratoryRoom) return
        const res = await laboratoryRoomService.deleteData(selectedLaboratoryRoom.id)
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
                        <CardTitle>Menu Ruangan Laboratorium</CardTitle>
                        <CardAction>
                            <Button variant={"default"} onClick={() => openAdd()}>
                                Tambah
                                <Plus />
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={laboratoryRooms}
                            columns={LaboratoryRoomColumn({ openModal: openEdit, openConfirm })}
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
            <LaboratoryRoomFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                laborans={users}
                laboratoryRoom={selectedLaboratoryRoom}
                handleSave={handleSave}
                title={!isEdit ? 'Tambah Ruangan Laboratorium' : 'Edit Ruangan Laboratorium'}
            />
        </>
    )
}

export default LaboratoryRoomPage
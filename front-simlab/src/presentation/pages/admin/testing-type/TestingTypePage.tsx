import { useEffect, useState } from "react"
import Table from "../../../components/Table";
import { TestingTypeColumn } from "./TestingTypeColumn";
import { TestingTypeInputDTO } from "../../../../application/testing-type/dtos/TestingTypeDTO";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import TestingTypeFormDialog from "./components/TestingTypeFormDialog";
import { useTestingTypeDataTable } from "./hooks/useTestingTypeDataTable";
import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import { useTestingCategorySelect } from "../testing-category/hooks/useTestingCategorySelect";
import { Combobox } from "@/presentation/components/custom/combobox";
import MainContent from "@/presentation/components/MainContent";
import { TestingTypeView } from "@/application/testing-type/TestingTypeView";

const TestingTypePage = () => {
    const { testingCategories, selectedTestingCategory, setSelectedTestingCategory } = useTestingCategorySelect()

    useEffect(() => {
        setCurrentPage(1)
    }, [selectedTestingCategory])

    const { testingTypeService } = useDepedencies()
    const {
        testingTypes,
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
    } = useTestingTypeDataTable({ filter_testing_category: selectedTestingCategory })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedTestingType, setSelectedTestingType] = useState<TestingTypeView | undefined>(undefined)
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const isEdit = !!selectedTestingType

    const openAdd = () => {
        setSelectedTestingType(undefined)
        setIsOpen(true)
    }

    const openEdit = (testingType: TestingTypeView) => {
        setSelectedTestingType(testingType)
        setIsOpen(true)
    }

    const openConfirm = (testingType: TestingTypeView) => {
        setSelectedTestingType(testingType)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: TestingTypeInputDTO): Promise<void> => {
        const res = selectedTestingType
            ? await testingTypeService.updateData(selectedTestingType.id, formData)
            : await testingTypeService.createData(formData)
        
        toast.success(res.message)
        refresh()
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!selectedTestingType) return
        const res = await testingTypeService.deleteData(selectedTestingType.id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title="Menu Jenis Pengujian" />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Jenis Pengujian</CardTitle>
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
                                    options={testingCategories}
                                    value={selectedTestingCategory?.toString() || ''}
                                    onChange={(val) => setSelectedTestingCategory(Number(val))}
                                    placeholder="Pilih Kategori Pengujian"
                                    optionLabelKey='name'
                                    optionValueKey='id'
                                    isFilter
                                />
                            </div>
                        </div>
                        <Table
                            data={testingTypes}
                            columns={TestingTypeColumn({ openModal: openEdit, openConfirm })}
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
            <TestingTypeFormDialog
                open={isOpen}
                testingCategories={testingCategories}
                onOpenChange={setIsOpen}
                testingType={selectedTestingType}
                handleSave={handleSave}
                title={!isEdit ? 'Tambah jenis pengujian' : 'Edit jenis pengujian'}
            />
        </>
    )
}

export default TestingTypePage
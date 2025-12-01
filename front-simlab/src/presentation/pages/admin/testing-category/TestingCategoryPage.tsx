import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import { useState } from 'react'
import { useTestingCategoryDataTable } from './hooks/useTestingCategoryDataTable';
import { TestingCategoryView } from '@/application/testing-category/TestingCategoryView';
import Header from '@/presentation/components/Header';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import Table from '@/presentation/components/Table';
import { TestingCategoryColumn } from './columns/TestingCategoryColumn';
import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog';
import TestingCategoryFormDialog from './components/TestingCategoryFormDialog';
import { TestingCategoryInputDTO } from '@/application/testing-category/TestingCategoryDTO';
import MainContent from '@/presentation/components/MainContent';

const TestingCategoryPage = () => {
    const { testingCategoryService } = useDepedencies()
    const {
        testingCategories,
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
    } = useTestingCategoryDataTable()

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedTestingCategory, setSelectedTestingCategory] = useState<TestingCategoryView | undefined>(undefined)
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const isEdit = !!selectedTestingCategory

    const openAdd = () => {
        setSelectedTestingCategory(undefined)
        setIsOpen(true)
    }

    const openEdit = (testingCategory: TestingCategoryView) => {
        setSelectedTestingCategory(testingCategory)
        setIsOpen(true)
    }

    const openConfirm = (testingCategory: TestingCategoryView) => {
        setSelectedTestingCategory(testingCategory)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: TestingCategoryInputDTO): Promise<void> => {
        const res = selectedTestingCategory
            ? await testingCategoryService.updateData(selectedTestingCategory.id, formData)
            : await testingCategoryService.createData(formData)

        toast.success(res.message)
        refresh()
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!selectedTestingCategory) return
        const res = await testingCategoryService.deleteData(selectedTestingCategory.id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title='Menu Kategori Pengujian' />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Kategori Pengujian</CardTitle>
                        <CardAction>
                            <Button onClick={() => openAdd()}>
                                Tambah <PlusIcon />
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={testingCategories}
                            columns={TestingCategoryColumn({ openModal: openEdit, openConfirm })}
                            loading={isLoading}
                            searchTerm={searchTerm}
                            handleSearch={(e) => handleSearch(e)}
                            perPage={perPage}
                            handlePerPageChange={(e) => handlePerPageChange(e)}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange}
                            handleRefresh={refresh}
                        />
                    </CardContent>
                </Card>
            </MainContent>
            <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleDelete} />
            <TestingCategoryFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                testingCategory={selectedTestingCategory}
                handleSave={handleSave}
                title={!isEdit ? 'Tambah Kategori Pengujian' : 'Edit Kategori Pengujian'}
            />
        </>
    )
}

export default TestingCategoryPage
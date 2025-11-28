import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap';
import { useRef, useState } from 'react'
import { useTestingCategoryDataTable } from './hooks/useTestingCategoryDataTable';
import { TestingCategoryView } from '@/application/testing-category/TestingCategoryView';
import { ModalType } from '@/presentation/shared/Types';
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

const TestingCategoryPage = () => {
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
    const [type, setType] = useState<ModalType>('Add')
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const openModal = (modalType: ModalType, testingCategory?: TestingCategoryView) => {
        setType(modalType)
        setSelectedTestingCategory(testingCategory)
        setIsOpen(true)
    }

    const openConfirm = (testingCategory: TestingCategoryView) => {
        setSelectedTestingCategory(testingCategory)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: TestingCategoryInputDTO): Promise<void> => {
            if (selectedTestingCategory) {
                const res = await testingCategoryService.updateData(selectedTestingCategory.id, formData)
                toast.success(res.message)
            } else {
                const res = await testingCategoryService.createData(formData)
                toast.success(res.message)
            }
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
            <div className='flex flex-col p-4 pt-0' ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Kategori Pengujian</CardTitle>
                        <CardAction>
                            <Button onClick={() => openModal('Add')}>
                                Tambah <PlusIcon />
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={testingCategories}
                            columns={TestingCategoryColumn({ openModal, openConfirm })}
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
            </div>
            <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleDelete} />
            <TestingCategoryFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                testingCategory={selectedTestingCategory}
                handleSave={handleSave}
                title={type === 'Add' ? 'Tambah Kategori Pengujian' : 'Edit Kategori Pengujian'}
            />
        </>
    )
}

export default TestingCategoryPage
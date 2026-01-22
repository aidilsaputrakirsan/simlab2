import { useState } from 'react'
import Table from '../../../../components/Table'
import { MahasiswaColumn } from './MahasiswaColumn'
import { toast } from 'sonner'
import Header from '@/presentation/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog'
import { Combobox } from '@/presentation/components/custom/combobox'
import { userRole } from '@/domain/User/UserRole'
import MainContent from '@/presentation/components/MainContent'
import { useDepedencies } from '@/presentation/contexts/useDepedencies'
import { useStudyProgramSelect } from '../../study-program/hooks/useStudyProgramSelect'
import { useUserDataTable } from '../hooks/useUserDataTable'

const MahasiswaPage = () => {
    const { userService } = useDepedencies()
    const { studyPrograms, selectedStudyProgram, setSelectedStudyProgram } = useStudyProgramSelect()

    const {
        users,
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
    } = useUserDataTable({ filter_study_program: selectedStudyProgram, role: userRole.Mahasiswa })

    const [id, setId] = useState<number | null>(null)
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const openConfirm = (id: number) => {
        setId(id)
        setConfirmOpen(true)
    }

    const handleDelete = async () => {
        if (!id) return
        const res = await userService.deleteData(id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title='Menu Mahasiswa' />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Mahasiswa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full mb-3 md:w-1/3">
                            <Combobox
                                options={studyPrograms}
                                value={selectedStudyProgram?.toString() || ''}
                                onChange={(val) => {
                                    setSelectedStudyProgram(val ? Number(val) : 0)
                                    setCurrentPage(1)
                                }}
                                placeholder="Pilih Prodi"
                                optionLabelKey='name'
                                optionValueKey='id'
                                isFilter
                            />
                        </div>
                        <Table
                            data={users}
                            columns={MahasiswaColumn({ openConfirm })}
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
                <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleDelete} />
            </MainContent>
        </>
    )
}

export default MahasiswaPage

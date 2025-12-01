import { useState } from 'react'
import Header from '@/presentation/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import Table from '@/presentation/components/Table'
import { KoorprodiColumn } from './KoorprodiColumn'
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog'
import { toast } from 'sonner'
import { userRole } from '@/domain/User/UserRole'
import { Combobox } from '@/presentation/components/custom/combobox'
import { useDepedencies } from '@/presentation/contexts/useDepedencies'
import { useStudyProgramSelect } from '../../study-program/hooks/useStudyProgramSelect'
import { useUserDataTable } from '../hooks/useUserDataTable'
import MainContent from '@/presentation/components/MainContent'

const KoorprodiPage = () => {
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
    } = useUserDataTable({ filter_study_program: selectedStudyProgram, role: userRole.Kooprodi })

    const [id, setId] = useState<number | null>(null)
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const openConfirm = (id: number) => {
        setId(id)
        setConfirmOpen(true)
    }

    const handleRestoreDosen = async () => {
        if (!id) return
        const res = await userService.restoreToDosen(id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
        setId(null)
    }

    return (
        <>
            <Header title='Menu Admin' />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Admin</CardTitle>
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
                            columns={KoorprodiColumn({ openConfirm })}
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
                <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleRestoreDosen} />
            </MainContent>
        </>
    )
}

export default KoorprodiPage
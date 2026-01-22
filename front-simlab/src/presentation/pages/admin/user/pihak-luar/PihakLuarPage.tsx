import { useState } from 'react'
import Table from '../../../../components/Table'
import { PihakLuarColumn } from './PihakLuarColumn'
import { toast } from 'sonner'
import Header from '@/presentation/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog'
import MainContent from '@/presentation/components/MainContent'
import { useDepedencies } from '@/presentation/contexts/useDepedencies'
import { userRole } from '@/domain/User/UserRole'
import { useUserDataTable } from '../hooks/useUserDataTable'

const PihakLuarPage = () => {
    const { userService } = useDepedencies()
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
    } = useUserDataTable({ filter_study_program: 0, role: userRole.PihakLuar })

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
            <Header title='Menu Pihak Luar' />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Pihak Luar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={users}
                            columns={PihakLuarColumn({ openConfirm })}
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
                <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleDelete} />
            </MainContent>
        </>
    )
}

export default PihakLuarPage

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'
import Table from '../../../../components/Table'
import { AdminColumn } from './AdminColumn'
import Header from '@/presentation/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import AdminFormDialog from './components/AdminFormDialog'
import useTable from '@/application/hooks/useTable'
import { useUser } from '@/application/user/hooks/useUser'
import { UserInputDTO } from '@/application/user/dto/UserDTO'
import { toast } from 'sonner'
import { ModalType } from '@/shared/Types'

const AdminPage = () => {
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

    const {
        currentPage,
        perPage,
        totalPages,
        totalItems,
        searchTerm,

        setTotalPages,
        setTotalItems,
        setCurrentPage,

        handleSearch,
        handlePerPageChange,
        handlePageChange,
    } = useTable()

    const {
        user,
        isLoading,
        getData,
        update,
    } = useUser({
        currentPage,
        perPage,
        role: 'Admin',
        filter_study_program: 0,
        searchTerm,
        setTotalPages,
        setTotalItems
    })
    const [isOpen, setIsOpen] = useState(false)
    const [id, setId] = useState<number | null>(null)
    const [type, setType] = useState<ModalType>('Add')

    const openModal = (modalType: ModalType, id: number | null = null) => {
        setId(null)
        setType(modalType)
        setId(id)
        setIsOpen(true)
    }

    useEffect(() => {
        getData()
    }, [currentPage, perPage])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) {
                getData()
            } else {
                setCurrentPage(1)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const handleSave = async (formData: UserInputDTO): Promise<void> => {
        if (id) {
            const res = await update(id, formData)
            toast.success(res.message)
        }
        getData()
        setIsOpen(false)
    }

    return (
        <>
            <Header title='Menu Admin' />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Admin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={user}
                            columns={AdminColumn({ openModal })}
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

            <AdminFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                data={user}
                dataId={id}
                handleSave={handleSave}
                title={type == 'Add' ? 'Tambah Petugas Laboran' : 'Edit Petugas Laboran'}
            />
        </>
    )
}

export default AdminPage

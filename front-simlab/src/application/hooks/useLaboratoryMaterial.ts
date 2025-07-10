import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { ModalType, SortDirection } from "../../shared/Types"
import Swal from "sweetalert2"
import { LaboratoryMaterialRepository } from "../../infrastructure/laboratory-material/LaboratoryMaterialRepository"
import { LaboratoryMaterial } from "../../domain/laboratory-material/LaboratoryMaterial"
import { LaboratoryMaterialInputDTO } from "../laboratory-material/dto/LaboratoryMaterialDTO"

const laboratoryMaterialRepository = new LaboratoryMaterialRepository()

interface useLaboratoryMaterialResult {
    isLoading: boolean
    data: LaboratoryMaterial[]
    currentPage: number
    perPage: number
    totalPages: number
    totalItems: number
    searchTerm: string
    sortDirection: SortDirection
    isModalOpen: boolean
    editData: number | null
    type: ModalType,
    selectedRuanganLaboratorium: number | null,

    handleSearch: (e: ChangeEvent<HTMLInputElement>) => void
    handlePerPageChange: (e: ChangeEvent<HTMLSelectElement>) => void
    handlePageChange: (page: number) => void
    handleSortChange: (field: string) => void
    openModal: (modalType: ModalType, id?: number) => void
    closeModal: () => void
    handleSave: (formData: LaboratoryMaterialInputDTO) => Promise<void>
    handleDelete: (id: number) => Promise<void>
    handleFilterRuanganLaboratorium: (e: ChangeEvent<HTMLSelectElement>) => void
}

const useLaboratoryMaterial = (dataFetch: 'all' | 'default' = 'default'): useLaboratoryMaterialResult => {
    const [data, setData] = useState<LaboratoryMaterial[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    // fetch rule
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [perPage, setPerPage] = useState<number>(10)
    const [totalPages, setTotalPages] = useState<number>(0)
    const [totalItems, setTotalItems] = useState<number>(0)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [sortBy, setSortBy] = useState<string>('created_at')
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
    const [selectedRuanganLaboratorium, setselectedRuanganLaboratorium] = useState<number | null>(null)

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [editData, setEditData] = useState<number | null>(null)
    const [type, setType] = useState<ModalType>('Add')

    const getData = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await laboratoryMaterialRepository.getAll({
                page: currentPage,
                per_page: dataFetch == 'all' ? 99999 : perPage,
                search: searchTerm,
                sort_by: sortBy,
                sort_direction: sortDirection,
                filter_ruangan_lab: selectedRuanganLaboratorium ?? ''
            })
            setData(response.data?.data ?? [])
            setTotalPages(response.data?.last_page ?? 0)
            setTotalItems(response.data?.total ?? 0)
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [currentPage, dataFetch, perPage, searchTerm, sortBy, sortDirection])

    useEffect(() => {
        getData()
    }, [currentPage, perPage, sortBy, sortDirection])

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

    const openModal = (modalType: ModalType, id?: number) => {
        setType(modalType)
        setEditData(id)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditData(null)
    }

    const handleSave = async (formData: LaboratoryMaterialInputDTO): Promise<void> => {
        let res
        if (editData) {
            res = await laboratoryMaterialRepository.updateData(editData, formData)
        } else {
            res = await laboratoryMaterialRepository.createData(formData)
        }

        closeModal()
        getData()
        await Swal.fire({
            title: 'Success!',
            text: res?.message,
            icon: 'success'
        })
    }

    const handleDelete = async (id: number): Promise<void> => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })

        if (result.isConfirmed) {
            try {
                const res = await laboratoryMaterialRepository.deleteData(id)
                Swal.fire('Deleted!', res.message, 'success')
                setIsLoading(true)
                getData()
            } catch (error) {
                console.error('Error deleting data:', error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleFilterRuanganLaboratorium = (e: ChangeEvent<HTMLSelectElement>) => {
        setselectedRuanganLaboratorium(Number(e.target.value))
        setCurrentPage(1)
    } 

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handlePerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setPerPage(Number(e.target.value))
        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleSortChange = (field: string) => {
        if (sortBy === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(field)
            setSortDirection('asc')
        }
    }

    return {
        isLoading,
        data,
        currentPage,
        perPage,
        totalPages,
        totalItems,
        searchTerm,
        sortDirection,
        isModalOpen,
        editData,
        type,
        selectedRuanganLaboratorium,

        handleSearch,
        handlePerPageChange,
        handlePageChange,
        handleSortChange,
        openModal,
        closeModal,
        handleSave,
        handleDelete,
        handleFilterRuanganLaboratorium
    }
}

export default useLaboratoryMaterial
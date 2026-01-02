import useTable from "@/application/hooks/useTable"
import { LaboratoryEquipmentView } from "@/application/laboratory-equipment/LaboratoryEquipmentView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useDebounce } from "@/presentation/hooks/useDebounce"
import { useCallback, useEffect, useState } from "react"

interface useLaboratoryEquipmentDataTableProps {
    filter_laboratory_room: number
    perPage?: number
}

export const useLaboratoryEquipmentDataTable = ({
    filter_laboratory_room,
    perPage: customPerPage
}: useLaboratoryEquipmentDataTableProps) => {
    const { laboratoryEquipmentService } = useDepedencies()

    const table = useTable()
    const {
        currentPage,
        perPage,
        searchTerm,

        setTotalPages,
        setTotalItems,
        setCurrentPage,
        setPerPage,
    } = table

    // Set custom perPage if provided
    useEffect(() => {
        if (customPerPage) {
            setPerPage(customPerPage)
        }
    }, [customPerPage, setPerPage])

    const [laboratoryEquipments, setLaboratoryEquipments] = useState<LaboratoryEquipmentView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const debounceSearchTerm = useDebounce(searchTerm, 500)

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await laboratoryEquipmentService.getLaboratoryEquipmentData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            filter_laboratory_room: filter_laboratory_room
        })
        setLaboratoryEquipments(response.data ?? [])
        setTotalItems(response.total ?? 0)
        setTotalPages(response.last_page ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, filter_laboratory_room, laboratoryEquipmentService, searchTerm, setTotalItems, setTotalPages])

    useEffect(() => {
        getData();
    }, [getData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debounceSearchTerm, setCurrentPage]);

    const refresh = useCallback(() => {
        getData()
    }, [getData])

    return {
        ...table,
        isLoading,
        laboratoryEquipments,
        refresh
    }
}
import useTable from '@/application/hooks/useTable'
import { TestingRequestView } from '@/application/testing-request/TestingRequestView'
import { useDepedencies } from '@/presentation/contexts/useDepedencies'
import { useDebounce } from '@/presentation/hooks/useDebounce'
import { useCallback, useEffect, useState } from 'react'

interface useTestingRequestDataTableProps {
    status: string
}

export const useTestingRequestDataTable = ({
    status
}: useTestingRequestDataTableProps) => {
    const { testingRequestService } = useDepedencies()
    const table = useTable()
    const {
        currentPage,
        perPage,
        searchTerm,

        setTotalPages,
        setTotalItems,
        setCurrentPage,
    } = table

    const [testingRequests, setTestingRequests] = useState<TestingRequestView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const debounceSearchTerm = useDebounce(searchTerm, 500)

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await testingRequestService.getTestingRequestData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            filter_status: status
        })
        setTestingRequests(response.data ?? [])
        setTotalItems(response.total ?? 0)
        setTotalPages(response.last_page ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, debounceSearchTerm, status])

    useEffect(() => {
        getData()
    }, [getData])

    useEffect(() => {
        setCurrentPage(1)
    }, [debounceSearchTerm])

    const refresh = useCallback(() => {
        getData()
    }, [getData])

    return {
        ...table,
        isLoading,
        testingRequests,
        refresh
    }
}

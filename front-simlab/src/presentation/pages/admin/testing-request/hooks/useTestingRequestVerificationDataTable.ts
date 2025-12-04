import useTable from "@/application/hooks/useTable"
import { TestingRequestView } from "@/application/testing-request/TestingRequestView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useDebounce } from "@/presentation/hooks/useDebounce"
import { useCallback, useEffect, useState } from "react"

interface useTestingRequestVerificationDataTableProps {
    filter_status: string,
}

export const useTestingRequestVerificationDataTable = ({
    filter_status
}: useTestingRequestVerificationDataTableProps) => {
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
        const response = await testingRequestService.getTestingRequestForVerification({
            page: currentPage ?? 1,
            per_page: perPage ?? 10,
            search: searchTerm ?? "",
            filter_status: filter_status
        })

        setTestingRequests(response.data ?? [])
        setTotalPages(response.last_page ?? 0)
        setTotalItems(response.total ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, searchTerm, filter_status, setTotalPages, setTotalItems])

    useEffect(() => {
        getData();
    }, [getData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debounceSearchTerm]);

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
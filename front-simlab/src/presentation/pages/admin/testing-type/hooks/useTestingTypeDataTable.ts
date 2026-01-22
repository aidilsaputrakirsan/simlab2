import useTable from "@/application/hooks/useTable"
import { TestingTypeView } from "@/application/testing-type/TestingTypeView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useDebounce } from "@/presentation/hooks/useDebounce"
import { useCallback, useEffect, useState } from "react"

interface useTestingTypeDataTable {
    filter_testing_category: number
}

export const useTestingTypeDataTable = ({
    filter_testing_category
}: useTestingTypeDataTable) => {
    const { testingTypeService } = useDepedencies()

    const table = useTable()
    const {
        currentPage,
        perPage,
        searchTerm,

        setTotalPages,
        setTotalItems,
        setCurrentPage,
    } = table

    const [testingTypes, setTestingTypes] = useState<TestingTypeView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const debounceSearchTerm = useDebounce(searchTerm, 500)

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await testingTypeService.getTestingTypeData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            filter_testing_category: filter_testing_category
        })
        setTestingTypes(response.data ?? [])
        setTotalItems(response.total ?? 0)
        setTotalPages(response.last_page ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, debounceSearchTerm, filter_testing_category])

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
        testingTypes,
        refresh
    }
}
import useTable from "@/application/hooks/useTable"
import { PaymentView } from "@/application/payment/PaymentView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useDebounce } from "@/presentation/hooks/useDebounce"
import { useCallback, useState, useEffect } from "react"

export const usePaymentDataTable = () => {
    const {paymentService}  = useDepedencies()
    const table = useTable()
    const {
        currentPage,
        perPage,
        searchTerm,

        setTotalPages,
        setTotalItems,
        setCurrentPage,
    } = table

    const [payments, setPayments] = useState<PaymentView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const debounceSearchTerm = useDebounce(searchTerm, 500)
    
        const getData = useCallback(async () => {
            setIsLoading(true)
            const response = await paymentService.getPayments({
                page: currentPage ?? 1,
                per_page: perPage ?? 10,
                search: searchTerm ?? "",
            })
    
            setPayments(response.data ?? [])
            setTotalPages(response.last_page ?? 0)
            setTotalItems(response.total ?? 0)
            setIsLoading(false)
        }, [currentPage, perPage, searchTerm, setTotalPages, setTotalItems])
    
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
            payments,
            refresh
        }
}
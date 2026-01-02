import { ChangeEvent, useState } from "react"

const useTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [perPage, setPerPage] = useState<number>(10)
    const [totalPages, setTotalPages] = useState<number>(0)
    const [totalItems, setTotalItems] = useState<number>(0)
    const [searchTerm, setSearchTerm] = useState<string>('')


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

    return {
        currentPage,
        perPage,
        totalPages,
        totalItems,
        searchTerm,

        setTotalPages,
        setTotalItems,
        setCurrentPage,
        setPerPage,

        handleSearch,
        handlePerPageChange,
        handlePageChange,
    }

}

export default useTable
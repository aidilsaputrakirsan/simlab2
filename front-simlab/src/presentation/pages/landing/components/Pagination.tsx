import React from 'react'

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    handlePageChange: (page: number) => void;
    className: string
}

const Pagination = ({
    totalPages,
    currentPage,
    handlePageChange,
    className
}: PaginationProps) => {
    const renderPaginationButtons = () => {
        const buttons = []
        const maxButtonsToShow = 5

        // Always show first page
        buttons.push(
            <button
                key="first"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 mx-1 rounded ${currentPage === 1 ? 'bg-warning text-white' : 'bg-white text-warnibg-warning hover:bg-warning/50 hover:text-white'}`}
            >
                1
            </button>
        )

        // Calculate range of buttons to show
        const startPage = Math.max(2, currentPage - Math.floor(maxButtonsToShow / 2))
        const endPage = Math.min(totalPages - 1, startPage + maxButtonsToShow - 3)

        // Adjust if we're near the beginning
        if (startPage > 2) {
            buttons.push(<span key="ellipsis1" className="px-2">...</span>)
        }

        // Middle buttons
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 mx-1 rounded ${currentPage === i ? 'bg-warning text-white' : 'bg-white text-warnibg-warning hover:bg-warning/50 hover:text-white'}`}
                >
                    {i}
                </button>
            )
        }

        // Ellipsis before last page if needed
        if (endPage < totalPages - 1) {
            buttons.push(<span key="ellipsis2" className="px-2">...</span>)
        }

        // Always show last page if there is more than one page
        if (totalPages > 1) {
            buttons.push(
                <button
                    key="last"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 mx-1 rounded ${currentPage === totalPages ? 'bg-warning text-white' : 'bg-white text-warnibg-warning hover:bg-warning/50 hover:text-white'}`}
                >
                    {totalPages}
                </button>
            )
        }

        return buttons
    }
    return (
        <div className={`flex flex-col items-center justify-end mt-6 md:flex-row ${className}`}>
            <div className="flex flex-wrap justify-center">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 mx-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Previous
                </button>

                <div className="flex mx-1">
                    {renderPaginationButtons()}
                </div>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 mx-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default Pagination
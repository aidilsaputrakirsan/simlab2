import React from 'react'


interface ColumnDef<T> {
    header: string;
    accessor: keyof T | ((data: T) => React.ReactNode);
    sortable?: boolean;
    width?: string;
    cellRenderer?: (value: any, item: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    pagination?: boolean;
    pageSize?: number;
    className?: string;
    tableClassName?: string;
    headerClassName?: string;
    rowClassName?: string;
    cellClassName?: string;
    onRowClick?: (row: T, index: number) => void;
    loading?: boolean;
    emptyMessage?: string;
    searchTerm: string;
    handleSearch: () => void;
    perPage: number;
    handlePerPageChange: () => void;
    totalPages: number;
    totalItems: number;
    currentPage: number;
    handlePageChange: (page) => void;
    handleSortChange: (field) => void;
    sortDirection: 'asc' | 'desc'
}

const Table = ({
    data,
    columns,
    pagination = false,
    pageSize = 10,
    className = '',
    tableClassName = '',
    headerClassName = '',
    rowClassName = '',
    cellClassName = '',
    onRowClick,
    loading = false,
    emptyMessage = 'No data available',
    searchTerm,
    handleSearch,
    perPage,
    handlePerPageChange,
    totalPages,
    totalItems,
    currentPage,
    handlePageChange,
    handleSortChange,
    sortDirection
}: TableProps<T>) => {
    console.log(data);
    const renderCellValue = (item: T, column: ColumnDef<T>, index: number) => {
        if (column.cellRenderer) {
            const accessorValue = typeof column.accessor === 'function'
                ? column.accessor(item)
                : item[column.accessor as keyof T];
            return column.cellRenderer(accessorValue, item, index);
        }

        if (typeof column.accessor === 'function') {
            return column.accessor(item);
        }

        const value = item[column.accessor as keyof T];

        // Handle different data types
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);

        return value.toString();
    };

    const renderPaginationButtons = () => {
        const buttons = []
        const maxButtonsToShow = 5

        // Always show first page
        buttons.push(
            <button
                key="first"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 mx-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
            >
                1
            </button>
        )

        // Calculate range of buttons to show
        const startPage = Math.max(2, currentPage - Math.floor(maxButtonsToShow / 2))
        const endPage = Math.min(totalPages - 1, startPage + maxButtonsToShow - 3)

        console.log(startPage, endPage);
        

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
                    className={`px-3 py-1 mx-1 rounded ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
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
                    className={`px-3 py-1 mx-1 rounded ${currentPage === totalPages ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                >
                    {totalPages}
                </button>
            )
        }

        return buttons
    }

    const renderSortIndicator = (column: ColumnDef<T>) => {
        if (!column.sortable || typeof column.accessor === 'function') return null;
        
        if (sortDirection === 'asc') return ' ↑';
        if (sortDirection === 'desc') return ' ↓';
        
        return ' ⇅';
      };

    return (
        <>
            <div className="flex flex-wrap items-center justify-between mb-6">
                <div className="w-full md:w-1/3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari tahun akademik..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <svg
                            className="absolute w-5 h-5 text-gray-400 right-3 top-2.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>

                <div className="flex items-center mt-4 space-x-2 md:mt-0">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select
                        value={perPage}
                        onChange={handlePerPageChange}
                        className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                            >
                                <div className="flex items-center">
                                    No
                                </div>
                            </th>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={headerClassName}
                                    style={{ width: column.width || 'auto', cursor: column.sortable ? 'pointer' : 'default' }}
                                    onClick={() => column.sortable && handleSortChange(column.accessor)}
                                >
                                    {column.header}
                                    {column.sortable && typeof column.accessor !== 'function' && renderSortIndicator(column)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                    Loading data...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            data.map((item, rowIndex) => (
                                <>
                                    <tr
                                        key={rowIndex}
                                        className={rowClassName}
                                        onClick={() => onRowClick && onRowClick(item, rowIndex)}
                                        style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                                    >
                                        <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
                                            {rowIndex + 1}
                                        </td>
                                        {columns.map((column, cellIndex) => (
                                            <td key={cellIndex} className={cellClassName}>
                                                {renderCellValue(item, column, rowIndex)}
                                            </td>
                                        ))}
                                    </tr>
                                </>

                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col items-center justify-between mt-6 md:flex-row">
                <div className="mb-4 text-sm text-gray-600 md:mb-0">
                    Showing <span className="font-medium">{data.length}</span> of{" "}
                    <span className="font-medium">{totalItems}</span> items
                </div>

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
        </>
    )
}

export default Table

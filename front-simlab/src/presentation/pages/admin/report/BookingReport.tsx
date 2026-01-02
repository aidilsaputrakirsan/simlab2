import Header from '@/presentation/components/Header'
import MainContent from '@/presentation/components/MainContent'
import Table from '@/presentation/components/Table'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import React, { useEffect, useState } from 'react'
import { useBookingDataTable } from '../booking/hooks/useBookingDataTable'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import { BookingReportColumn } from '../booking/column/BookingReportColumn'
import { Button } from '@/presentation/components/ui/button'
import { useDepedencies } from '@/presentation/contexts/useDepedencies'

const ExportButtons: React.FC = () => {
    const { bookingService } = useDepedencies()
    const [isLoading, setIsLoading] = useState(false)

    const handleExport = async (type: 'room' | 'equipment' | 'material' | 'all') => {
        try {
            setIsLoading(true)
            await bookingService.exportReport(type, 'xlsx')
        } catch (error) {
            console.error('Export failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex gap-2">
            <Button variant="secondary" onClick={() => handleExport('all')} disabled={isLoading}>
                {isLoading ? 'Exporting...' : 'Export Semua (Excel)'}
            </Button>
            <Button onClick={() => handleExport('room')} disabled={isLoading}>
                {isLoading ? 'Exporting...' : 'Export Ruangan (Excel)'}
            </Button>
            <Button onClick={() => handleExport('equipment')} disabled={isLoading}>
                {isLoading ? 'Exporting...' : 'Export Alat (Excel)'}
            </Button>
            <Button onClick={() => handleExport('material')} disabled={isLoading}>
                {isLoading ? 'Exporting...' : 'Export Bahan (Excel)'}
            </Button>
        </div>
    )
}

const BookingReportPage = () => {
    const [selectedStatus, setSelectedStatus] = useState<string>('')
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedStatus])

    const {
        bookings,
        isLoading,
        searchTerm,

        // TableHandler
        perPage,
        handleSearch,
        handlePageChange,
        handlePerPageChange,
        totalItems,
        totalPages,
        currentPage,
        setCurrentPage,
        refresh
    } = useBookingDataTable({ status: selectedStatus })
    return (
        <>
            <Header title='Menu Tahun Akademik' />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Laporan Peminjaman</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full mb-3 md:w-1/3">
                            <div className="relative">
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem value=" ">All</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <ExportButtons />
                        </div>

                        <Table
                            data={bookings}
                            columns={BookingReportColumn()}
                            loading={isLoading}
                            searchTerm={searchTerm}
                            handleSearch={(e) => handleSearch(e)}
                            perPage={perPage}
                            handlePerPageChange={(e) => handlePerPageChange(e)}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange}
                            handleRefresh={refresh} />
                    </CardContent>
                </Card>
            </MainContent>
        </>
    )
}

export default BookingReportPage
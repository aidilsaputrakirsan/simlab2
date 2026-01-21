import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import { useEffect, useRef, useState } from 'react'
import Header from '@/presentation/components/Header';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Plus } from 'lucide-react';
import { BookingColumn } from './column/BookingColumn';
import Table from '@/presentation/components/Table';
import { NavLink } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/presentation/components/ui/tooltip';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import { useBookingDataTable } from './hooks/useBookingDataTable';
import { useBooking } from './context/BookingContext';
import ApproveDialog from '@/presentation/components/custom/ApproveDialog';
import { useBookingVerification } from './hooks/useBookingVerification';
import { usePaymentHandler } from '../payment/hooks/usePaymentHandler';
import PaymentProofFormDialog from '../payment/components/PaymentProofFormDialog';

const BookingPage = () => {
    const sectionRef = useRef<HTMLDivElement | null>(null)

    useGSAP(() => {
        if (!sectionRef.current) return

        const tl = gsap.timeline()
        tl.fromTo(sectionRef.current,
            {
                opacity: 0,
                y: 100
            },
            {
                opacity: 1,
                y: 0,
                duration: 1
            },
        )
    }, [])

    const [selectedStatus, setSelectedStatus] = useState<string>('')
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedStatus])

    const { isHasDraftBooking } = useBooking()

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

    const {
        dialogs,
        // openers
        openReturnConfirmation,
        // closers
        closeReturnConfirmation,
        // actions
        handleReturnConfirmation
    } = useBookingVerification(bookings, refresh)

    // Payment proof handler
    const {
        selectedPayment,
        dialogs: paymentDialogs,
        openPaymentProof,
        closePaymentProof,
        handleStorePaymentProof
    } = usePaymentHandler(refresh)

    return (
        <>
            <Header title="Menu Peminjaman" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Peminjaman</CardTitle>
                        <CardAction>
                            {isHasDraftBooking ? (
                                <>
                                    <Tooltip>
                                        <TooltipTrigger className='cursor-not-allowed' asChild>
                                            <Button className={'opacity-50'}>
                                                Tambah
                                                <Plus />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Harap Selesaikan Peminjaman Sebelumnya</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </>
                            ) : (
                                <>
                                    <NavLink to={'/panel/peminjaman/create'}>
                                        <Button>
                                            Tambah
                                            <Plus />
                                        </Button>
                                    </NavLink>
                                </>
                            )}

                        </CardAction>
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
                        <Table
                            data={bookings}
                            columns={BookingColumn({ openReturnConfirmation, openPaymentProof })}
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
            </div>
            <ApproveDialog
                open={dialogs.returnConfirmation}
                onOpenChange={closeReturnConfirmation}
                handleSave={handleReturnConfirmation}
                title='Konfirmasi Pengembalian'
                message='Apakah anda yakin ingin melakukan konfirmasi pengembalian?'
            />
            <PaymentProofFormDialog
                open={paymentDialogs.paymentProof}
                onOpenChange={closePaymentProof}
                handleSave={handleStorePaymentProof}
                paymentId={selectedPayment}
            />
        </>
    )
}

export default BookingPage

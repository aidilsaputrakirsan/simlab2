import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import Table from '@/presentation/components/Table';
import { BookingVerificationColumn } from '../column/BookingVerificationColumn';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import { useBookingVerificationDataTable } from '../hooks/useBookingVerificationDataTable';
import { userRole } from '@/domain/User/UserRole';
import RejectionDialog from '@/presentation/components/custom/RejectionDialog';
import ApproveDialog from '@/presentation/components/custom/ApproveDialog';
import { useBookingVerification } from '../hooks/useBookingVerification';
import ApproveEquipmentDialog from '@/presentation/components/custom/ApproveEquipmentDialog';

const LaboranBookingApproval = () => {

    const sectionRef = useRef<HTMLDivElement | null>(null)

    // Animation
    useGSAP(() => {
        if (!sectionRef.current) return
        gsap.fromTo(
            sectionRef.current,
            { opacity: 0, y: 100 },
            { opacity: 1, y: 0, duration: 1 }
        )
    }, [])

    // Filter
    const [selectedStatus, setSelectedStatus] = useState<string>('')
    useEffect(() => {
        setCurrentPage(1)
    }, [selectedStatus])

    // DataTable Hook
    const {
        bookings,
        isLoading,
        searchTerm,
        refresh,
        perPage,
        handleSearch,
        handlePageChange,
        handlePerPageChange,
        totalItems,
        totalPages,
        currentPage,
        setCurrentPage
    } = useBookingVerificationDataTable({ filter_status: selectedStatus })

    // Optimized Booking Verification Hook
    const {
        dialogs,
        approvalType,

        // openers
        openLaboranApproval,
        openRejection,
        openReturnVerification,
        openReturnConfirmation,

        // closers
        closeLaboranApproval,
        closeRejection,
        closeReturnVerification,
        closeReturnConfirmation,

        // actions
        handleLaboranApproval,
        handleRejection,
        handleEquipmentApproval,
        handleReturnVerification,
    } = useBookingVerification(bookings, refresh)

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
            <Card>
                <CardHeader>
                    <CardTitle>Menu Verifikasi Peminjaman</CardTitle>
                </CardHeader>
                <CardContent>

                    {/* Filter */}
                    <div className="w-full mb-3 md:w-1/3">
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

                    {/* Table */}
                    <Table
                        data={bookings}
                        columns={BookingVerificationColumn({
                            role: userRole.Laboran,
                            openApproval: openLaboranApproval,
                            openRejection,
                            openReturnVerification,
                            openReturnConfirmation
                        })}
                        loading={isLoading}
                        searchTerm={searchTerm}
                        handleSearch={handleSearch}
                        perPage={perPage}
                        handlePerPageChange={handlePerPageChange}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        currentPage={currentPage}
                        handlePageChange={handlePageChange}
                        handleRefresh={refresh}
                    />
                </CardContent>
            </Card>

            {/* Dialogs */}
            <RejectionDialog
                open={dialogs.rejection}
                onOpenChange={closeRejection}
                handleRejection={handleRejection}
            />

            {approvalType === 'equipment_approve' ? (
                <>
                    <ApproveEquipmentDialog
                        open={dialogs.LaboranApproval}
                        onOpenChange={closeLaboranApproval}
                        handleSave={handleEquipmentApproval}
                    />

                    <ApproveDialog
                        open={dialogs.returnVerification}
                        onOpenChange={closeReturnVerification}
                        handleSave={handleReturnVerification}
                        title='Verifikasi Pengembalian'
                        message='Apakah anda yakin ingin melakukan verifikasi pengembalian?'
                    />

                    <ApproveDialog
                        open={dialogs.returnConfirmation}
                        onOpenChange={closeReturnConfirmation}
                        handleSave={handleReturnVerification}
                        title='Konfirmasi Pengembalian'
                        message='Apakah anda yakin ingin melakukan konfirmasi pengembalian?'
                    />
                </>
            ) : (
                <ApproveDialog
                    open={dialogs.LaboranApproval}
                    onOpenChange={closeLaboranApproval}
                    handleSave={handleLaboranApproval}
                />
            )}
        </div>
    )
}

export default LaboranBookingApproval

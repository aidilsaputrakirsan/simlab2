import { usePaymentDataTable } from './hooks/usePaymentDataTable'
import Header from '@/presentation/components/Header'
import MainContent from '@/presentation/components/MainContent'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import Table from '@/presentation/components/Table'
import PaymentCreateFormDialog from './components/PaymentCreateFormDialog'
import { usePaymentHandler } from './hooks/usePaymentHandler'
import { PaymentColumn } from './columns/PaymentColumn'
import { useTestingRequestVerification } from '../testing-request/hooks/useTestingRequestVerification'
import { useBookingVerificationForPayment } from '../booking/hooks/useBookingVerificationForPayment'
import RejectionDialog from '@/presentation/components/custom/RejectionDialog'
import ApproveWithLaboranSelectDialog from '@/presentation/components/custom/ApproveWithLaboranSelectDialog'
import PaymentApprovalDialog from './components/PaymentApprovalDialog'
import PaymentProofFormDialog from './components/PaymentProofFormDialog'
import { useAuthContext } from '@/presentation/contexts/AuthContext'
import { useState } from 'react'

const PaymentPage = () => {
    const { user } = useAuthContext()
    
    // Track which type of verification is being performed
    const [verificationType, setVerificationType] = useState<'testing_request' | 'booking' | null>(null)
    
    // Payment Data Table
    const {
        payments,
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
    } = usePaymentDataTable()

    // Payment Handler
    const {
        selectedPayment,
        selectedPaymentData,
        dialogs: paymentDialogs,
        openCreatePayment,
        openApproval,
        openRejection,
        openReuploadProof,
        closeCreatePayment,
        closeApproval,
        closeRejection,
        closeReuploadProof,
        handleCreatePayment,
        handleApproval,
        handleRejection,
        handleReuploadPaymentProof
    } = usePaymentHandler(refresh)

    // Testing Request Verification Handler (for payable verification)
    const {
        dialogs: testingVerifDialogs,
        openKepalaLabApproval: openTestingKepalaLabApproval,
        openRejection: openTestingVerifRejection,
        closeKepalaLabApproval: closeTestingKepalaLabApproval,
        closeRejection: closeTestingVerifRejection,
        handleKepalaLabApproval: handleTestingKepalaLabApproval,
        handleRejection: handleTestingVerifRejection
    } = useTestingRequestVerification(refresh)

    // Booking Verification Handler (for payable verification)
    const {
        dialogs: bookingVerifDialogs,
        openKepalaLabApproval: openBookingKepalaLabApproval,
        openRejection: openBookingVerifRejection,
        closeKepalaLabApproval: closeBookingKepalaLabApproval,
        closeRejection: closeBookingVerifRejection,
        handleKepalaLabApproval: handleBookingKepalaLabApproval,
        handleRejection: handleBookingVerifRejection
    } = useBookingVerificationForPayment(refresh)

    // Wrapper functions to track verification type
    const handleOpenVerification = (payableId: number, paymentCategory: string) => {
        if (paymentCategory === 'testing_request') {
            setVerificationType('testing_request')
            openTestingKepalaLabApproval(payableId)
        } else if (paymentCategory === 'booking') {
            setVerificationType('booking')
            openBookingKepalaLabApproval(payableId)
        }
    }

    const handleOpenVerificationRejection = (payableId: number, paymentCategory: string) => {
        if (paymentCategory === 'testing_request') {
            setVerificationType('testing_request')
            openTestingVerifRejection(payableId)
        } else if (paymentCategory === 'booking') {
            setVerificationType('booking')
            openBookingVerifRejection(payableId)
        }
    }

    // Determine which dialog is open
    const isApprovalDialogOpen = testingVerifDialogs.KepalaLabApproval || bookingVerifDialogs.KepalaLabApproval
    const isRejectionDialogOpen = testingVerifDialogs.rejection || bookingVerifDialogs.rejection

    const handleCloseApprovalDialog = () => {
        if (verificationType === 'testing_request') {
            closeTestingKepalaLabApproval()
        } else if (verificationType === 'booking') {
            closeBookingKepalaLabApproval()
        }
        setVerificationType(null)
    }

    const handleCloseRejectionDialog = () => {
        if (verificationType === 'testing_request') {
            closeTestingVerifRejection()
        } else if (verificationType === 'booking') {
            closeBookingVerifRejection()
        }
        setVerificationType(null)
    }

    const handleApprovalSubmit = async (laboran_id: number, information: string) => {
        if (verificationType === 'testing_request') {
            await handleTestingKepalaLabApproval(laboran_id, information)
        } else if (verificationType === 'booking') {
            await handleBookingKepalaLabApproval(laboran_id, information)
        }
        setVerificationType(null)
    }

    const handleRejectionSubmit = async (information: string) => {
        if (verificationType === 'testing_request') {
            await handleTestingVerifRejection(information)
        } else if (verificationType === 'booking') {
            await handleBookingVerifRejection(information)
        }
        setVerificationType(null)
    }

    return (
        <>
            <Header title='Menu Pembayaran' />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Manajemen Pembayaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={payments}
                            columns={PaymentColumn({ 
                                openCreatePayment, 
                                openApproval, 
                                openRejection,
                                openVerification: handleOpenVerification,
                                openVerificationRejection: handleOpenVerificationRejection,
                                openReuploadProof,
                                currentUserId: user?.id
                            })}
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
            {/* Verification dialogs */}
            <RejectionDialog open={isRejectionDialogOpen} onOpenChange={handleCloseRejectionDialog} handleRejection={handleRejectionSubmit} />
            <ApproveWithLaboranSelectDialog open={isApprovalDialogOpen} onOpenChange={handleCloseApprovalDialog} handleSave={handleApprovalSubmit} />
            
            {/* Payment dialogs */}
            <PaymentCreateFormDialog open={paymentDialogs.createPayment} onOpenChange={closeCreatePayment} handleSave={handleCreatePayment} />
            <PaymentApprovalDialog 
                open={paymentDialogs.approval} 
                onOpenChange={closeApproval} 
                onConfirm={handleApproval}
                payment={selectedPaymentData}
                isRejection={false}
            />
            <PaymentApprovalDialog 
                open={paymentDialogs.rejection} 
                onOpenChange={closeRejection} 
                onConfirm={handleRejection}
                payment={selectedPaymentData}
                isRejection={true}
            />
            <PaymentProofFormDialog
                open={paymentDialogs.reuploadProof}
                onOpenChange={closeReuploadProof}
                handleSave={handleReuploadPaymentProof}
                paymentId={selectedPayment}
            />
        </>
    )
}

export default PaymentPage
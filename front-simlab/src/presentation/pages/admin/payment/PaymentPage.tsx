import { usePaymentDataTable } from './hooks/usePaymentDataTable'
import Header from '@/presentation/components/Header'
import MainContent from '@/presentation/components/MainContent'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import Table from '@/presentation/components/Table'
import PaymentCreateFormDialog from './components/PaymentCreateFormDialog'
import { usePaymentHandler } from './hooks/usePaymentHandler'
import { PaymentColumn } from './columns/PaymentColumn'
import { useTestingRequestVerification } from '../testing-request/hooks/useTestingRequestVerification'
import RejectionDialog from '@/presentation/components/custom/RejectionDialog'
import ApproveWithLaboranSelectDialog from '@/presentation/components/custom/ApproveWithLaboranSelectDialog'
import PaymentApprovalDialog from './components/PaymentApprovalDialog'
import PaymentProofFormDialog from './components/PaymentProofFormDialog'
import { useAuthContext } from '@/presentation/contexts/AuthContext'

const PaymentPage = () => {
    const { user } = useAuthContext()
    
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
        dialogs: verificationDialogs,
        openKepalaLabApproval,
        openRejection: openVerifRejection,
        closeKepalaLabApproval,
        closeRejection: closeVerifRejection,
        handleKepalaLabApproval,
        handleRejection: handleVerifRejection
    } = useTestingRequestVerification(refresh)

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
                                openVerification: openKepalaLabApproval,
                                openVerificationRejection: openVerifRejection,
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
            <RejectionDialog open={verificationDialogs.rejection} onOpenChange={closeVerifRejection} handleRejection={handleVerifRejection} />
            <ApproveWithLaboranSelectDialog open={verificationDialogs.KepalaLabApproval} onOpenChange={closeKepalaLabApproval} handleSave={handleKepalaLabApproval} />
            
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
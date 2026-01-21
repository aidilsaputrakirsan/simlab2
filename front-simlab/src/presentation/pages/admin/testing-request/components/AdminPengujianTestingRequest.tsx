import Header from '@/presentation/components/Header'
import MainContent from '@/presentation/components/MainContent'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import React, { useEffect, useState } from 'react'
import { useTestingRequestVerificationDataTable } from '../hooks/useTestingRequestVerificationDataTable';
import Table from '@/presentation/components/Table';
import { TestingRequestPaymentColumn } from '../columns/TestingRequestPaymentColumn';
import { usePaymentHandler } from '../../payment/hooks/usePaymentHandler';
import PaymentCreateFormDialog from '../../payment/components/PaymentCreateFormDialog';
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { TestingRequestVerificationColumn } from '../columns/TestingRequestVerificationColumn';
import { useTestingRequestVerification } from '../hooks/useTestingRequestVerification';
import RejectionDialog from '@/presentation/components/custom/RejectionDialog';
import ApproveWithLaboranSelectDialog from '@/presentation/components/custom/ApproveWithLaboranSelectDialog';

const AdminPengujianTestingRequest: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  
  const {
    testingRequests,
    isLoading,
    searchTerm,
    refresh,

    // TableHandler
    perPage,
    handleSearch,
    handlePageChange,
    handlePerPageChange,
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
  } = useTestingRequestVerificationDataTable({ filter_status: selectedStatus })

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedStatus, setCurrentPage])

  // Payment handlers for approved testing requests
  const {
    dialogs: paymentDialogs,
    // openers
    openCreatePayment,
    openApproval: openPaymentApproval,
    openRejection: openPaymentRejection,
    // closers
    closeCreatePayment,
    closeApproval: closePaymentApproval,
    closeRejection: closePaymentRejection,
    // action
    handleCreatePayment,
    handleApproval: handlePaymentApproval,
    handleRejection: handlePaymentRejection
  } = usePaymentHandler(refresh)

  // Verification handlers for pending testing requests
  const {
    dialogs: verificationDialogs,
    // openers
    openKepalaLabApproval,
    openRejection: openVerifRejection,
    // closers
    closeKepalaLabApproval,
    closeRejection: closeVerifRejection,
    // action
    handleKepalaLabApproval,
    handleRejection: handleVerifRejection
  } = useTestingRequestVerification(refresh)

  // Show payment column for approved requests, verification column for pending requests
  const showPaymentActions = selectedStatus === 'approved'
  
  return (
    <>
      <Header title='Menu Pengujian' />
      <MainContent>
        <Card>
          <CardHeader>
            <CardTitle>Menu Verifikasi Pengujian & Pembayaran</CardTitle>
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
                      <SelectItem value=" ">Semua</SelectItem>
                      <SelectItem value="pending">Menunggu Verifikasi</SelectItem>
                      <SelectItem value="approved">Disetujui (Kelola Pembayaran)</SelectItem>
                      <SelectItem value="rejected">Ditolak</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Table
              data={testingRequests}
              columns={showPaymentActions 
                ? TestingRequestPaymentColumn({ openCreatePayment, openApproval: openPaymentApproval, openRejection: openPaymentRejection })
                : TestingRequestVerificationColumn({ openApproval: openKepalaLabApproval, openRejection: openVerifRejection })
              }
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
      {/* Payment dialogs */}
      <PaymentCreateFormDialog open={paymentDialogs.createPayment} onOpenChange={closeCreatePayment} handleSave={handleCreatePayment} />
      <ConfirmationDialog open={paymentDialogs.approval} onOpenChange={closePaymentApproval} onConfirm={handlePaymentApproval} />
      <ConfirmationDialog open={paymentDialogs.rejection} onOpenChange={closePaymentRejection} onConfirm={handlePaymentRejection} />
      
      {/* Verification dialogs */}
      <RejectionDialog open={verificationDialogs.rejection} onOpenChange={closeVerifRejection} handleRejection={handleVerifRejection} />
      <ApproveWithLaboranSelectDialog open={verificationDialogs.KepalaLabApproval} onOpenChange={closeKepalaLabApproval} handleSave={handleKepalaLabApproval} />
    </>
  )
}

export default AdminPengujianTestingRequest
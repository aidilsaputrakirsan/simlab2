import Header from '@/presentation/components/Header'
import MainContent from '@/presentation/components/MainContent'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import React from 'react'
import { useTestingRequestVerificationDataTable } from '../hooks/useTestingRequestVerificationDataTable';
import Table from '@/presentation/components/Table';
import { TestingRequestPaymentColumn } from '../columns/TestingRequestPaymentColumn';
import { usePaymentHandler } from '../../payment/hooks/usePaymentHandler';
import PaymentCreateFormDialog from '../../payment/components/PaymentCreateFormDialog';
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog';

const AdminPengujianTestingRequest: React.FC = () => {
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
  } = useTestingRequestVerificationDataTable({ filter_status: 'approved' })

  const {
    dialogs,
    // openers
    openCreatePayment,
    openApproval,
    openRejection,
    // closers
    closeCreatePayment,
    closeApproval,
    closeRejection,
    // action
    handleCreatePayment,
    handleApproval,
    handleRejection
  } = usePaymentHandler(refresh)
  return (
    <>
      <Header title='Menu Pengujian' />
      <MainContent>
        <Card>
          <CardHeader>
            <CardTitle>Menu Verifikasi Pembayaran Pengujian</CardTitle>
          </CardHeader>
          <CardContent>
            <Table
              data={testingRequests}
              columns={TestingRequestPaymentColumn({ openCreatePayment, openApproval, openRejection })}
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
      <PaymentCreateFormDialog open={dialogs.createPayment} onOpenChange={closeCreatePayment} handleSave={handleCreatePayment} />
      <ConfirmationDialog open={dialogs.approval} onOpenChange={closeApproval} onConfirm={handleApproval} />
      <ConfirmationDialog open={dialogs.rejection} onOpenChange={closeRejection} onConfirm={handleRejection} />
    </>
  )
}

export default AdminPengujianTestingRequest
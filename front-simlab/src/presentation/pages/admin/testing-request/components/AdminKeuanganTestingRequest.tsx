import Header from '@/presentation/components/Header'
import MainContent from '@/presentation/components/MainContent'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import { useTestingRequestVerificationDataTable } from '../hooks/useTestingRequestVerificationDataTable';
import Table from '@/presentation/components/Table';
import { TestingRequestPaymentColumn } from '../columns/TestingRequestPaymentColumn';

const AdminKeuanganTestingRequest: React.FC = () => {
    const [selectedStatus, setSelectedStatus] = useState<string>('')
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedStatus])

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
  return (
    <>
      <Header title='Menu Pengujian' />
      <MainContent>
        <Card>
          <CardHeader>
            <CardTitle>Menu Verifikasi Peminjaman</CardTitle>
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
              data={testingRequests}
              columns={TestingRequestPaymentColumn()}
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

export default AdminKeuanganTestingRequest
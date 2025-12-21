import Header from '@/presentation/components/Header'
import MainContent from '@/presentation/components/MainContent'
import { Button } from '@/presentation/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTestingRequestDataTable } from './hooks/useTestingRequestDataTable';
import Table from '@/presentation/components/Table';
import { TestingRequestColumn } from './columns/TestingRequestColumn';
import { NavLink } from 'react-router-dom';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import PaymentProofFormDialog from '../payment/components/PaymentProofFormDialog';
import { usePaymentHandler } from '../payment/hooks/usePaymentHandler';

const TestingRequestPage = () => {
    const [selectedStatus, setSelectedStatus] = useState<string>('')
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedStatus])

    const {
        testingRequests,
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
    } = useTestingRequestDataTable({ status: selectedStatus })

    const {
        selectedPayment,
        dialogs,
        // openers
        openPaymentProof,
        // closers
        closePaymentProof,
        // action
        handleStorePaymentProof,
      } = usePaymentHandler(refresh)

    return (
        <>
            <Header title='Menu Pengujian' />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Pengujian</CardTitle>
                        <CardAction>
                            <NavLink to={'/panel/pengujian/create'}>
                                <Button>
                                    Tambah
                                    <Plus />
                                </Button>
                            </NavLink>
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
                            data={testingRequests}
                            columns={TestingRequestColumn({openPayment: openPaymentProof})}
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
            <PaymentProofFormDialog paymentId={selectedPayment} open={dialogs.paymentProof} onOpenChange={closePaymentProof} handleSave={handleStorePaymentProof}/>
        </>
    )
}

export default TestingRequestPage
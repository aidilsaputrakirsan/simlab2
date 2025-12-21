import { useAuth } from '@/application/hooks/useAuth'
import { userRole } from '@/domain/User/UserRole'
import Header from '@/presentation/components/Header'
import MainContent from '@/presentation/components/MainContent'
import { Button } from '@/presentation/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { TestingRequestView } from '@/application/testing-request/TestingRequestView'
import { useDepedencies } from '@/presentation/contexts/useDepedencies'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import Item from '@/presentation/components/Item'
import { Badge } from '@/presentation/components/ui/badge'
import TestingRequestBadgeStatus from './components/TestingRequestBadgeStatus'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/presentation/components/ui/table';
import { MoneyView } from '@/application/money/MoneyView';
import TestingRequestStepperDialog from './components/TestingRequestStepperDialog'
import { PaymentStatus } from '@/domain/payment/PaymentStatus'
import PaymentDetailDialog from '../payment/components/PaymentDetailDialog'

const TestingRequestDetailPage = () => {
    const { user } = useAuth()
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const testingRequestId = Number(id);
    const backTo =
        user?.role && [userRole.Laboran, userRole.KepalaLabTerpadu, userRole.AdminPengujian].includes(user.role)
            ? '/panel/pengujian/verif'
            : '/panel/pengujian';

    const [testingRequest, setTestingRequest] = useState<TestingRequestView>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { testingRequestService } = useDepedencies()
    useEffect(() => {
        const getTestingRequestData = async () => {
            setIsLoading(true)
            try {
                const res = await testingRequestService.getTestingRequestDetail(testingRequestId)

                setTestingRequest(res.data)
            } catch (error: any) {
                if (error.code == 404) {
                    navigate('/404')
                } else if (error.code == 403) {
                    navigate('/404')
                }
            } finally {
                setIsLoading(false)
            }
        }

        getTestingRequestData()
    }, [])

    if (isLoading || !testingRequest) return (
        <>
            <Header title="Detail Peminjaman" />
            <div className="flex flex-col gap-4 p-4 pt-0">
                <div className="flex flex-col gap-4 animate-pulse">
                    <Skeleton className="h-8 w-1/3 mb-2" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="h-64 w-full" />
                        <div className="flex flex-col gap-4">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <Header title='Detail Pengajuan Pengujian' />
            <MainContent>
                <div className="flex items-center justify-between flex-col-reverse sm:flex-row mb-2 gap-2">
                    <TestingRequestStepperDialog testingRequestId={testingRequestId} />
                    <div></div>
                    <Button className="gap-2 w-full sm:w-fit" onClick={() => navigate(backTo)}>
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Button>
                </div>
                <div className='flex flex-col gap-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Umum</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 text-sm gap-4">
                                {testingRequest.requestor && (
                                    <>
                                        <Item title='Nama Pemohon' value={testingRequest.requestor.name} />
                                        <Item title='Email Pemohon' value={testingRequest.requestor.email} />
                                        {testingRequest.requestor.studyProgram && (
                                            <Item title='Program Studi' value={testingRequest.requestor.studyProgram} />
                                        )}
                                        {testingRequest.requestor.institution && (
                                            <Item title='Asal Institusi' value={testingRequest.requestor.institution} />
                                        )}
                                    </>
                                )}
                                <Item title='Dosen Pembimbing' value={testingRequest.supervisor} />
                                <Item title='Email Dosen Pembimbing' value={testingRequest.supervisorEmail} />
                                {testingRequest.laboran && (
                                    <>
                                        <Item title='Laboran Penanggung Jawab' value={testingRequest.laboran.name} />
                                        <Item title='Email Laboran' value={testingRequest.laboran.email} />
                                    </>
                                )}
                                <div className="flex flex-col">
                                    <span className='font-semibold'>Waktu Pengujian</span>
                                    <Badge variant={'secondary'} className='whitespace-normal'>{`${testingRequest.testingTime.formatForInformation()}`}</Badge>
                                </div>
                                <div className="flex flex-col">
                                    <span className='font-semibold'>Status Pengajuan</span>
                                    <TestingRequestBadgeStatus status={testingRequest.status} />
                                </div>
                                {testingRequest.paymentStatus !== PaymentStatus.Draft && testingRequest.paymentId && (
                                    <div className="flex flex-col">
                                        <span className='font-semibold'>Pembayaran</span>
                                        <PaymentDetailDialog paymentId={testingRequest.paymentId}/>
                                    </div>
                                )}
                                <div className='flex flex-col md:col-span-2'>
                                    <span className='font-semibold'>Daftar Pengujian</span>
                                    <div className='border rounded-lg overflow-hidden'>
                                        <Table>
                                            <TableHeader className='bg-primary hover:bg-primary/80 group'>
                                                <TableRow>
                                                    <TableHead className='text-white group-hover:text-secondary'>No</TableHead>
                                                    <TableHead className='text-white group-hover:text-secondary'>Jenis Pengujian</TableHead>
                                                    <TableHead className='text-white group-hover:text-secondary'>Kuantitas Pengujian</TableHead>
                                                    <TableHead className='text-white group-hover:text-secondary'>Tarif Pengujian</TableHead>
                                                    <TableHead className='text-white group-hover:text-secondary'>Total</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {testingRequest.testingRequestItems.map((item, sidx) => (
                                                    <TableRow key={sidx}>
                                                        <TableCell>{sidx + 1}</TableCell>
                                                        <TableCell>{item.name}</TableCell>
                                                        <TableCell>{item.quantity} per/{item.unit}</TableCell>
                                                        <TableCell>{item.price.formatToIDR()}</TableCell>
                                                        <TableCell>{MoneyView.toViewModel(item.price.amount * item.quantity).formatToIDR()}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-right font-semibold">Total</TableCell>
                                                    <TableCell>
                                                        {MoneyView.toViewModel(
                                                            testingRequest.testingRequestItems.reduce((sum, it) => sum + (it.price?.amount ?? 0) * (it.quantity ?? 0), 0)
                                                        ).formatToIDR()}
                                                    </TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </MainContent>
        </>
    )
}

export default TestingRequestDetailPage
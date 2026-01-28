import { useAuth } from '@/application/hooks/useAuth'
import { userRole } from '@/domain/User/UserRole'
import Header from '@/presentation/components/Header'
import MainContent from '@/presentation/components/MainContent'
import { Button } from '@/presentation/components/ui/button'
import { ArrowLeft, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
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
import PaymentProofFormDialog from '../payment/components/PaymentProofFormDialog'
import { PaymentInputProofDTO } from '@/application/payment/dto/PaymentDTO'
import { toast } from 'sonner'
import ReportUploadDialog from './components/ReportUploadDialog'
import { Eye } from 'lucide-react'

const TestingRequestDetailPage = () => {
    const { user } = useAuth()
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const testingRequestId = Number(id);
    const backTo =
        user?.role && [userRole.Laboran, userRole.KepalaLabTerpadu].includes(user.role)
            ? '/panel/pengujian/verif'
            : user?.role === userRole.AdminPengujian
                ? '/panel/pembayaran'
                : '/panel/pengujian';

    const [testingRequest, setTestingRequest] = useState<TestingRequestView>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isReuploadDialogOpen, setIsReuploadDialogOpen] = useState<boolean>(false)
    const [isReportDialogOpen, setIsReportDialogOpen] = useState<boolean>(false)

    const { testingRequestService, paymentService } = useDepedencies()

    const handleReuploadPaymentProof = async (data: PaymentInputProofDTO) => {
        if (!testingRequest?.paymentId) return

        const res = await paymentService.storePaymentProof(testingRequest.paymentId, data)
        toast.success(res.message)
        setIsReuploadDialogOpen(false)
        // Refresh the testing request data
        const refreshedData = await testingRequestService.getTestingRequestDetail(testingRequestId)
        setTestingRequest(refreshedData.data)
    }

    const handleUploadReport = async (file: File) => {
        try {
            await testingRequestService.uploadReport(testingRequestId, file)
            toast.success("Berhasil mengupload laporan pengujian")
            // Refresh data
            const res = await testingRequestService.getTestingRequestDetail(testingRequestId)
            setTestingRequest(res.data)
            setIsReportDialogOpen(false)
        } catch (error: any) {
            toast.error(error.message || "Gagal mengupload laporan")
        }
    }

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

    // Logic to show upload button (Laboran only)
    const canUploadReport =
        user?.role === userRole.Laboran &&
        testingRequest.laboran?.id === user?.id &&
        testingRequest.status === 'approved' &&
        (!testingRequest.paymentId || testingRequest.paymentStatus === 'approved' || testingRequest.paymentStatus === 'paid' || testingRequest.paymentStatus === 'verified');

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
                                {testingRequest.laboran && ![userRole.Mahasiswa, userRole.Dosen, userRole.PihakLuar].includes(user?.role as userRole) && (
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
                                        <div className="flex gap-2 flex-wrap">
                                            <PaymentDetailDialog paymentId={testingRequest.paymentId} />
                                            {testingRequest.paymentStatus === PaymentStatus.Rejected &&
                                                user?.email === testingRequest.requestor?.email && (
                                                    <Button
                                                        variant="outline"
                                                        className="w-full sm:w-fit"
                                                        onClick={() => setIsReuploadDialogOpen(true)}
                                                    >
                                                        <Upload className="h-4 w-4 mr-1" />
                                                        Upload Ulang Bukti
                                                    </Button>
                                                )}
                                        </div>
                                        {testingRequest.paymentStatus === PaymentStatus.Rejected &&
                                            user?.email === testingRequest.requestor?.email && (
                                                <Badge variant="destructive" className="mt-2 w-fit">Pembayaran Ditolak - Silakan upload ulang bukti pembayaran</Badge>
                                            )}
                                    </div>
                                )}
                                <PaymentProofFormDialog
                                    open={isReuploadDialogOpen}
                                    onOpenChange={setIsReuploadDialogOpen}
                                    handleSave={handleReuploadPaymentProof}
                                    paymentId={testingRequest.paymentId}
                                />
                                <ReportUploadDialog
                                    open={isReportDialogOpen}
                                    onOpenChange={setIsReportDialogOpen}
                                    onConfirm={handleUploadReport}
                                />

                                {/* Report Section */}
                                {(testingRequest.resultFile || canUploadReport) && (
                                    <div className="flex flex-col md:col-span-2 gap-2 p-4 border rounded-md bg-slate-50 dark:bg-slate-900/50">
                                        <span className='font-semibold'>Hasil Pengujian</span>
                                        <div className="flex gap-4 items-center">
                                            {testingRequest.resultFile ? (
                                                <a
                                                    href={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/storage/${testingRequest.resultFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button variant="outline" className="gap-2">
                                                        <Eye className="w-4 h-4" />
                                                        Lihat Laporan Hasil Pengujian (PDF)
                                                    </Button>
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground italic text-sm">Belum ada laporan yang diupload</span>
                                            )}

                                            {canUploadReport && (
                                                <Button onClick={() => setIsReportDialogOpen(true)} className="gap-2 w-fit">
                                                    <Upload className="w-4 h-4" />
                                                    {testingRequest.resultFile ? 'Update Laporan' : 'Upload Laporan'}
                                                </Button>
                                            )}
                                        </div>
                                        {testingRequest.resultFile && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Untuk pengambilan hardcopy hasil pengujian, silakan datang ke Laboratorium Terpadu 2 Lt. 2 di Ruang Administrasi.
                                            </p>
                                        )}
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
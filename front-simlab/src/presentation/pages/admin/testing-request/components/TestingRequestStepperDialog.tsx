import { useAuth } from '@/application/hooks/useAuth'
import { TestingRequestApprovalView } from '@/application/testing-request/TestingRequestApprovalView'
import { TestingRequestApprovalAction } from '@/domain/testing-request/TestingRequestApprovalAction'
import { TestingRequestApprovalStatus } from '@/domain/testing-request/TestingRequestApprovalStatus'
import { userRole } from '@/domain/User/UserRole'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/presentation/components/ui/dialog'
import { ScrollArea } from '@/presentation/components/ui/scroll-area'
import { Separator } from '@/presentation/components/ui/separator'
import { useDepedencies } from '@/presentation/contexts/useDepedencies'
import { CheckCircle, Info, InfoIcon, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface TestingRequestStepperDialogProps {
    testingRequestId: number
}

const TestingRequestStepperDialog: React.FC<TestingRequestStepperDialogProps> = ({
    testingRequestId
}) => {
    const { user } = useAuth()
    const [testingRequestSteps, setTestingRequestSteps] = useState<TestingRequestApprovalView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const isPemohon = [userRole.Mahasiswa, userRole.Dosen, userRole.PihakLuar].includes(user?.role as userRole)
    const { testingRequestService } = useDepedencies()

    useEffect(() => {
        const loadSteps = async () => {
            setIsLoading(true)
            const res = await testingRequestService.getTestingRequestApprovals(testingRequestId)
            setTestingRequestSteps(res.data || [])
            setIsLoading(false)
        }

        loadSteps()
    }, [])

    const getStepperStatus = (steps: TestingRequestApprovalStatus) => {
        switch (steps) {
            case TestingRequestApprovalStatus.Approved:
                return (
                    <div className='absolute left-0 top-3.5 flex size-4 items-center justify-center rounded-full bg-green-600 text-white'>
                        <CheckCircle />
                    </div>
                )
            case TestingRequestApprovalStatus.Rejected:
                return (
                    <div className='absolute left-0 top-3.5 flex size-4 items-center justify-center rounded-full bg-red-600 text-white'>
                        <X />
                    </div>
                )
            case TestingRequestApprovalStatus.Revision:
                return (
                    <div></div>
                )
            default:
                return (
                    <div className='absolute left-0 top-3.5 flex size-4 items-center justify-center rounded-full bg-gray-600 text-white'>
                        <InfoIcon />
                    </div>
                )
        }
    }

    const renderStepperBadge = (step: TestingRequestApprovalStatus) => {
        switch (step) {
            case TestingRequestApprovalStatus.Approved:
                return (<span className="self-center text-[10px] tracking-wide px-2 py-0.5 rounded-full font-semibold bg-green-100 text-green-700">APPROVED</span>)
            case TestingRequestApprovalStatus.Rejected:
                return (<span className="self-center text-[10px] tracking-wide px-2 py-0.5 rounded-full font-semibold bg-red-100 text-red-700">REJECTED</span>)
            case TestingRequestApprovalStatus.Revision:
                return (<span className="self-center text-[10px] tracking-wide px-2 py-0.5 rounded-full font-semibold bg-yellow-100 text-yellow-700">REVISION</span>)
            default:
                return (<span className="self-center text-[10px] tracking-wide px-2 py-0.5 rounded-full font-semibold bg-gray-100 text-gray-700">PENDING</span>)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled={isLoading} className='w-full sm:w-fit'>
                    <Info />
                    {isLoading ? 'Loading...' : 'Proses Pengajuan'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Proses Pengajuan</DialogTitle>
                    <DialogDescription>
                        Lihat tahapan dan status persetujuan pengajuan Anda di bawah ini.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className='h-full max-h-[70vh] lg:max-h-[75vh]'>
                    <div className="relative mx-auto">
                        {testingRequestSteps.map((step, index) => (
                            <div key={index} className="relative pl-8 pb-8">
                                {testingRequestSteps.length > index + 1 && (
                                    <Separator
                                        orientation="vertical"
                                        className="bg-muted absolute left-2 top-4"
                                    />
                                )}
                                {getStepperStatus(step.status)}
                                <div className='flex flex-col'>
                                    <span className="pt-2 text-lg font-bold tracking-tight flex items-center gap-2">
                                        {step.formatedRoleLabel()} {step.action !== TestingRequestApprovalAction.Finish && renderStepperBadge(step.status)}
                                    </span>
                                    {step.action !== TestingRequestApprovalAction.Finish ? (
                                        <>
                                            <div className='text-sm text-muted-foreground'>{step.description}</div>
                                            {(step.status !== TestingRequestApprovalStatus.Pending) ? (
                                                <>

                                                    {!(isPemohon && step.role === 'laboran') && (
                                                        <div className="text-sm mt-2">
                                                            <span className='font-semibold'>
                                                                {step.role === 'pemohon' ? 'Diajukan oleh' : 'Diverifikasi oleh'}
                                                            </span>
                                                            : {step.approver ?? '—'}
                                                        </div>
                                                    )}
                                                    <span className="text-sm text-muted-foreground rounded-xl tracking-tight">
                                                        {step.approvedAt ? String(step.approvedAt.formatForInformation()) : ''}
                                                    </span>
                                                    {step.action !== TestingRequestApprovalAction.RequestTesting && (
                                                        <div className='flex flex-col mt-2'>
                                                            <span className='text-sm font-semibold'>
                                                                {step.status === TestingRequestApprovalStatus.Rejected ? 'Alasan: ' : 'Catatan:'}
                                                            </span>
                                                            <span className='text-sm'>
                                                                {step.information || 'Tidak ada catatan'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <span className='text-sm'>
                                                    Menunggu Persetujuan...
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <span className='text-sm text-muted-foreground'>
                                            Pengajuan akan dinyatakan selesai setelah semua tahap disetujui.
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Tutup</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default TestingRequestStepperDialog
import { PracticumApprovalView } from '@/application/practicum-scheduling/PracticumApprovalView';
import { PracticumApprovalAction } from '@/domain/practicum-scheduling/PracticumApprovalAction';
import { PracticumApprovalStatus } from '@/domain/practicum-scheduling/PracticumApprovalStatus';
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/presentation/components/ui/dialog'
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import { Separator } from '@/presentation/components/ui/separator';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import { CheckCircle, Info, InfoIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PracticumSchedulingStepperDialogProps {
    practicumSchedulingId: number
}

const PracticumSchedulingStepperDialog: React.FC<PracticumSchedulingStepperDialogProps> = ({
    practicumSchedulingId
}) => {
    const [practicumSteps, setPracticumSteps] = useState<PracticumApprovalView[]>([])
    const [practicumStepsLoading, setPracticumStepsLoading] = useState<boolean>(false)
    const { practicumSchedulingService } = useDepedencies()

    useEffect(() => {
        const loadSteps = async () => {
            setPracticumStepsLoading(true);
            const res = await practicumSchedulingService.getTestingRequestApprovals(practicumSchedulingId);
            setPracticumSteps(res.data || []);
            setPracticumStepsLoading(false);
        };
        loadSteps();
    }, [practicumSchedulingId]);

    const getStepperStatus = (steps: PracticumApprovalStatus) => {
        switch (steps) {
            case PracticumApprovalStatus.Approved:
                return (
                    <div className='absolute left-0 top-3.5 flex size-4 items-center justify-center rounded-full bg-green-600 text-white'>
                        <CheckCircle />
                    </div>
                )
            case PracticumApprovalStatus.Rejected:
                return (
                    <div className='absolute left-0 top-3.5 flex size-4 items-center justify-center rounded-full bg-red-600 text-white'>
                        <X />
                    </div>
                )
            case PracticumApprovalStatus.Revision:
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

    const renderStepperBadge = (step: PracticumApprovalStatus) => {
        switch (step) {
            case PracticumApprovalStatus.Approved:
                return (<span className="self-center text-[10px] tracking-wide px-2 py-0.5 rounded-full font-semibold bg-green-100 text-green-700">APPROVED</span>)
            case PracticumApprovalStatus.Rejected:
                return (<span className="self-center text-[10px] tracking-wide px-2 py-0.5 rounded-full font-semibold bg-red-100 text-red-700">REJECTED</span>)
            case PracticumApprovalStatus.Revision:
                return (<span className="self-center text-[10px] tracking-wide px-2 py-0.5 rounded-full font-semibold bg-yellow-100 text-yellow-700">REVISION</span>)
            default:
                return (<span className="self-center text-[10px] tracking-wide px-2 py-0.5 rounded-full font-semibold bg-gray-100 text-gray-500">PENDING</span>)
        }
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button disabled={practicumStepsLoading} className='w-full sm:w-fit'>
                        <Info />
                        {practicumStepsLoading ? 'Loading...' : 'Proses Pengajuan'}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Proses Pengajuan</DialogTitle>
                        <DialogDescription>
                            Lihat tahapan dan status persetujuan pengajuan Anda di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className='h-full max-h-[70vh]'>
                        <div className="relative mx-auto">
                            {practicumSteps.map((step, index) => (
                                <div key={index} className="relative pl-8 pb-8">
                                    {practicumSteps.length > index + 1 && (
                                        <Separator
                                            orientation="vertical"
                                            className="dark:bg-foreground/30 absolute left-2 top-4"
                                        />
                                    )}
                                    {getStepperStatus(step.status)}
                                    <div className='flex flex-col'>
                                        <span className="pt-2 text-lg font-bold tracking-tight flex items-center gap-2">
                                            {step.formatedRoleLabel()} {step.action !== PracticumApprovalAction.Finish && renderStepperBadge(step.status)}
                                        </span>
                                        {step.action !== PracticumApprovalAction.Finish ? (
                                            <>
                                                <div className='text-sm text-muted-foreground'>{step.description}</div>
                                                {(step.status !== PracticumApprovalStatus.Pending) ? (
                                                    <>

                                                        <div className="text-sm mt-2">
                                                            <span className='font-semibold'>
                                                                {step.role === 'pemohon' ? 'Diajukan oleh' : 'Diverifikasi oleh'}
                                                            </span>
                                                            : {step.approver ?? '—'}
                                                        </div>
                                                        <span className="text-sm text-muted-foreground rounded-xl tracking-tight">
                                                            {step.approvedAt ? String(step.approvedAt.formatForInformation()) : ''}
                                                        </span>
                                                        {step.action !== PracticumApprovalAction.RequestTesting && (
                                                            <div className='flex flex-col mt-2'>
                                                                <span className='text-sm font-semibold'>
                                                                    {step.status === PracticumApprovalStatus.Rejected ? 'Alasan: ' : 'Catatan:'}
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
        </>
    )
}

export default PracticumSchedulingStepperDialog


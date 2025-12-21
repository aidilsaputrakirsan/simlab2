import React, { useEffect, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/presentation/components/ui/dialog'
import { Button } from '@/presentation/components/ui/button'
import { Eye, Receipt } from 'lucide-react'
import { useDepedencies } from '@/presentation/contexts/useDepedencies'
import { PaymentView } from '@/application/payment/PaymentView'
import Item from '@/presentation/components/Item'
import PaymentBadgeStatus from './PaymentBadgeStatus.tsx'

interface PaymentDetailDialogProps {
    paymentId: number
}

const PaymentDetailDialog: React.FC<PaymentDetailDialogProps> = ({
    paymentId
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { paymentService } = useDepedencies()
    const [payment, setPayment] = useState<PaymentView>()

    useEffect(() => {
        const loadSteps = async () => {
            setIsLoading(true)
            const res = await paymentService.getPaymentData(paymentId)
            setPayment(res.data)
            setIsLoading(false)
        }

        loadSteps()
    }, [])
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled={isLoading} className='w-full sm:w-fit'>
                    <Receipt />
                    {isLoading ? 'Loading...' : 'Pembayaran'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Data Pembayaran</DialogTitle>
                    <DialogDescription>
                        Lihat data dari pembayaran anda di bawah ini.
                    </DialogDescription>
                </DialogHeader>
                {payment && (
                    <div className="flex flex-col gap-5">
                        <Item title='Payment Number' value={payment?.paymentNumber} />
                        <Item title='VA Number' value={payment?.vaNumber} />
                        <Item title='Total Amount' value={payment?.amount.formatToIDR()} />
                        <div className={`flex flex-col`}>
                            <span className='font-semibold'>File Invoice</span>
                            {payment?.invoiceFile ? (
                                <a href={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/${payment.invoiceFile}`} className='w-full' target='_blank'>
                                    <Button className='w-full'>Open File <Eye /></Button>
                                </a>
                            ) : (
                                <Button variant={'secondary'}>N/A</Button>
                            )}
                        </div>
                        <div className={`flex flex-col`}>
                            <span className='font-semibold'>Payment Proof</span>
                            {payment?.paymentProof ? (
                                <a href={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/${payment.paymentProof}`} className='w-full' target='_blank'>
                                    <Button className='w-full'>Open File <Eye /></Button>
                                </a>
                            ) : (
                                <Button variant={'secondary'}>N/A</Button>
                            )}
                        </div>
                        <div className={`flex flex-col`}>
                            <span className='font-semibold'>Status</span>
                            <PaymentBadgeStatus status={payment?.status} />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Tutup</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PaymentDetailDialog
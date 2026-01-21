import { useEffect, useState } from 'react'
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
        const loadPayment = async () => {
            setIsLoading(true)
            const res = await paymentService.getPaymentData(paymentId)
            setPayment(res.data)
            setIsLoading(false)
        }

        loadPayment()
    }, [paymentId])

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
                    <div className="flex flex-col gap-4 my-4">
                        <Item title='Nomor Pembayaran' value={payment?.paymentNumber || "-"} />
                        <Item title='Nomor Virtual Account' value={payment?.vaNumber || "-"} />
                        <Item title='Total Pembayaran' value={payment?.amount?.formatToIDR() || "-"} />
                        
                        {payment.user && (
                            <>
                                <Item title="Nama Pemohon" value={payment.user.name || "-"} />
                                <Item title="Email" value={payment.user.email || "-"} />
                            </>
                        )}

                        <div className="flex flex-col">
                            <span className='font-semibold'>File Invoice</span>
                            {payment?.invoiceFile ? (
                                <a 
                                    href={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/${payment.invoiceFile}`} 
                                    className='w-full' 
                                    target='_blank'
                                    rel="noopener noreferrer"
                                >
                                    <Button className='w-full' type="button" variant="outline">
                                        Lihat File <Eye className="ml-2 h-4 w-4" />
                                    </Button>
                                </a>
                            ) : (
                                <Button variant="secondary" disabled>N/A</Button>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className='font-semibold'>Bukti Pembayaran</span>
                            {payment?.paymentProof ? (
                                <a 
                                    href={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/${payment.paymentProof}`} 
                                    className='w-full' 
                                    target='_blank'
                                    rel="noopener noreferrer"
                                >
                                    <Button className='w-full' type="button" variant="outline">
                                        Lihat File <Eye className="ml-2 h-4 w-4" />
                                    </Button>
                                </a>
                            ) : (
                                <Button variant="secondary" disabled>N/A</Button>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className='font-semibold'>Status</span>
                            <PaymentBadgeStatus status={payment?.status} />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Tutup</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PaymentDetailDialog
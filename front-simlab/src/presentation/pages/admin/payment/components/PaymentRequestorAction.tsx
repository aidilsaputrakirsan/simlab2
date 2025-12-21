import { PaymentStatus } from '@/domain/payment/PaymentStatus'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'

interface PaymentRequestorActionProps<T extends {
    hasPaidItems?: boolean
    paymentStatus?: PaymentStatus
    isPaymentProofHasUploaded?: boolean
    paymentId?: number
}> {
    data: T
    onOpenPayment?: (paymentId: number) => void
}

const PaymentRequestorAction = <T extends {
    hasPaidItems?: boolean
    paymentStatus?: PaymentStatus
    isPaymentProofHasUploaded?: boolean
    paymentId?: number
}>({
    data,
    onOpenPayment
}: PaymentRequestorActionProps<T>) => {
    if (data.hasPaidItems) {
        switch (data.paymentStatus) {
            case PaymentStatus.Draft:
                return <Badge variant={"outline"}>Menunggu Penerbitan Pembayaran</Badge>
            case PaymentStatus.Pending:
                if (data.isPaymentProofHasUploaded) {
                    return <Badge>Menunggu Persetujuan</Badge>
                }
                return <Button size="sm" onClick={() => onOpenPayment?.(data.paymentId ?? 0)}>Kirim Bukti Pembayaran</Button>

            case PaymentStatus.Approved:
                return <Badge variant={'success'}>Disetujui</Badge>

            case PaymentStatus.Rejected:
                return <Badge variant={'destructive'}>Ditolak</Badge>

            default:
                break;
        }
    }
    return <div>-</div>
}

export default PaymentRequestorAction
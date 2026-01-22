import { PaymentStatus } from '@/domain/payment/PaymentStatus'
import { TestingRequestStatus } from '@/domain/testing-request/TestingRequestStatus'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'

interface PaymentApproverActionProps<T extends {
  hasPaidItems?: boolean
  status?: TestingRequestStatus
  paymentStatus?: PaymentStatus
  isPaymentProofHasUploaded?: boolean
  id?: number
}> {
  data: T
  onOpenCreatePayment?: (id: number) => void
  onOpenApproval?: (id: number) => void
  onOpenRejection?: (id: number) => void
}

const PaymentApproverAction = <T extends {
  hasPaidItems?: boolean
  status?: TestingRequestStatus
  paymentStatus?: PaymentStatus
  isPaymentProofHasUploaded?: boolean
  id?: number
}>({
  data,
  onOpenCreatePayment,
  onOpenApproval,
  onOpenRejection
}: PaymentApproverActionProps<T>) => {
  if (data.hasPaidItems && data.status === TestingRequestStatus.Approved) {
    switch (data.paymentStatus) {
      case PaymentStatus.Draft:
        return (
          <Button size="sm" onClick={() => onOpenCreatePayment?.(data.id ?? 0)}>
            Terbitkan Pembayaran
          </Button>
        )

      case PaymentStatus.Pending:
        if (data.isPaymentProofHasUploaded) {
          return (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => onOpenApproval?.(data.id ?? 0)}>
                Terima
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onOpenRejection?.(data.id ?? 0)}>
                Tolak
              </Button>
            </div>
          )
        }
        return <Badge>Menunggu Pemohon mengirim bukti pembayaran</Badge>

      case PaymentStatus.Approved:
        return <Badge variant={'success'}>Disetujui</Badge>

      case PaymentStatus.Rejected:
        return <Badge variant={'destructive'}>Ditolak</Badge>

      default:
        break
    }
  }

  return <Badge>Menunggu Persetujuan Laboran</Badge>
}

export default PaymentApproverAction
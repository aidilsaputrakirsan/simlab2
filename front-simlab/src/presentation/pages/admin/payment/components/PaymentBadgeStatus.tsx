import { PaymentStatus } from '@/domain/payment/PaymentStatus'
import { Badge } from '@/presentation/components/ui/badge'

interface PaymentBadgeStatusProps {
    status: PaymentStatus
}

const PaymentBadgeStatus = ({status}: PaymentBadgeStatusProps) => {
  switch (status) {
    case PaymentStatus.Draft:
        return (
            <Badge variant={'secondary'}>Draft</Badge>
        )
    case PaymentStatus.Pending:
        return (
            <Badge variant={'default'}>Pending</Badge>
        )

    case PaymentStatus.Approved:
        return (
            <Badge variant={'success'}>Disetujui</Badge>
        )

    case PaymentStatus.Rejected:
        return (
            <Badge variant={'destructive'}>Ditolak</Badge>
        )
    }
}

export default PaymentBadgeStatus
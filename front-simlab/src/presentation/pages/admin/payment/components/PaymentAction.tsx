import { PaymentView } from "@/application/payment/PaymentView";
import { PaymentStatus } from "@/domain/payment/PaymentStatus";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";

interface PaymentActionProps {
    payment: PaymentView;
    onOpenCreatePayment: (id: number) => void;
    onOpenApproval: (id: number) => void;
    onOpenRejection: (id: number) => void;
}

const PaymentAction = ({
    payment,
    onOpenCreatePayment,
    onOpenApproval,
    onOpenRejection
}: PaymentActionProps) => {
    if (payment.status === PaymentStatus.Draft) {
        return (
            <Button size="sm" onClick={() => onOpenCreatePayment(payment.id)}>
                Terbitkan Pembayaran
            </Button>
        );
    }

    if (payment.status === PaymentStatus.Pending && payment.paymentProof) {
        return (
            <div className="flex gap-2">
                <Button size="sm" onClick={() => onOpenApproval(payment.id)}>
                    Terima
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onOpenRejection(payment.id)}>
                    Tolak
                </Button>
            </div>
        );
    }

    if (payment.status === PaymentStatus.Pending && !payment.paymentProof) {
        return <Badge variant="outline">Menunggu Bukti Pembayaran</Badge>;
    }

    if (payment.status === PaymentStatus.Approved) {
        return <Badge variant="default">Selesai</Badge>;
    }

    if (payment.status === PaymentStatus.Rejected) {
        return <Badge variant="destructive">Ditolak</Badge>;
    }

    return <>-</>;
};

export default PaymentAction;

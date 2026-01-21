import { PaymentView } from "@/application/payment/PaymentView";
import { PaymentStatus } from "@/domain/payment/PaymentStatus";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { Upload } from "lucide-react";

interface PaymentActionProps {
    payment: PaymentView;
    onOpenCreatePayment: (id: number) => void;
    onOpenApproval: (id: number) => void;
    onOpenRejection: (id: number) => void;
    onOpenReuploadProof?: (id: number) => void;
    // Verification actions for payable (e.g., testing request)
    onOpenVerification?: (payableId: number) => void;
    onOpenVerificationRejection?: (payableId: number) => void;
    // User role check - if user is the owner/requestor
    isOwner?: boolean;
}

const PaymentAction = ({
    payment,
    onOpenCreatePayment,
    onOpenApproval,
    onOpenRejection,
    onOpenReuploadProof,
    onOpenVerification,
    onOpenVerificationRejection,
    isOwner = false
}: PaymentActionProps) => {
    // If payable status is pending and user can verify (canVerif === 1), show verification actions
    if (payment.payableStatus === 'pending' && payment.canVerif === 1) {
        return (
            <div className="flex gap-2">
                <Button size="sm" onClick={() => onOpenVerification?.(payment.payableId)}>
                    Verifikasi
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onOpenVerificationRejection?.(payment.payableId)}>
                    Tolak
                </Button>
            </div>
        );
    }

    // If payable status is pending but user cannot verify yet (waiting for other verification)
    if (payment.payableStatus === 'pending' && payment.canVerif === 2) {
        return <Badge variant="outline">Menunggu Verifikasi Laboran</Badge>;
    }

    // If payable status is pending and already verified by this user
    if (payment.payableStatus === 'pending' && payment.canVerif === 0) {
        return <Badge variant="secondary">Sudah Diverifikasi</Badge>;
    }

    // If payable status is rejected
    if (payment.payableStatus === 'rejected' || payment.canVerif === 3) {
        return <Badge variant="destructive">Pengajuan Ditolak</Badge>;
    }

    // Payable is approved - show payment actions
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
        // If the user is the owner/requestor, show re-upload button
        if (isOwner && onOpenReuploadProof) {
            return (
                <div className="flex flex-col gap-2 items-start">
                    <Badge variant="destructive">Ditolak</Badge>
                    <Button size="sm" variant="outline" onClick={() => onOpenReuploadProof(payment.id)}>
                        <Upload className="h-4 w-4 mr-1" />
                        Upload Ulang
                    </Button>
                </div>
            );
        }
        return <Badge variant="destructive">Ditolak</Badge>;
    }

    return <>-</>;
};

export default PaymentAction;

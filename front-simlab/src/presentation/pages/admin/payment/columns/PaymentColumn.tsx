import { PaymentView } from "@/application/payment/PaymentView";
import { PaymentStatus } from "@/domain/payment/PaymentStatus";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { NavLink } from "react-router-dom";
import PaymentAction from "../components/PaymentAction";

interface ColumnProps {
    openCreatePayment: (id: number) => void;
    openApproval: (id: number, paymentData?: PaymentView) => void;
    openRejection: (id: number, paymentData?: PaymentView) => void;
    openVerification?: (payableId: number) => void;
    openVerificationRejection?: (payableId: number) => void;
    openReuploadProof?: (id: number) => void;
    currentUserId?: number;
}

const PaymentStatusBadge = ({ status, payableStatus }: { status: PaymentStatus, payableStatus?: string | null }) => {
    // If payable is still pending, show that status instead
    if (payableStatus === 'pending') {
        return <Badge variant="outline">Menunggu Verifikasi Pengajuan</Badge>;
    }
    if (payableStatus === 'rejected') {
        return <Badge variant="destructive">Pengajuan Ditolak</Badge>;
    }

    const statusConfig: Record<PaymentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
        [PaymentStatus.Draft]: { label: "Draft", variant: "secondary" },
        [PaymentStatus.Pending]: { label: "Menunggu Verifikasi", variant: "outline" },
        [PaymentStatus.Approved]: { label: "Disetujui", variant: "default" },
        [PaymentStatus.Rejected]: { label: "Ditolak", variant: "destructive" },
    };

    const config = statusConfig[status] || { label: status, variant: "secondary" as const };

    return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getPaymentDetailUrl = (paymentCategory: string, payableId: number): string | null => {
    const routes: Record<string, string> = {
        'testing_request': `/panel/pengujian/${payableId}/detail`,
        'booking': `/panel/peminjaman/${payableId}/detail`,
    };

    return routes[paymentCategory] || null;
};

export const PaymentColumn = ({ openCreatePayment, openApproval, openRejection, openVerification, openVerificationRejection, openReuploadProof, currentUserId }: ColumnProps): ColumnDef<PaymentView>[] => [
    {
        header: "No. Pembayaran",
        accessorKey: "paymentNumber",
        cell: ({ row }) => row.original.paymentNumber || "-"
    },
    {
        header: "Jenis Pembayaran",
        accessorKey: "paymentType",
        cell: ({ row }) => (
            <Badge variant="secondary">{row.original.paymentType}</Badge>
        )
    },
    {
        header: "Pemohon",
        accessorKey: "user",
        cell: ({ row }) => {
            const user = row.original.user;
            if (!user) return "-";
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                    {user.studyProgram && (
                        <span className="text-xs text-muted-foreground">{user.studyProgram}</span>
                    )}
                    {user.institution && (
                        <span className="text-xs text-muted-foreground">{user.institution}</span>
                    )}
                </div>
            );
        }
    },
    {
        header: "Jumlah",
        accessorKey: "amount",
        cell: ({ row }) => (
            <span className="font-medium">{row.original.amount.formatToIDR()}</span>
        )
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => <PaymentStatusBadge status={row.original.status} payableStatus={row.original.payableStatus} />
    },
    {
        header: "Detail",
        accessorKey: "payableId",
        cell: ({ row }) => {
            const detailUrl = getPaymentDetailUrl(row.original.paymentCategory, row.original.payableId);
            if (!detailUrl) return "-";
            return (
                <NavLink to={detailUrl}>
                    <Button variant="secondary" size="sm">Detail</Button>
                </NavLink>
            );
        }
    },
    {
        header: "Aksi",
        accessorKey: "id",
        cell: ({ row }) => {
            const payment = row.original;
            // Check if the current user is the owner of this payment
            const isOwner = currentUserId !== undefined && payment.userId === currentUserId;
            
            return (
                <PaymentAction
                    payment={payment}
                    onOpenCreatePayment={openCreatePayment}
                    onOpenApproval={(id) => openApproval(id, payment)}
                    onOpenRejection={(id) => openRejection(id, payment)}
                    onOpenVerification={openVerification}
                    onOpenVerificationRejection={openVerificationRejection}
                    onOpenReuploadProof={openReuploadProof}
                    isOwner={isOwner}
                />
            );
        }
    }
];

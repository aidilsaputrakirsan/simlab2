import { PaymentView } from "@/application/payment/PaymentView";
import { PaymentStatus } from "@/domain/payment/PaymentStatus";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { NavLink } from "react-router-dom";
import PaymentAction from "../components/PaymentAction";

interface ColumnProps {
    openCreatePayment: (id: number) => void;
    openApproval: (id: number) => void;
    openRejection: (id: number) => void;
}

const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
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

export const PaymentColumn = ({ openCreatePayment, openApproval, openRejection }: ColumnProps): ColumnDef<PaymentView>[] => [
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
        cell: ({ row }) => <PaymentStatusBadge status={row.original.status} />
    },
    {
        header: "Detail",
        accessorKey: "payableId",
        cell: ({ row }) => {
            const detailUrl = getPaymentDetailUrl(row.original.paymentType, row.original.payableId);
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
        cell: ({ row }) => (
            <PaymentAction
                payment={row.original}
                onOpenCreatePayment={openCreatePayment}
                onOpenApproval={openApproval}
                onOpenRejection={openRejection}
            />
        )
    }
];

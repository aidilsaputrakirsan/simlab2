import { BookingView } from "@/application/booking/BookingView";
import { userRole } from "@/domain/User/UserRole";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { NavLink } from "react-router-dom";
import BookingBadgeStatus from "../components/BookingBadgeStatus";
import BookingVerificationAction from "../components/BookingVerificationAction";
import PaymentBadgeStatus from "../../payment/components/PaymentBadgeStatus";
import { PaymentStatus } from "@/domain/payment/PaymentStatus";

interface ColumnProps {
    role: userRole;
    openApproval: (id: number) => void;
    openRejection: (id: number) => void;
    openReturnVerification?: (id: number) => void;
    openReturnConfirmation?: (id: number) => void;
}

export const BookingVerificationColumn = ({ role, openApproval, openRejection, openReturnVerification, openReturnConfirmation }: ColumnProps): ColumnDef<BookingView>[] => [
    { header: 'Tahun Akademik', accessorKey: 'academicYear', cell: ({ row }) => row.original.academicYear },
    {
        header: "Judul Proyek / Penelitian",
        accessorKey: 'activityName',
    },
    {
        header: 'Waktu', accessorKey: 'startTime', cell: ({ row }) => (
            <Badge variant={'secondary'}>{row.original.getEventDateRange()} | {row.original.getEventTimeRange()}</Badge>
        )
    },
    {
        header: 'Status Peminjaman', accessorKey: 'status',
        cell: ({ row }) => (
            <BookingBadgeStatus status={row.original.status} />
        )
    },
    {
        header: "Status Pembayaran",
        accessorKey: 'paymentStatus',
        cell: ({ row }) => {
            if (row.original.hasPaidItems) {
                if (row.original.paymentStatus === PaymentStatus.Draft) {
                    return <Badge variant={"outline"}>Menunggu Penerbitan Pembayaran</Badge>
                }
                if (row.original.paymentStatus) {
                    return <PaymentBadgeStatus status={row.original.paymentStatus}/>
                }
            }
            return <span>-</span>
        }
    },
    {
        header: 'Informasi Peminjaman', accessorKey: 'detail', cell: ({ row }) => (
            <NavLink to={`/panel/peminjaman/${row.original.id}/detail`}>
                <Button size="sm" variant="secondary">Detail</Button>
            </NavLink>
        )
    },
    {
        header: 'Action', accessorKey: 'id', cell: ({ row }) => (
            <BookingVerificationAction
                booking={row.original}
                role={role}
                openApproval={openApproval}
                openRejection={openRejection}
                openReturnVerification={openReturnVerification}
                openReturnConfirmation={openReturnConfirmation}
            />
        )
    }
];
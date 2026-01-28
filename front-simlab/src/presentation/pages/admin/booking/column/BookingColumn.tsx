import { BookingView } from "@/application/booking/BookingView";
import { BookingType } from "@/domain/booking/BookingType";
import { Badge } from "@/presentation/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import BookingBadgeStatus from "../components/BookingBadgeStatus";
import BookingReturnAction from "../components/BookingReturnAction";
import PaymentRequestorAction from "../../payment/components/PaymentRequestorAction";

interface ColumnProps {
    openReturnConfirmation?: (id: number) => void;
    openPaymentProof?: (paymentId: number) => void;
}

export const BookingColumn = ({ openReturnConfirmation, openPaymentProof }: ColumnProps): ColumnDef<BookingView>[] => [
    {
        header: 'Tahun Akademik',
        accessorKey: 'academicYear'
    },
    {
        header: 'Kebutuhan Peminjaman',
        accessorKey: 'purpose',
    },
    {
        header: "Judul Proyek / Penelitian",
        accessorKey: 'activityName',
    },
    {
        header: "Tanggal Pengajuan",
        accessorKey: 'startTime',
        cell: ({ row }) => (
            <Badge variant={"secondary"}>{row.original.getEventDateRange()} | {row.original.getEventTimeRange()}</Badge>
        )
    },
    {
        header: "Jenis Peminjaman",
        accessorKey: 'bookingType',
        cell: ({ row }) => {
            let type: string = ''
            switch (row.original.bookingType) {
                case BookingType.Room:
                    type = 'Peminjaman Ruangan'
                    break;

                case BookingType.RoomNEquipment:
                    type = 'Peminjaman Ruangan dan Alat'
                    break;

                case BookingType.Equipment:
                    type = 'Peminjaman Alat'
                    break;

                default:
                    break;
            }
            return (
                <Badge variant={"default"}>{type}</Badge>
            )
        }
    },
    {
        header: "Status Peminjaman",
        accessorKey: 'BookingStatus',
        cell: ({ row }) => {
            return (
                <BookingBadgeStatus status={row.original.status}/>
            )
        }
    },
    {
        header: "Status Pembayaran",
        accessorKey: 'paymentStatus',
        cell: ({ row }) => {
            return <PaymentRequestorAction data={row.original} onOpenPayment={openPaymentProof}/>
        }
    },
    {
        header: "Action",
        accessorKey: 'id',
        cell: ({ row }) => {
            return <BookingReturnAction 
                booking={row.original} 
                openReturnConfirmation={openReturnConfirmation}
            />
        }
    }
];
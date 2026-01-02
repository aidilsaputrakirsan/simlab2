import { BookingView } from "@/application/booking/BookingView";
import { BookingType } from "@/domain/booking/BookingType";
import { Badge } from "@/presentation/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import BookingBadgeStatus from "../components/BookingBadgeStatus";
import { NavLink } from "react-router-dom";
import { Button } from "@/presentation/components/ui/button";

export const BookingReportColumn = (): ColumnDef<BookingView>[] => [
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
                <BookingBadgeStatus status={row.original.status} />
            )
        }
    },
    {
        header: "Aksi",
        accessorKey: 'BookingStatus',
        cell: ({ row }) => {
            return (
                <NavLink to={`/panel/peminjaman/${row.original.id}/detail`}>
                    <Button variant="secondary" size="sm">Detail</Button>
                </NavLink>
            )
        }
    },
];
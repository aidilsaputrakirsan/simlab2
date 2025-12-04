import { TestingRequestView } from "@/application/testing-request/TestingRequestView";
import { Badge } from "@/presentation/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import TestingRequestBadgeStatus from "../components/TestingRequestBadgeStatus";
import TestingRequestVerificationAction from "../components/TestingRequestVerificationAction";

interface ColumnProps {
    openApproval: (id: number) => void;
    openRejection: (id: number) => void;
}

export const TestingRequestVerificationColumn = ({ openApproval, openRejection }: ColumnProps): ColumnDef<TestingRequestView>[] => [
    {
        header: 'Tahun Akademik',
        accessorKey: 'academicYear'
    },
    {
        header: "Judul Proyek / Penelitian",
        accessorKey: 'activityName',
    },
    {
        header: "Tanggal Pengajuan",
        accessorKey: 'testingTime',
        cell: ({ row }) => (
            <Badge variant={"secondary"}>{row.original.testingTime.formatForInformation() }</Badge>
        )
    },
    {
        header: "Status Pengajuan",
        accessorKey: 'satus',
        cell: ({ row }) => {
            return (
                <TestingRequestBadgeStatus status={row.original.status}/>
            )
        }
    },
    {
        header: "Action",
        accessorKey: 'id',
        cell: ({ row }) => {
            return <TestingRequestVerificationAction testingRequest={row.original} openApproval={openApproval} openRejection={openRejection}/>
        }
    }
    // {
    //     header: "Tanggal Pengajuan",
    //     accessorKey: 'startTime',
    //     cell: ({ row }) => (
    //         <Badge variant={"secondary"}>{row.original.startTime.formatForInformation()} | {row.original.endTime.formatForInformation()}</Badge>
    //     )
    // },
    // {
    //     header: "Jenis Peminjaman",
    //     accessorKey: 'bookingType',
    //     cell: ({ row }) => {
    //         let type: string = ''
    //         switch (row.original.bookingType) {
    //             case BookingType.Room:
    //                 type = 'Peminjaman Ruangan'
    //                 break;

    //             case BookingType.RoomNEquipment:
    //                 type = 'Peminjaman Ruangan dan Alat'
    //                 break;

    //             case BookingType.Equipment:
    //                 type = 'Peminjaman Alat'
    //                 break;

    //             default:
    //                 break;
    //         }
    //         return (
    //             <Badge variant={"default"}>{type}</Badge>
    //         )
    //     }
    // },
    // {
    //     header: "Status Peminjaman",
    //     accessorKey: 'BookingStatus',
    //     cell: ({ row }) => {
    //         return (
    //             <BookingBadgeStatus status={row.original.status}/>
    //         )
    //     }
    // },
    // {
    //     header: "Action",
    //     accessorKey: 'id',
    //     cell: ({ row }) => {
    //         return <BookingReturnAction booking={row.original} openReturnConfirmation={openReturnConfirmation}/>
    //     }
    // }
];
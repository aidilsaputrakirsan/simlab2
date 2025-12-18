import { TestingRequestView } from "@/application/testing-request/TestingRequestView";
import { Badge } from "@/presentation/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import TestingRequestBadgeStatus from "../components/TestingRequestBadgeStatus";
import { NavLink } from "react-router-dom";
import { Button } from "@/presentation/components/ui/button";
import { PaymentStatus } from "@/domain/payment/PaymentStatus";

export const TestingRequestPaymentColumn = (): ColumnDef<TestingRequestView>[] => [
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
            <Badge variant={"secondary"}>{row.original.testingTime.formatForInformation()}</Badge>
        )
    },
    {
        header: "Status Pengajuan",
        accessorKey: 'satus',
        cell: ({ row }) => {
            return (
                <TestingRequestBadgeStatus status={row.original.status} />
            )
        }
    },
    {
        header: "Informasi Pengajuan",
        cell: ({ row }) => {
            return (
                <NavLink to={`/panel/pengujian/${row.original.id}/detail`}>
                    <Button variant="secondary" size="sm">Detail</Button>
                </NavLink>
            )
        }
    },
    {
        header: "Action",
        accessorKey: 'id',
        cell: ({ row }) => {
            if (row.original.hasPaidItems) {
                switch (row.original.paymentStatus) {
                    case PaymentStatus.Draft:
                        return <Button>Terbitkan Pembayaran</Button>

                    default:
                        break;
                }
            }
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
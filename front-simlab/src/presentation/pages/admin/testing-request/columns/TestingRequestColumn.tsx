import { TestingRequestView } from "@/application/testing-request/TestingRequestView";
import { Badge } from "@/presentation/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import TestingRequestBadgeStatus from "../components/TestingRequestBadgeStatus";
import { NavLink } from "react-router-dom";
import { Button } from "@/presentation/components/ui/button";
import { PaymentStatus } from "@/domain/payment/PaymentStatus";

export const TestingRequestColumn = (): ColumnDef<TestingRequestView>[] => [
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
        header: "Status Pembayaran",
        accessorKey: 'satus',
        cell: ({ row }) => {
            if (row.original.hasPaidItems) {
                switch (row.original.paymentStatus) {
                    case PaymentStatus.Draft:
                        return <Badge variant={"outline"}>Menunggu Penerbitan Pembayaran</Badge>
                
                    default:
                        break;
                }
            }
            return <div>-</div>
        }
    },
    {
        header: "Action",
        accessorKey: 'id',
        cell: ({ row }) => {
            return (
                <NavLink to={`/panel/pengujian/${row.original.id}/detail`}>
                    <Button variant="secondary" size="sm">Detail</Button>
                </NavLink>
            );
        }
    }
];
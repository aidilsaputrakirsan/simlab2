import { TestingRequestView } from "@/application/testing-request/TestingRequestView";
import { Badge } from "@/presentation/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import TestingRequestBadgeStatus from "../components/TestingRequestBadgeStatus";
import { NavLink } from "react-router-dom";
import { Button } from "@/presentation/components/ui/button";
import PaymentRequestorAction from "../../payment/components/PaymentRequestorAction";

interface ColumnProps {
    openPayment: (id: number) => void
}

export const TestingRequestColumn = ({ openPayment }: ColumnProps): ColumnDef<TestingRequestView>[] => [
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
        accessorKey: 'status',
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
            return <PaymentRequestorAction data={row.original} onOpenPayment={openPayment}/>
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
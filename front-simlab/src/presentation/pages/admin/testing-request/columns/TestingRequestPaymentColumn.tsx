import { TestingRequestView } from "@/application/testing-request/TestingRequestView";
import { Badge } from "@/presentation/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import TestingRequestBadgeStatus from "../components/TestingRequestBadgeStatus";
import { NavLink } from "react-router-dom";
import { Button } from "@/presentation/components/ui/button";
import PaymentApproverAction from "../../payment/components/PaymentApproverAction";

interface ColumnProps {
    openCreatePayment: (id: number) => void;
    openApproval: (id: number) => void;
    openRejection: (id: number) => void;
}

export const TestingRequestPaymentColumn = ({ openCreatePayment, openApproval, openRejection }: ColumnProps): ColumnDef<TestingRequestView>[] => [
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
            return <PaymentApproverAction data={row.original} onOpenCreatePayment={openCreatePayment} onOpenApproval={openApproval} onOpenRejection={openRejection}/>
        }
    }
];
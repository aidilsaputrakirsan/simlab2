import { PracticumSchedulingView } from "@/application/practicum-scheduling/PracticumSchedulingView";
import { Button } from "@/presentation/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { NavLink } from "react-router-dom";
import PracticumSchedulingBadgeStatus from "../components/PracticumSchedulingBadgeStatus";
import PracticumSchedulingVerificationAction from "../components/PracticumSchedulingVerificationAction";

interface ColumnProps {
    openApproval: (id: number) => void;
    openRejection: (id: number) => void;
}

export const PracticumScheduleVerificationColumn = ({ openApproval, openRejection }: ColumnProps): ColumnDef<PracticumSchedulingView>[] => [
    {
        header: 'Tahun Akademik',
        accessorKey: 'academicYear',
        cell: ({ row }) => (
            `${row.original.academicYear}`
        )
    },
    {
        header: 'Praktikum',
        accessorKey: 'praktikumId',
        cell: ({ row }) => (
            `${row.original.practicumName}`
        )
    },
    {
        header: "Tanggal Pengajuan",
        accessorKey: 'createdAt',
        cell: ({ row }) => (
            `${row.original.createdAt.formatForInformation()}`
        )
    },
    {
        header: "Status Pengajuan",
        accessorKey: 'status',
        cell: ({ row }) => {
            return (
                <PracticumSchedulingBadgeStatus status={row.original.status} />
            )
        }
    },
    {
        header: 'Informasi Pengajuan', accessorKey: 'activityName', cell: ({ row }) => (
            <NavLink to={`/panel/penjadwalan-praktikum/${row.original.id}/detail`}>
                <Button size="sm" variant="secondary">Detail</Button>
            </NavLink>
        )
    },
    {
        header: 'Verifikasi Pengajuan', accessorKey: 'id',
        cell: ({ row }) => {
            return <PracticumSchedulingVerificationAction practicumScheduling={row.original} openApproval={openApproval} openRejection={openRejection}/>
        }
    }
];
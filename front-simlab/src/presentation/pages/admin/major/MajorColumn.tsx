import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/presentation/components/ui/button";
import { MajorView } from "@/application/major/MajorView";

interface ColumnProps {
    openModal: (major: MajorView) => void;
    openConfirm: (major: MajorView) => void
}

export const MajorColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<MajorView>[] => [
    { header: 'Kode Jurusan', accessorKey: 'code', cell: ({ row }) => row.original.code ?? '-' },
    { header: 'Jurusan', accessorKey: 'name'},
    { header: 'Fakultas', accessorKey: 'faculty', cell: ({ row }) => row.original.faculty?.name},
    {
        header: 'Action',
        accessorKey: 'id',
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button size={'sm'} variant={'warning'} onClick={() => openModal(row.original)}>
                    Edit
                </Button>
                <Button size={'sm'} variant={'destructive'} onClick={() => openConfirm(row.original)}>
                    Delete
                </Button>
            </div>
        )
    },
];

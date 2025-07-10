import { ColumnDef } from "@tanstack/react-table";
import { Major } from "../../../../domain/major/Major";
import { Button } from "@/presentation/components/ui/button";

interface ColumnProps {
    openModal: (type: 'Add' | 'Edit', id?: number) => void;
    openConfirm: (id: number) => void
}

export const MajorColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<Major>[] => [
    { header: 'Kode Jurusan', accessorKey: 'majorCode'},
    { header: 'Jurusan', accessorKey: 'name'},
    {
        header: 'Action',
        accessorKey: 'id',
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button size={'sm'} onClick={() => openModal('Edit',row.original.id)}>
                    Edit
                </Button>
                <Button size={'sm'} variant={'destructive'} onClick={() => openConfirm(row.original.id)}>
                    Delete
                </Button>
            </div>
        )
    },
];

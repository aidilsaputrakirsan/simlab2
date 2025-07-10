import { ColumnDef } from "@tanstack/react-table";
import { PracticalWork } from "../../../../domain/practical-work/PracticalWork";
import { Button } from "@/presentation/components/ui/button";

interface ColumnProps {
    openModal: (type: 'Add' | 'Edit', id?: number) => void;
    openConfirm: (id: number) => void;
}

export const PracticalWorkColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<PracticalWork>[] => [
    { header: 'Nama Praktikum', accessorKey: 'name' },
    { header: 'Prodi', accessorKey: 'studyProgram', cell: ({ row }) => row.original.studyProgram?.name },
    { header: 'SKS', accessorKey: 'sks' },
    {
        header: 'Action',
        accessorKey: 'id' as keyof PracticalWork,
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button size={"sm"} onClick={() => openModal('Edit',row.original.id)}>
                    Edit
                </Button>
                <Button size={"sm"} variant={"destructive"} onClick={() => openConfirm(row.original.id)}>
                    Delete
                </Button>
            </div>
        )
    },
];

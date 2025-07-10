import { ColumnDef } from '@tanstack/react-table';
import { UserView } from '@/application/user/UserView';
import { Button } from '@/presentation/components/ui/button';

interface ColumnProps {
    openConfirm: (id: number) => void;
}

export const MahasiswaColumn = ({ openConfirm }: ColumnProps): ColumnDef<UserView>[] => [
    { header: 'Email', accessorKey: 'email' as keyof UserView },
    { header: 'Nama', accessorKey: 'name' as keyof UserView },
    { header: 'NIM / NIP / NIPH / Lainnya', accessorKey: 'identityNum' as keyof UserView, cell: ({ row }) => row.original.identityNum ?? '-' },
    { header: 'Prodi', accessorKey: 'studyProgram' as keyof UserView, cell: ({ row }) => row.original.studyProgram?.name },
    {
        header: 'Action',
        accessorKey: 'id' as keyof UserView,
        cell: ({ row }) => (
            <>
                <Button size={'sm'} variant={'destructive'} onClick={() => openConfirm(row.original.id)}>
                    Delete
                </Button>
            </>
        )
    },
];

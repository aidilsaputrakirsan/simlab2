import { ColumnDef } from '@tanstack/react-table';
import { UserView } from '@/application/user/UserView';
import { Button } from '@/presentation/components/ui/button';

interface ColumnProps {
    openModal: (dosen: UserView) => void;
    openConfirm: (dosen: UserView) => void;
}

export const DosenColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<UserView>[] => [
    { header: 'Email', accessorKey: 'email' as keyof UserView },
    { header: 'Nama', accessorKey: 'name' as keyof UserView },
    { header: 'NIM / NIP / NIPH / Lainnya', accessorKey: 'identityNum' as keyof UserView, cell: ({ row }) => row.original.identityNum ?? '-' },
    { header: 'Prodi', accessorKey: 'studyProgram' as keyof UserView, cell: ({ row }) => row.original.studyProgram?.name },
    {
        header: 'Action',
        accessorKey: 'id' as keyof UserView,
        cell: ({ row }) => (
            <div className='flex gap-2'>
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

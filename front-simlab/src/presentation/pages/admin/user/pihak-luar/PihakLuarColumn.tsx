import { UserView } from '@/application/user/UserView';
import { Button } from '@/presentation/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';

interface ColumnProps {
    openConfirm: (id: number) => void;
}

export const PihakLuarColumn = ({ openConfirm }: ColumnProps): ColumnDef<UserView>[] => [
    { header: 'Email', accessorKey: 'email' as keyof UserView },
    { header: 'Nama', accessorKey: 'name' as keyof UserView },
    { header: 'NIM / NIP / NIPH / Lainnya', accessorKey: 'identityNum' as keyof UserView, cell: ({ row }) => row.original.identityNum ?? '-' },
    {
        header: 'Asal Institusi', accessorKey: 'institution' as keyof UserView,
        cell: ({ row }) => (
            <span>{row.original.institution?.name}</span>
        )
    },
    {
        header: 'Tanggal pembuatan akun', accessorKey: 'createdAt' as keyof UserView,
        cell: ({ row }) => (
            <span>{row.original.createdAt?.formatForInformation()}</span>
        )
    },
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

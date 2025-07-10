import { UserView } from '@/application/user/UserView';
import { Button } from '@/presentation/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';

interface ColumnProps {
    openConfirm: (id: number) => void;
}

export const PihakLuarColumn = ({ openConfirm }: ColumnProps): ColumnDef<UserView>[] => [
    { header: 'Email', accessorKey: 'email' as keyof UserView},
    { header: 'Nama', accessorKey: 'name' as keyof UserView},
    { header: 'NIM / NIP / NIPH / Lainnya', accessorKey: 'identityNum' as keyof UserView, cell: ({ row }) => row.original.identityNum ?? '-' },
    { header: 'Tanggal pembuatan akun', accessorKey: 'createdAt' as keyof UserView, cell: ({ row }) => {
        if (!row.original.createdAt) return '-';
        const date = new Date(row.original.createdAt);
        const formatted = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

        return formatted;
    } },
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

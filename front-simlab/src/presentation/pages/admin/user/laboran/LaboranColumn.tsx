import { UserView } from '@/application/user/UserView';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';

interface ColumnProps {
    openModal: (user: UserView) => void;
    openConfirm: (type: 'delete' | 'status', user: UserView) => void;
}

export const LaboranColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<UserView>[] => [
    { header: 'Email', accessorKey: 'email' as keyof UserView },
    { header: 'Nama', accessorKey: 'name' as keyof UserView },
    {
      header: 'Manager Status',
      accessorKey: 'isManager' as keyof UserView,
      cell: ({row}) => (
        <Badge variant={row.original.isManager ? 'default' : 'destructive'}  className='cursor-pointer' onClick={() => openConfirm('status', row.original)}>{row.original.isManager ? 'Manager' : 'Not Manager'}</Badge>
      )
    },
    {
        header: 'Action',
        accessorKey: 'id' as keyof UserView,
        cell: ({ row }) => (
            <div className='flex gap-2'>
                <Button size={'sm'} variant={'warning'} onClick={() => openModal(row.original)}>
                    Edit
                </Button >
                <Button size={'sm'} variant={'destructive'}  onClick={() => openConfirm('delete', row.original)}>
                    Delete
                </Button >
            </div>
        )
    },
];

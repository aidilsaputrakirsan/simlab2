import { ColumnDef } from '@tanstack/react-table';
import { UserView } from '@/application/user/UserView';
import { Button } from '@/presentation/components/ui/button';

interface ColumnProps {
    openModal: (user: UserView) => void;
    openConfirm: (user: UserView) => void;
}

export const AdminPengujianColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<UserView>[] => [
    { header: 'Email', accessorKey: 'email'},
    { header: 'Nama', accessorKey: 'name'},
    {
        header: 'Action',
        accessorKey: 'id',
        cell: ({row}) => (
            <div className='flex gap-2'>
                <Button size={'sm'} variant={'warning'} onClick={() => openModal(row.original)}>
                    Edit
                </Button>
                <Button size={'sm'} variant={'destructive'}  onClick={() => openConfirm(row.original)}>
                    Delete
                </Button >
            </div>
        )
    },
];

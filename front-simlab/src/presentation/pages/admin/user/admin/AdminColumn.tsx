import { ColumnDef } from '@tanstack/react-table';
import { User } from '../../../../../domain/User/User';

interface ColumnProps {
    openModal: (type: 'Add' | 'Edit', id?: number) => void;
}

export const AdminColumn = ({ openModal }: ColumnProps): ColumnDef<User>[] => [
    { header: 'Email', accessorKey: 'email' as keyof User},
    { header: 'Nama', accessorKey: 'name' as keyof User},
    {
        header: 'Action',
        accessorKey: 'id' as keyof User,
        cell: ({row}) => (
            <>
                <button className="mr-2 text-warning text-indigo-600 hover:text-indigo-900" onClick={() => openModal('Edit',row.original.id)}>
                    Edit
                </button>
            </>
        )
    },
];

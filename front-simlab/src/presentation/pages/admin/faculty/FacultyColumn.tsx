import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/presentation/components/ui/button';
import { FacultyView } from '@/application/faculty/FacultyView';

interface ColumnProps {
    openModal: (faculty: FacultyView) => void;
    openConfirm: (id: FacultyView) => void
}

export const FacultyColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<FacultyView>[] => [
    { header: 'Kode Fakultas', accessorKey: 'code' as keyof FacultyView},
    { header: 'Fakultas', accessorKey: 'name' as keyof FacultyView},
    {
      header: 'Action',
      accessorKey: 'id' as keyof FacultyView,
      cell: ({row}) => (
        <div className='flex gap-2'>
          <Button size={'sm'} variant={'warning'} onClick={() => openModal(row.original)}>
            Edit
          </Button>
          <Button variant={'destructive'} size={'sm'} onClick={() => openConfirm(row.original)}>
            Delete
          </Button>
        </div>
      )
    },
];

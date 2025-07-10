import { ColumnDef } from '@tanstack/react-table';
import { AcademicYear } from '../../../../domain/academic-year/AcademicYear';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';

interface ColumnProps {
    openModal: (type: 'Add' | 'Edit', id?: number) => void;
    openConfirm: (type: "delete" | "status", id: number) => void
}

export const AcademicYearColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<AcademicYear>[] => [
    { header: 'Tahun Akademik', accessorKey: 'academicYear' as keyof AcademicYear},
    {
      header: 'Status',
      accessorKey: 'status' as keyof AcademicYear,
      cell: ({row}) => (
        <Badge variant={row.original.status === 'Active' ? 'default' : 'destructive'}  className='cursor-pointer' onClick={() => openConfirm('status', row.original.id)}>{row.original.status}</Badge>
        // <span className={`px-2 py-1 rounded-full ${row.original.status === 'Active' ? 'bg-primary' : 'bg-destructive'} transition-colors duration-200 cursor-pointer text-white`} onClick={() => openConfirm('status', row.original.id)}>{row.original.status}</span>
      )
    },
    {
      header: 'Action',
      accessorKey: 'id' as keyof AcademicYear,
      cell: ({row}) => (
        <div className='flex gap-2'>
          <Button size={'sm'} onClick={() => openModal('Edit' ,row.original.id)}>
            Edit
          </Button>
          <Button variant={'destructive'} size={'sm'} onClick={() => openConfirm('delete', row.original.id)}>
            Delete
          </Button>
        </div>
      )
    },
];

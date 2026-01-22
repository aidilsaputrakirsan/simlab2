import { InstitutionView } from "@/application/institution/InstitutionView.";
import { Button } from "@/presentation/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

interface ColumnProps {
    openModal: (institution: InstitutionView) => void;
    openConfirm: (institution: InstitutionView) => void
}

export const InstitutionColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<InstitutionView>[] => [
    { header: 'Institusi', accessorKey: 'name' as keyof InstitutionView},
    {
      header: 'Jumlah Akun terdaftar',
      accessorKey: 'account' as keyof InstitutionView,
      cell: ({row}) => (
        <span>{row.original.totalAccount ?? 0}</span>
      )
    },
    {
      header: 'Action',
      accessorKey: 'id' as keyof InstitutionView,
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
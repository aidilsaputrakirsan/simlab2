import { PublicationCategoryView } from '@/application/publication-category/PublicationCategoryView';
import { Button } from '@/presentation/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';

interface ColumnProps {
    openModal: (category: PublicationCategoryView) => void;
    openConfirm: (category: PublicationCategoryView) => void;
}

export const PublicationCategoryColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<PublicationCategoryView>[] => [
    { header: 'Nama Kategori', accessorKey: 'name' as keyof PublicationCategoryView },
    {
        header: 'Action',
        accessorKey: 'id' as keyof PublicationCategoryView,
        cell: ({ row }) => (
            <>
                <Button size={'sm'} className='mr-2' onClick={() => openModal(row.original)}>
                    Edit
                </Button>
                <Button size={'sm'} variant={'destructive'} onClick={() => openConfirm(row.original)}>
                    Delete
                </Button>
            </>
        )
    },
];

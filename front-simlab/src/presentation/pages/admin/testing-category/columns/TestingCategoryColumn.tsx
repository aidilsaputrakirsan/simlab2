import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/presentation/components/ui/button";
import { TestingCategoryView } from "@/application/testing-category/TestingCategoryView";

interface ColumnProps {
  openModal: (testingCategory: TestingCategoryView) => void;
  openConfirm: (testingCategory: TestingCategoryView) => void
}

export const TestingCategoryColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<TestingCategoryView>[] => [
  {
    header: 'Kategori Pengujian',
    accessorKey: 'name',
    cell: ({row}) => ( <div className="text-pretty">{row.original.name}</div> )
  },
  {
    header: 'Action',
    accessorKey: 'id',
    cell: ({row}) => (
      <div className="flex gap-2">
        <Button
          size={'sm'}
          onClick={() => openModal(row.original)}
        >
          Edit
        </Button>
        <Button
          size={'sm'}
          variant={"destructive"}
          onClick={() => openConfirm(row.original)}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

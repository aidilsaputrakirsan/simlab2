import { ColumnDef } from "@tanstack/react-table";
import { TestingType } from "../../../../domain/testing-type/TestingType";
import { Button } from "@/presentation/components/ui/button";

interface ColumnProps {
  openModal: (type: 'Add' | 'Edit', id?: number) => void;
  openConfirm: (id: number) => void
}

export const TestingTypeColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<TestingType>[] => [
  {
    header: 'Jenis Pengujian',
    accessorKey: 'testingType',
  },
  {
    header: 'Action',
    accessorKey: 'id',
    cell: ({row}) => (
      <div className="flex gap-2">
        <Button
          size={'sm'}
          onClick={() => openModal('Edit', row.original.id)}
        >
          Edit
        </Button>
        <Button
          size={'sm'}
          variant={"destructive"}
          onClick={() => openConfirm(row.original.id)}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

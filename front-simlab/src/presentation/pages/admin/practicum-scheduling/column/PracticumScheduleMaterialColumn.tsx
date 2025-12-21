import { PracticumSchedulingMaterialView } from "@/application/practicum-scheduling/PracticumSchedulingMaterialView";
import { ColumnDef } from "@tanstack/react-table";

export const PracticumScheduleMaterialColumn = (): ColumnDef<PracticumSchedulingMaterialView>[] => [
    {
      id: 'name',
      header: 'Bahan',
      cell: ({ row }) => row.original.materialName|| '-',
    },
    {
      accessorKey: 'quantity',
      header: 'Qty',
      cell: ({ row }) => `${row.original.quantity} ${row.original.unit}`
    },
    {
      accessorKey: 'realization',
      header: 'Qty (yang dapat direalisasikan)',
      cell: ({ row }) => {
        if (row.original.realization) {
          return `${row.original.realization} ${row.original.unit}`
        }
        return 'Masih menunggu persetujuan laboran'
      }
    }
];

import { ColumnDef } from "@tanstack/react-table";
import { PublicationView } from "@/application/publication/PublicationView";
import { Button } from "@/presentation/components/ui/button";

type ColumnProps = {
    openModal: (publication: PublicationView) => void;
    openConfirm: (publication: PublicationView) => void;
};

export const PublicationColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<PublicationView>[] => [
    {
        accessorKey: "images",
        header: "Gambar",
        cell: ({ row }) => (
            <img
                src={row.original.imageUrl()}
                alt={row.original.title}
                className="h-16 w-16 object-cover rounded"
            />
        ),
    },
    {
        accessorKey: "title",
        header: "Judul",
        cell: ({ row }) => (
            <div className="max-w-md">
                <p className="font-medium">{row.original.title}</p>
            </div>
        ),
    },
    {
        accessorKey: "shortDescription",
        header: "Deskripsi Singkat",
        cell: ({ row }) => (
            <div className="max-w-md">
                <p className="text-sm text-gray-600 line-clamp-2">{row.original.shortDescription}</p>
            </div>
        ),
    },
    {
        accessorKey: "publicationCategoryName",
        header: "Kategori",
        cell: ({ row }) => row.original.publicationCategoryName,
    },
    {
        accessorKey: "writerName",
        header: "Penulis",
        cell: ({ row }) => (
            <div>
                <p className="font-medium">{row.original.writerName}</p>
                <p className="text-xs text-gray-500">{row.original.writerEmail}</p>
            </div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Tanggal",
        cell: ({ row }) => row.original.createdAt.formatForInformation(),
    },
    {
        accessorKey: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            return (
                <div className="flex gap-2">
                    <Button
                        onClick={() => openModal(row.original)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant={'destructive'}
                        onClick={() => openConfirm(row.original)}
                    >
                        Hapus
                    </Button>
                </div>
            );
        },
    },
];

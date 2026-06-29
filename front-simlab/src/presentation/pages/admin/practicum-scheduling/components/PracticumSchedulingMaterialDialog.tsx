import { PracticumSchedulingMaterialView } from '@/application/practicum-scheduling/PracticumSchedulingMaterialView'
import React from 'react'
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/presentation/components/ui/dialog';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import { DataTable } from '@/presentation/components/custom/Datatable';
import { PracticumScheduleMaterialColumn } from '../column/PracticumScheduleMaterialColumn';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

type ProposedMaterial = { id: number; name: string; quantity: string }

interface PracticumSchedulingMaterialDialogProps {
    data: PracticumSchedulingMaterialView[]
    proposedData?: ProposedMaterial[]
}

// Kolom khusus bahan usulan: Nama & Jumlah (teks bebas: angka + satuan), tanpa realisasi
const proposedMaterialColumn: ColumnDef<ProposedMaterial>[] = [
    {
        id: 'name',
        header: 'Bahan',
        cell: ({ row }) => row.original.name || '-',
    },
    {
        accessorKey: 'quantity',
        header: 'Jumlah',
        cell: ({ row }) => row.original.quantity || '-',
    },
];

const PracticumSchedulingMaterialDialog: React.FC<PracticumSchedulingMaterialDialogProps> = ({
    data,
    proposedData = []
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    Lihat Daftar Bahan <Eye />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Daftar Bahan yang Dipinjam</DialogTitle>
                    <DialogDescription>Berikut merupakan daftar bahan serta usulan bahan yang diajukan untuk semua kelas. Harap hubungi kepala jurusan yang mengajukan untuk pembagian bahan per kelas</DialogDescription>
                </DialogHeader>
                <ScrollArea className='h-full max-h-[70vh]'>
                    <div className='p-1 flex flex-col gap-5'>
                        <div>
                            <span className='font-semibold'>Bahan Laboratorium </span>
                            {data.length > 0 ? (
                                <DataTable columns={PracticumScheduleMaterialColumn()} data={data} loading={false} />
                            ) : (
                                <p className='mb-2 text-sm text-muted-foreground'>Tidak ada bahan dari daftar inventaris.</p>
                            )}
                        </div>
                        <div>
                            <span className='font-semibold'>Usulan Bahan Laboratorium </span>
                            {proposedData.length > 0 ? (
                                <DataTable columns={proposedMaterialColumn} data={proposedData} loading={false} />
                            ) : (
                                <p className='mb-2 text-sm text-muted-foreground'>Tidak ada bahan usulan.</p>
                            )}
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Tutup
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PracticumSchedulingMaterialDialog
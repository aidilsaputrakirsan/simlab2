import { LaboratoryMaterialView } from '@/application/laboratory-material/LaboratoryMaterialView'
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { ScrollArea } from '@/presentation/components/ui/scroll-area'
import Item from '@/presentation/components/Item'


interface LaboratoryMaterialDetailDialogProps {
    laboratoryMaterial?: LaboratoryMaterialView
    open: boolean,
    onOpenChange: (open: boolean) => void
}

const LaboratoryMaterialDetailDialog: React.FC<LaboratoryMaterialDetailDialogProps> = ({
    laboratoryMaterial,
    open,
    onOpenChange
}) => {
    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className='sm:max-w-lg'>
                    <DialogHeader>
                        <DialogTitle>Detail Bahan Laboratorium</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className='h-full max-h-[70vh]'>
                        <div className='flex flex-col gap-5'>
                            <div className='grid gap-x-5 gap-y-2'>
                                <Item title='Kode Asset' value={laboratoryMaterial?.code} />
                                <Item title='Nama Bahan' value={laboratoryMaterial?.materialName} />
                                <Item title='Merek' value={laboratoryMaterial?.brand} />
                                <Item title='Jumlah Bahan' value={`${laboratoryMaterial?.stock} ${laboratoryMaterial?.unit}`} />
                                <Item title='Tanggal Pembelian ' value={`${laboratoryMaterial?.purchaseDate}`} />
                                <Item title='Tanggal Kadaluarsa ' value={`${laboratoryMaterial?.expiryDate}`} />
                                <Item title='Tanggal Restock Terakhir ' value={`${laboratoryMaterial?.refillDate}`} />
                                <Item title='Harga Mahasiswa' value={laboratoryMaterial?.studentPrice.formatToIDR()} />
                                <Item title='Harga Dosen' value={laboratoryMaterial?.lecturerPrice.formatToIDR()} />
                                <Item title='Harga External' value={laboratoryMaterial?.externalPrice.formatToIDR()} />
                                <Item className='sm:col-span-2' title='Keterangan' value={laboratoryMaterial?.description} />
                            </div>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default LaboratoryMaterialDetailDialog
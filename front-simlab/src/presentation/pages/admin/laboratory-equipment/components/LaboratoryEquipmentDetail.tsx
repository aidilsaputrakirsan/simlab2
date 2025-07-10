import { LaboratoryEquipmentView } from '@/application/laboratory-equipment/LaboratoryEquipmentView'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import React, { useEffect, useState } from 'react'

interface LaboratorEquipmentDetailProps {
    laboratoryEquipment: LaboratoryEquipmentView[],
    laboratoryEquipmentId: number | null
    open: boolean,
    onOpenChange: (open: boolean) => void,
}

const LaboratoryEquipmentDetail: React.FC<LaboratorEquipmentDetailProps> = ({ laboratoryEquipment, laboratoryEquipmentId, open, onOpenChange }) => {
    const [alatLaboratorinData, setAlatLaboratorinData] = useState<LaboratoryEquipmentView | Record<string, any>>({});
    const [imageError, setImageError] = useState<boolean>(false);

    useEffect(() => {
        if (laboratoryEquipmentId) {
            const selectedData = laboratoryEquipment.find((data) => data.id == laboratoryEquipmentId)
            setAlatLaboratorinData(selectedData || {})
            setImageError(false)
        } else {
            setAlatLaboratorinData({})
            setImageError(false);
        }
    }, [laboratoryEquipmentId])

    const handleImageError = () => {
        setImageError(true);
    };

    const hasValidPhoto = alatLaboratorinData &&
        alatLaboratorinData.photo &&
        alatLaboratorinData.photo.trim() !== '';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]">
                <DialogHeader className='p-6'>
                    <DialogTitle>Detail Alat Laboratorium</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-5 overflow-y-auto px-6 pb-6'>
                    <div className="w-full">
                        {!imageError && hasValidPhoto ? (
                            <img
                                className='object-cover aspect-[4/3] w-full mb-5'
                                src={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/${alatLaboratorinData.photo}`}
                                onError={handleImageError}
                            />
                        ) : (
                            <img
                                className='object-cover aspect-[4/3] w-full mb-5'
                                src={'/error-image.png'}
                            />
                        )}
                        <div className='flex flex-col gap-5'>
                            <div className='flex flex-col gap-1'>
                                <h1 className="text-2xl sm:text-xl font-bold">{alatLaboratorinData.equipmentName}</h1>
                                <p className="text-gray-800">{alatLaboratorinData.equipmentFunction ?? 'Deskripsi tidak tersedia'}</p>
                            </div>
                            <div className='grid gap-x-5 gap-y-2 sm:grid-cols-2'>
                                <Item title='Kode Asset' value={alatLaboratorinData.assetCode ?? '-'} />
                                <Item title='Merek' value={alatLaboratorinData.brand ?? '-'} />
                                <Item title='Tipe Alat' value={alatLaboratorinData.equipmentType ?? '-'} />
                                <Item title='Jumlah Alat' value={`${alatLaboratorinData.quantity ?? '-'} ${alatLaboratorinData.unit ?? '-'}`} />
                                <Item title='Lokasi Alat' value={alatLaboratorinData.ruanganLaboratorium?.name ?? '-'} />
                                <Item title='Kondisi Alat' value={alatLaboratorinData.condition ?? '-'} />
                                <Item title='Keterangan' value={alatLaboratorinData.conditionDescription ?? '-'} />
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const Item = ({ title, value, className }: { title: string; value: string, className?: string }) => {
    return <>
        <div className={`flex flex-col text-gray-700 ${className}`}>
            <span className='text-sm'>{title} </span>
            <span className='font-semibold text-base'>{value}</span>
        </div>
    </>
}

export default LaboratoryEquipmentDetail

import { LaboratoryEquipmentInputDTO } from '@/application/laboratory-equipment/LaboratoryEquipmentDTO'
import { LaboratoryEquipmentView } from '@/application/laboratory-equipment/LaboratoryEquipmentView'
import { LaboratoryRoomSelectView } from '@/application/laboratory-room/LaboratoryRoomSelectView'
import { Combobox } from '@/presentation/components/custom/combobox'
import FormGroup from '@/presentation/components/custom/FormGroup'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { Input } from '@/presentation/components/ui/input'
import { ScrollArea } from '@/presentation/components/ui/scroll-area'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import { Textarea } from '@/presentation/components/ui/textarea'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { ApiResponse } from '@/presentation/shared/Types'
import React, { useEffect, useState } from 'react'

interface LaboratoryEquipmentFormDialogProps {
    title: string,
    open: boolean,
    laboratoryRooms: LaboratoryRoomSelectView[]
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>,
    laboratoryEquipment?: LaboratoryEquipmentView
}

const LaboratoryEquipmentFormDialog: React.FC<LaboratoryEquipmentFormDialogProps> = ({
    title,
    open,
    laboratoryRooms,
    onOpenChange,
    handleSave,
    laboratoryEquipment
}) => {
    const defaultFormData: LaboratoryEquipmentInputDTO = {
        equipment_name: '',
        laboratory_room_id: 0,
        quantity: 0,
        unit: '',
        function: '',
        photo: '',
        brand: '',
        equipment_type: '',
        origin: '',
        condition: '',
        condition_description: '',
        asset_code: '',
        student_price: null,
        lecturer_price: null,
        external_price: null
    }

    const [formData, setFormData] = useState<LaboratoryEquipmentInputDTO>(defaultFormData);
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
    }, [open])

    useEffect(() => {
        if (laboratoryEquipment) {
            setFormData({
                equipment_name: laboratoryEquipment.equipmentName,
                laboratory_room_id: laboratoryEquipment.laboratoryRoom?.id ?? 0,
                quantity: laboratoryEquipment.quantity,
                unit: laboratoryEquipment.unit,
                function: laboratoryEquipment.equipmentFunction,
                photo: null,
                brand: laboratoryEquipment.brand,
                equipment_type: laboratoryEquipment.equipmentType,
                origin: laboratoryEquipment.origin,
                condition: laboratoryEquipment.condition,
                condition_description: laboratoryEquipment.conditionDescription,
                asset_code: laboratoryEquipment.assetCode,
                student_price: laboratoryEquipment.studentPrice.amount,
                lecturer_price: laboratoryEquipment.lecturerPrice.amount,
                external_price: laboratoryEquipment.externalPrice.amount,
            });
        } else {
            setFormData(defaultFormData)
        }

    }, [open])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { type, name, value } = e.target;
        let newValue = value;

        if (type === "number") {
            if (newValue.length > 1 && newValue.startsWith('0')) {
                newValue = newValue.replace(/^0+/, '');
                if (newValue === '') newValue = '0';
            }
        }
        if (name === 'photo' && (e.target as HTMLInputElement).files) {
            setFormData((prev) => ({ ...prev, photo: (e.target as HTMLInputElement).files ? (e.target as HTMLInputElement).files![0] : null }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: newValue }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await handleSave(formData);
        } catch (e) {
            const error = e as ApiResponse
            if (error.errors) {
                processErrors(error.errors);
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="md:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <form encType="multipart/form-data" className='flex flex-col gap-5'>
                    <ScrollArea className='h-full max-h-[70vh]'>
                        <div className='grid md:grid-cols-2 gap-x-2 gap-y-5 p-1'>
                            <FormGroup
                                id='asset_code'
                                label='Kode Aset'
                                error={errors['asset_code']}
                                required>
                                <Input
                                    type='text'
                                    id='asset_code'
                                    name='asset_code'
                                    value={formData['asset_code'] || ''}
                                    onChange={handleChange}
                                    placeholder='Kode Aset'
                                />
                            </FormGroup>
                            <FormGroup
                                id='equipment_name'
                                label='Nama Alat'
                                error={errors['equipment_name']}
                                required>
                                <Input
                                    type='text'
                                    id='equipment_name'
                                    name='equipment_name'
                                    value={formData['equipment_name'] || ''}
                                    onChange={handleChange}
                                    placeholder='Nama Alat'
                                />
                            </FormGroup>
                            <FormGroup
                                id='brand'
                                label='Merek Alat'
                                error={errors['brand']}
                                required>
                                <Input
                                    type='text'
                                    id='brand'
                                    name='brand'
                                    value={formData['brand'] || ''}
                                    onChange={handleChange}
                                    placeholder='Merek Alat'
                                />
                            </FormGroup>
                            <FormGroup
                                id='photo'
                                label='Foto Alat'
                                error={errors['photo']}>
                                <Input
                                    type='file'
                                    id='photo'
                                    name='photo'
                                    accept=".jpg,.jpeg,.png,.webp"
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup
                                className='md:col-span-2'
                                id='function'
                                label='Fungsi Alat'
                                error={errors['function']}>
                                <Textarea
                                    name="function"
                                    id="function"
                                    onChange={handleChange}
                                    placeholder='Fungsi Alat'
                                    value={formData['function'] || ''}
                                ></Textarea>
                            </FormGroup>
                            <FormGroup
                                id='quantity'
                                label='Jumlah Alat'
                                error={errors['quantity']}
                                required>
                                <Input
                                    type='number'
                                    id='quantity'
                                    name='quantity'
                                    value={formData['quantity'] || ''}
                                    onChange={handleChange}
                                    placeholder='0'
                                />
                            </FormGroup>
                            <FormGroup
                                id='unit'
                                label='Satuan Alat'
                                error={errors['unit']}
                                required>
                                <Input
                                    type='text'
                                    id='unit'
                                    name='unit'
                                    value={formData['unit'] || ''}
                                    onChange={handleChange}
                                    placeholder='Satuan Alat'
                                />
                            </FormGroup>
                            <FormGroup
                                id='location'
                                label='Lokasi Alat'
                                error={errors['laboratory_room_id']}
                                required>
                                <Combobox
                                    options={laboratoryRooms}
                                    value={formData.laboratory_room_id?.toString() || ''}
                                    onChange={(val) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            laboratory_room_id: val ? Number(val) : 0
                                        }))
                                    }}
                                    placeholder="Pilih Lokasi"
                                    optionLabelKey='name'
                                    optionValueKey='id'
                                />
                            </FormGroup>
                            <FormGroup
                                id='equipment_type'
                                label='Jenis Alat'
                                error={errors['equipment_type']}
                                required>
                                <Select
                                    name='equipment_type'
                                    value={formData['equipment_type'] ? String(formData['equipment_type']) : ''}
                                    onValueChange={(value) =>
                                        handleChange({
                                            target: {
                                                name: 'equipment_type',
                                                value: value
                                            }
                                        } as React.ChangeEvent<HTMLSelectElement>)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Jenis Alat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Jenis Alat</SelectLabel>
                                            <SelectItem value="Barang BMN">Barang BMN</SelectItem>
                                            <SelectItem value="Barang BHPL">Barang BHPL</SelectItem>
                                            <SelectItem value="Barang Hibah">Barang Hibah</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormGroup>

                            <FormGroup
                                id='origin'
                                label='Asal Alat'
                                error={errors['origin']}
                                required>
                                <Input
                                    type='text'
                                    id='origin'
                                    name='origin'
                                    value={formData['origin'] || ''}
                                    onChange={handleChange}
                                    placeholder='Asal Alat'
                                />
                            </FormGroup>
                            <FormGroup
                                id='condition'
                                label='Kondisi Alat'
                                error={errors['condition']}
                                required>
                                <Select
                                    name='condition'
                                    value={formData['condition'] ? String(formData['condition']) : ''}
                                    onValueChange={(value) =>
                                        handleChange({
                                            target: {
                                                name: 'condition',
                                                value: value
                                            }
                                        } as React.ChangeEvent<HTMLSelectElement>)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Kodisi Alat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Kondisi Alat</SelectLabel>
                                            <SelectItem value="Baik">Baik</SelectItem>
                                            <SelectItem value="Rusak">Rusak</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormGroup>

                            <FormGroup
                                className='md:col-span-2'
                                id='student_price'
                                label='Harga Mahasiswa'
                                error={errors['student_price']}
                                required>
                                <Input
                                    type='number'
                                    id='student_price'
                                    name='student_price'
                                    value={formData['student_price'] ?? ''}
                                    onChange={handleChange}
                                    placeholder='Harga mahasiswa'
                                />
                            </FormGroup>
                            <FormGroup
                                id='lecturer_price'
                                label='Harga Dosen'
                                error={errors['lecturer_price']}
                                required>
                                <Input
                                    type='number'
                                    id='lecturer_price'
                                    name='lecturer_price'
                                    value={formData['lecturer_price'] ?? ''}
                                    onChange={handleChange}
                                    placeholder='Harga Dosen'
                                />
                            </FormGroup>
                            <FormGroup
                                id='external_price'
                                label='Harga Pihak External'
                                error={errors['external_price']}
                                required>
                                <Input
                                    type='number'
                                    id='external_price'
                                    name='external_price'
                                    value={formData['external_price'] ?? ''}
                                    onChange={handleChange}
                                    placeholder='Harga Pihak External'
                                />
                            </FormGroup>
                            <FormGroup
                                className='md:col-span-2'
                                id='condition_description'
                                label='Keterangan Kondisi Alat'
                                error={errors['condition_description']}>
                                    <Textarea
                                        name="condition_description"
                                        id="condition_description"
                                        onChange={handleChange}
                                        placeholder='Keterangan'
                                        value={formData['condition_description'] || ''}
                                    >
                                    </Textarea>
                            </FormGroup>
                        </div>
                    </ScrollArea>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Tutup
                            </Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default LaboratoryEquipmentFormDialog

import { LaboratoryMaterialInputDTO } from "@/application/laboratory-material/LaboratoryMaterialDTO"
import { LaboratoryMaterialView } from "@/application/laboratory-material/LaboratoryMaterialView"
import FormGroup from "@/presentation/components/custom/FormGroup"
import { Button } from "@/presentation/components/ui/button"
import { Calendar } from "@/presentation/components/ui/calendar"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/presentation/components/ui/dialog"
import { Input } from "@/presentation/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/presentation/components/ui/popover"
import { ScrollArea } from "@/presentation/components/ui/scroll-area"
import { Textarea } from "@/presentation/components/ui/textarea"
import { useValidationErrors } from "@/presentation/hooks/useValidationError"
import { ApiResponse } from "@/presentation/shared/Types"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface LaboratoryRoomFormDialogProps {
    title: string,
    open: boolean,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>,
    laboratoryMaterial?: LaboratoryMaterialView
}

import React, { useEffect, useState } from 'react'

const LaboratoryMaterialFormDialog: React.FC<LaboratoryRoomFormDialogProps> = ({
    title,
    open,
    onOpenChange,
    handleSave,
    laboratoryMaterial
}) => {
    const defaultFormData: LaboratoryMaterialInputDTO = {
        code: '',
        material_name: '',
        brand: '',
        stock: 0,
        unit: '',
        purchase_date: undefined,
        expiry_date: undefined,
        description: '',
        refill_date: undefined,
        student_price: null,
        lecturer_price: null,
        external_price: null
    }
    const [formData, setFormData] = useState<LaboratoryMaterialInputDTO>(defaultFormData);

    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
        if (laboratoryMaterial) {
            setFormData({
                code: laboratoryMaterial?.code ?? '',
                material_name: laboratoryMaterial?.materialName ?? '',
                brand: laboratoryMaterial?.brand ?? '',
                stock: laboratoryMaterial?.stock ?? 0,
                unit: laboratoryMaterial?.unit ?? '',
                purchase_date: laboratoryMaterial?.purchaseDate ?? undefined,
                expiry_date: laboratoryMaterial?.expiryDate ?? undefined,
                description: laboratoryMaterial?.description ?? '',
                refill_date: laboratoryMaterial?.refillDate ?? undefined,
                student_price: laboratoryMaterial.studentPrice.amount,
                lecturer_price: laboratoryMaterial.lecturerPrice.amount,
                external_price: laboratoryMaterial.externalPrice.amount,
            })
        } else {
            setFormData(defaultFormData)
        }
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { type, name, value } = e.target as HTMLInputElement;
        let newValue = value;
        if (type === "number") {
            if (newValue.length > 1 && newValue.startsWith('0')) {
                newValue = newValue.replace(/^0+/, '');
                if (newValue === '') newValue = '0';
            }
        }

        setFormData((prev) => ({ ...prev, [name]: newValue }));
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
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5" encType="multipart/form-data">
                    <ScrollArea className='h-full max-h-[70vh]'>
                        <div className="grid md:grid-cols-2 gap-x-2 gap-y-5 p-1">
                            <FormGroup
                                id="code"
                                label="Kode Bahan"
                                error={errors['code']}
                                required>
                                <Input
                                    type='text'
                                    id='code'
                                    name='code'
                                    value={formData['code'] || ''}
                                    onChange={laboratoryMaterial ? undefined : handleChange}
                                    placeholder='Kode Bahan'
                                    disabled={laboratoryMaterial ? true : false}
                                />
                            </FormGroup>
                            <FormGroup
                                id="material_name"
                                label="Nama Bahan"
                                error={errors['material_name']}
                                required>
                                <Input
                                    type='text'
                                    id='material_name'
                                    name='material_name'
                                    value={formData['material_name'] || ''}
                                    onChange={handleChange}
                                    placeholder='Nama Bahan'
                                />
                            </FormGroup>
                            <FormGroup
                                id="brand"
                                label="Merek Bahan"
                                error={errors['brand']}>
                                <Input
                                    type='text'
                                    id='brand'
                                    name='brand'
                                    value={formData['brand'] || ''}
                                    onChange={handleChange}
                                    placeholder='Merek Bahan'
                                />
                            </FormGroup>
                            <FormGroup
                                id="stock"
                                label="Stok Bahan"
                                error={errors['stock']}
                                required>
                                <Input
                                    type='number'
                                    id='stock'
                                    name='stock'
                                    value={formData['stock'] || ''}
                                    onChange={handleChange}
                                    placeholder='0'
                                />
                            </FormGroup>
                            <FormGroup
                                className="md:col-span-2"
                                id="unit"
                                label="Satuan Bahan"
                                error={errors['unit']}
                                required>
                                <Input
                                    type='text'
                                    id='unit'
                                    name='unit'
                                    value={formData['unit'] || ''}
                                    onChange={handleChange}
                                    placeholder='Satuan Bahan'
                                />
                            </FormGroup>

                            <FormGroup
                                id="purchase_date"
                                label="Tanggal Beli Bahan"
                                error={errors['purchase_date']}
                                required>
                                <Popover modal={true}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            data-empty={!formData['purchase_date']}
                                            className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal w-full"
                                        >
                                            <CalendarIcon />
                                            {formData['purchase_date'] ? format(formData['purchase_date'], "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={formData['purchase_date']} onSelect={(date: Date) => {
                                            setFormData({ ...formData, purchase_date: date })
                                        }} required />
                                    </PopoverContent>
                                </Popover>
                            </FormGroup>
                            <FormGroup
                                id="expiry_date"
                                label="Tanggal Kadaluarsa Bahan"
                                error={errors['expiry_date']}
                                required>
                                <Popover modal={true}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            data-empty={!formData['expiry_date']}
                                            className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal w-full"
                                        >
                                            <CalendarIcon />
                                            {formData['expiry_date'] ? format(formData['expiry_date'], "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={formData['expiry_date']} onSelect={(date: Date) => setFormData({ ...formData, expiry_date: date })} required />
                                    </PopoverContent>
                                </Popover>
                            </FormGroup>
                            <FormGroup
                                className="md:col-span-2"
                                id="student_price"
                                label="Harga Mahasiwa"
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
                                id="lecturer_price"
                                label="Harga Dosen"
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
                                id="external_price"
                                label="Harga Pihak External"
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
                                className="md:col-span-2"
                                id="description"
                                label="Keterangan Bahan"
                                error={errors['description']}>
                                <Textarea
                                    name="description"
                                    id="description"
                                    onChange={handleChange}
                                    placeholder='Keterangan'
                                    value={formData['description'] || ''}
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
                        <Button type="submit" onClick={handleSubmit}>
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default LaboratoryMaterialFormDialog

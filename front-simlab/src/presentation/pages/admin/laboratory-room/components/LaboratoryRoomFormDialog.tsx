import { LaboratoryRoomInputDTO } from '@/application/laboratory-room/LaboratoryRoomDTO';
import { LaboratoryRoomView } from '@/application/laboratory-room/LaboratoryRoomView';
import { UserSelectView } from '@/application/user/UserSelectView';
import { Combobox } from '@/presentation/components/custom/combobox';
import FormGroup from '@/presentation/components/custom/FormGroup';
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Input } from '@/presentation/components/ui/input';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { ApiResponse } from '@/presentation/shared/Types';
import React, { useEffect, useState } from 'react'

interface LaboratoryRoomFormDialogProps {
    title: string,
    open: boolean,
    laborans: UserSelectView[]
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>
    laboratoryRoom?: LaboratoryRoomView
}

const LaboratoryRoomFormDialog: React.FC<LaboratoryRoomFormDialogProps> = ({
    title,
    open,
    laborans,
    onOpenChange,
    handleSave,
    laboratoryRoom
}) => {
    const defaultFormData: LaboratoryRoomInputDTO = {
        name: '',
        floor: '',
        user_id: null,
        student_price: null,
        lecturer_price: null,
        external_price: null
    }
    const [formData, setFormData] = useState<LaboratoryRoomInputDTO>(defaultFormData);
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
        if (laboratoryRoom) {
            setFormData({
                name: laboratoryRoom.name,
                floor: laboratoryRoom.floor,
                user_id: laboratoryRoom.user?.id ?? null,
                student_price: laboratoryRoom.studentPrice.amount,
                lecturer_price: laboratoryRoom.lecturerPrice.amount,
                external_price: laboratoryRoom.externalPrice.amount,
            })
        } else {
            setFormData(defaultFormData)
        }
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { type, name, value } = e.target as HTMLInputElement;
        let newValue = value;
        if (type === "number") {
            if (newValue.length > 1 && newValue.startsWith('0')) {
                newValue = newValue.replace(/^0+/, '');
                if (newValue === '') newValue = '0';
            }
        }
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
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
                <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                    <ScrollArea className='h-full max-h-[70vh]'>
                        <div className='grid md:grid-cols-2 gap-x-2 gap-y-5 p-1'>
                            <FormGroup
                                className='md:col-span-2'
                                id='name'
                                label='Nama Ruangan'
                                error={errors['name']}
                                required>
                                <Input
                                    type='text'
                                    id='name'
                                    name='name'
                                    value={formData['name'] || ''}
                                    onChange={handleChange}
                                    placeholder='Nama Ruangan'
                                />
                            </FormGroup>
                            <FormGroup
                                id='floor'
                                label='Ruangan'
                                error={errors['floor']}
                                required>
                                <Select name='floor' value={formData['floor']} onValueChange={(value) =>
                                    handleChange({
                                        target: {
                                            name: 'floor',
                                            value: value
                                        }
                                    } as React.ChangeEvent<HTMLInputElement>)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Lantai" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Lantai</SelectLabel>
                                            <SelectItem value="Lantai 1">Lantai 1</SelectItem>
                                            <SelectItem value="Lantai 2">Lantai 2</SelectItem>
                                            <SelectItem value="Lantai 3">Lantai 3</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormGroup>
                            <FormGroup
                                id='user_id'
                                label='Petugas Laboran'
                                error={errors['user_id']}
                                required>
                                <Combobox
                                    options={laborans}
                                    value={formData.user_id?.toString() || ''}
                                    onChange={(val) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            user_id: val ? Number(val) : null
                                        }))
                                    }}
                                    placeholder="Pilih Laboran"
                                    optionLabelKey='name'
                                    optionValueKey='id'
                                />
                            </FormGroup>

                            <FormGroup
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
                                className='md:col-span-2'
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

export default LaboratoryRoomFormDialog

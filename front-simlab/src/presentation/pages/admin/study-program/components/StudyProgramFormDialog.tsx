import { MajorView } from '@/application/major/MajorView';
import { StudyProgramInputDTO } from '@/application/study-program/dto/StudyProgramDTO';
import { StudyProgramView } from '@/application/study-program/StudyProgramView';
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Label } from '@/presentation/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { ApiResponse } from '@/shared/Types';
import React, { useEffect, useState } from 'react'

interface StudyProgramFormDialogProps {
    title: string,
    open: boolean,
    data: any,
    major: MajorView[]
    dataId: number | null,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>
}

const StudyProgramFormDialog: React.FC<StudyProgramFormDialogProps> = ({
    title,
    open,
    data,
    major,
    dataId,
    onOpenChange,
    handleSave
}) => {
    const [formData, setFormData] = useState<StudyProgramInputDTO>({
        jurusan_id: null,
        name: ''
    });
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
    }, [open])

    useEffect(() => {
        if (dataId) {
            const selectedData = data.find((data: StudyProgramView) => data.id == dataId)

            setFormData({
                jurusan_id: selectedData.majorId,
                name: selectedData.name
            })
        } else {
            setFormData({
                jurusan_id: null,
                name: ''
            })
        }

    }, [dataId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='major'>
                            Nama Jurusan <span className="text-red-500">*</span>
                        </Label>
                        <Select name='jurusan_id' value={formData['jurusan_id'] !== null ? String(formData['jurusan_id']) : ''} onValueChange={(value) =>
                            handleChange({
                                target: {
                                    name: 'jurusan_id',
                                    value: value
                                }
                            } as React.ChangeEvent<HTMLInputElement>)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Jurusan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Jurusan</SelectLabel>
                                    {major?.map((option, index) => (
                                        <SelectItem key={index} value={option.id.toString()}>{option.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors['jurusan_id'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['jurusan_id']}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='testing_type'>
                            Nama Prodi <span className="text-red-500">*</span>
                        </Label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={formData['name'] || ''}
                            onChange={handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            placeholder='Nama Prodi'
                        />
                        {errors['name'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['name']}</p>
                        )}
                    </div>
                </form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSubmit}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default StudyProgramFormDialog

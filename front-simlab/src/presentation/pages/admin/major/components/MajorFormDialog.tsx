import { MajorInputDTO } from '@/application/major/MajorDTO';
import { MajorView } from '@/application/major/MajorView';
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Input } from '@/presentation/components/ui/input';
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { ApiResponse } from '@/presentation/shared/Types';
import React, { useEffect, useState } from 'react'
import { Combobox } from '@/presentation/components/custom/combobox';
import { FacultySelectView } from '@/application/faculty/FacultySelectView';
import FormGroup from '@/presentation/components/custom/FormGroup';

interface MajorFormDialogProps {
    title: string,
    open: boolean,
    faculties: FacultySelectView[]
    onOpenChange: (open: boolean) => void,
    handleSave: (data: MajorInputDTO) => Promise<void>
    major?: MajorView,
}

const MajorFormDialog: React.FC<MajorFormDialogProps> = ({
    title,
    open,
    faculties,
    onOpenChange,
    handleSave,
    major
}) => {
    const defaultFormData: MajorInputDTO = {
        faculty_id: null,
        code: null,
        name: ''
    }
    const [formData, setFormData] = useState<MajorInputDTO>(defaultFormData);
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})

        if (major) {
            setFormData({
                faculty_id: major.faculty?.id ?? null,
                code: major.code ?? null,
                name: major.name,
            })
        } else {
            setFormData(defaultFormData)
        }
    }, [open])

    const handleChange = (e: React.ChangeEvent) => {
        const { name, value } = e.target as HTMLInputElement;
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
                    <FormGroup
                        id='faculty_id'
                        label='Nama Fakultas'
                        error={errors['faculty_id']}
                        required>
                        <Combobox
                            options={faculties}
                            value={formData.faculty_id?.toString() || ''}
                            onChange={(val) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    faculty_id: val ? Number(val) : null
                                }))
                            }}
                            placeholder="Pilih Fakultas"
                            optionLabelKey='name'
                            optionValueKey='id'
                        />
                    </FormGroup>
                    <FormGroup
                        id='code'
                        label='Kode Jurusan'
                        error={errors['code']}>
                        <Input
                            type='text'
                            id='code'
                            name='code'
                            value={formData['code'] || ''}
                            onChange={handleChange}
                            placeholder='Kode Jurusan'
                        />
                    </FormGroup>
                    <FormGroup
                        id='name'
                        label='Nama Jurusan'
                        error={errors['name']}
                        required>
                        <Input
                            type='text'
                            id='name'
                            name='name'
                            value={formData['name'] || ''}
                            onChange={handleChange}
                            placeholder='Nama Jurusan'
                        />
                    </FormGroup>
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

export default MajorFormDialog

import { PracticumInputDTO } from '@/application/practicum/PracticumDTO'
import { PracticumView } from '@/application/practicum/PracticumView'
import { StudyProgramSelectView } from '@/application/study-program/StudyProgramSelectView'
import { Combobox } from '@/presentation/components/custom/combobox'
import FormGroup from '@/presentation/components/custom/FormGroup'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { Input } from '@/presentation/components/ui/input'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { ApiResponse } from '@/presentation/shared/Types'
import React, { useEffect, useState } from 'react'

interface PracticumFormDialogProps {
    title: string,
    open: boolean,
    studyProgram: StudyProgramSelectView[]
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>
    practicum?: PracticumView
}

const PracticumFormDialog: React.FC<PracticumFormDialogProps> = ({
    title,
    open,
    studyProgram,
    onOpenChange,
    handleSave,
    practicum
}) => {
    const defaultFormData: PracticumInputDTO = {
        code: '',
        name: '',
        study_program_id: null,
        sks: 0
    }
    const [formData, setFormData] = useState<PracticumInputDTO>(defaultFormData);
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
    }, [open])

    useEffect(() => {
        if (practicum) {
            setFormData({
                code: practicum.code,
                name: practicum.name ?? '',
                study_program_id: practicum.studyProgram?.id ?? null,
                sks: practicum.sks ?? 0
            })
        } else {
            setFormData(defaultFormData)
        }
    }, [open])

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
                <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                    <FormGroup
                        id='code'
                        label='Kode Mata Kuliah'
                        error={errors['code']}
                        required>
                        <Input
                            type='text'
                            id='code'
                            name='code'
                            value={formData['code'] || ''}
                            onChange={handleChange}
                            placeholder='Kode Mata Kuliah'
                        />
                    </FormGroup>
                    <FormGroup
                        id='name'
                        label='Nama Praktikum'
                        error={errors['name']}
                        required>
                        <Input
                            type='text'
                            id='name'
                            name='name'
                            value={formData['name'] || ''}
                            onChange={handleChange}
                            placeholder='Nama Praktikum'
                        />
                    </FormGroup>
                    <FormGroup
                        id='study_program_id'
                        label='Nama Prodi'
                        error={errors['study_program_id']}
                        required>
                        <Combobox
                            options={studyProgram}
                            value={formData.study_program_id?.toString() || ''}
                            onChange={(val) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    study_program_id: val ? Number(val) : null
                                }))
                            }}
                            placeholder="Pilih Prodi"
                            optionLabelKey='name'
                            optionValueKey='id'
                        />
                    </FormGroup>
                    <FormGroup
                        id='sks'
                        label='SKS'
                        error={errors['sks']}
                        required>
                        <Input
                            type='number'
                            id='sks'
                            name='sks'
                            value={formData['sks'] || ''}
                            onChange={handleChange}
                            placeholder='0'
                        />
                    </FormGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
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

export default PracticumFormDialog

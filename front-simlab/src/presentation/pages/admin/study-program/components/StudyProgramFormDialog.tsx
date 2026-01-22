import { MajorSelectView } from '@/application/major/MajorSelectView';
import { StudyProgramInputDTO } from '@/application/study-program/StudyProgramDTO';
import { StudyProgramView } from '@/application/study-program/StudyProgramView';
import { Combobox } from '@/presentation/components/custom/combobox';
import FormGroup from '@/presentation/components/custom/FormGroup';
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Input } from '@/presentation/components/ui/input';
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { ApiResponse } from '@/presentation/shared/Types';
import React, { useEffect, useState } from 'react'

interface StudyProgramFormDialogProps {
    title: string,
    open: boolean,
    majors: MajorSelectView[]
    onOpenChange: (open: boolean) => void,
    handleSave: (data: StudyProgramInputDTO) => Promise<void>
    studyProgram?: StudyProgramView
}

const StudyProgramFormDialog: React.FC<StudyProgramFormDialogProps> = ({
    title,
    open,
    majors,
    onOpenChange,
    handleSave,
    studyProgram
}) => {
    const defaultFormData: StudyProgramInputDTO = {
        major_id: null,
        name: ''
    }
    const [formData, setFormData] = useState<StudyProgramInputDTO>(defaultFormData);
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
    }, [open])

    useEffect(() => {
        if (studyProgram) {
            setFormData({
                major_id: studyProgram.major?.id ?? null,
                name: studyProgram.name ?? ''
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
                <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                    <FormGroup
                        id='major'
                        label='Nama Jurusan'
                        error={errors['major_id']}
                        required>
                        <Combobox
                            options={majors}
                            value={formData.major_id?.toString() || ''}
                            onChange={(val) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    major_id: val ? Number(val) : null
                                }))
                            }}
                            placeholder="Pilih Jurusan"
                            optionLabelKey='name'
                            optionValueKey='id'
                            testId='majors'
                        />
                    </FormGroup>
                    <FormGroup
                        id='Major'
                        label='Nama Prodi'
                        error={errors['name']}
                        required>
                        <Input
                            type='text'
                            id='name'
                            name='name'
                            value={formData['name'] || ''}
                            onChange={handleChange}
                            placeholder='Nama Prodi'
                        />
                    </FormGroup>
                </form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Tutup
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default StudyProgramFormDialog

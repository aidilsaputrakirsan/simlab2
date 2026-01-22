import React, { useEffect, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { ApiResponse } from '@/presentation/shared/Types'
import { Button } from '@/presentation/components/ui/button'
import { AcademicYearView } from '@/application/academic-year/AcademicYearView'
import { AcademicYearInputDTO } from '@/application/academic-year/AcademicYearDTO'
import { Input } from '@/presentation/components/ui/input'
import FormGroup from '@/presentation/components/custom/FormGroup'

interface AcademicYearFormDialogProps {
    title: string,
    open: boolean,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: AcademicYearInputDTO) => Promise<void>
    academicYear?: AcademicYearView
}

const AcademicYearFormDialog: React.FC<AcademicYearFormDialogProps> = ({
    title,
    open,
    onOpenChange,
    handleSave,
    academicYear
}) => {
    const defaultFormData = {
        name: ''
    }
    const [formData, setFormData] = useState<AcademicYearInputDTO>(defaultFormData);
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})

        if (academicYear) {
            setFormData({ name: academicYear?.name ?? '' })
        } else {
            setFormData(defaultFormData) // Add other required fields with default values here
        }
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            await handleSave(formData);
        } catch (e) {
            const error = e as ApiResponse
            if (error.errors) {
                processErrors(error.errors)
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
                <form onSubmit={handleSubmit} className='flex flex-col gap-5' encType='multipart/form-data'>
                    <FormGroup
                        id='name'
                        label='Tahun Akademik'
                        error={errors['name']}
                        required>
                        <Input
                            type='text'
                            id='name'
                            name='name'
                            value={formData['name'] || ''}
                            onChange={handleChange}
                            placeholder='Tahun Akademik'
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

export default AcademicYearFormDialog

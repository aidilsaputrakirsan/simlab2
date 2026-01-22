import { FacultyInputDTO } from '@/application/faculty/FacultyDTO'
import { FacultyView } from '@/application/faculty/FacultyView'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { ApiResponse } from '@/presentation/shared/Types'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import FormGroup from '@/presentation/components/custom/FormGroup'

interface FacultyFormDialogProps {
    title: string,
    open: boolean,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: FacultyInputDTO) => Promise<void>
    faculty?: FacultyView
}

const FacultyFormDialog: React.FC<FacultyFormDialogProps> = ({
    title,
    open,
    faculty,
    onOpenChange,
    handleSave
}) => {
    const defaultFormData: FacultyInputDTO = {
        code: '',
        name: ''
    }

    const [formData, setFormData] = useState<FacultyInputDTO>(defaultFormData)
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    useEffect(() => {
        setErrors({})
    }, [open])

    useEffect(() => {
        if (faculty) {
            setFormData({
                code: faculty?.code ?? '',
                name: faculty?.name ?? ''
            })
        } else {
            setFormData(defaultFormData)
        }
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await handleSave(formData)
        } catch (e) {
            const error = e as ApiResponse
            if (error.errors) {
                processErrors(error.errors)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-5' encType='multipart/form-data'>
                        <FormGroup
                            id='code'
                            label='Kode Fakultas'
                            error={errors['code']}>
                            <Input
                                    type='text'
                                    id='code'
                                    name='code'
                                    value={formData['code'] || ''}
                                    onChange={handleChange}
                                    placeholder='Kode Fakultas'
                                />
                        </FormGroup>
                        <FormGroup
                            id='name'
                            label='Nama Fakultas'
                            error={errors['name']} 
                            required>
                                <Input
                                    type='text'
                                    id='name'
                                    name='name'
                                    value={formData['name'] || ''}
                                    onChange={handleChange}
                                    placeholder='Nama Fakultas'
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
        </>
    )
}

export default FacultyFormDialog
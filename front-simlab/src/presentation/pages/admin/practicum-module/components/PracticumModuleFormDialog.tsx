import { PracticumModuleInputDTO } from '@/application/practicum-module/PracticumModuleDTO'
import { PracticumModuleView } from '@/application/practicum-module/PracticumModuleView'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { ApiResponse } from '@/presentation/shared/Types'
import React, { useEffect, useState } from 'react'
import { Input } from '@/presentation/components/ui/input'
import { Button } from '@/presentation/components/ui/button'
import { Combobox } from '@/presentation/components/custom/combobox'
import { PracticumSelectView } from '@/application/practicum/PracticumSelectView'
import FormGroup from '@/presentation/components/custom/FormGroup'

interface PracticumModuleFormDialogProps {
    title: string,
    open: boolean,
    practicums: PracticumSelectView[]
    onOpenChange: (open: boolean) => void,
    handleSave: (data: PracticumModuleInputDTO) => Promise<void>,
    practicumModule?: PracticumModuleView
}

const PracticumModuleFormDialog: React.FC<PracticumModuleFormDialogProps> = ({
    title,
    open,
    practicums,
    onOpenChange,
    handleSave,
    practicumModule
}) => {
    const defaultFormData: PracticumModuleInputDTO = {
        practicum_id: null,
        name: ''
    }

    const [formData, setFormData] = useState<PracticumModuleInputDTO>(defaultFormData)
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    useEffect(() => {
        setErrors({})

        if (practicumModule) {
            setFormData({
                practicum_id: practicumModule.practicum?.id ?? null,
                name: practicumModule.name ?? '',
            })
        } else {
            setFormData(defaultFormData)
        }
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='flex flex-col gap-5' encType='multipart/form-data'>
                    <FormGroup
                        id='faculty_id'
                        label='Practicum'
                        error={errors['practicum_id']}
                        required>
                        <Combobox
                            options={practicums}
                            value={formData.practicum_id?.toString() || ''}
                            onChange={(val) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    practicum_id: val ? Number(val) : null
                                }))
                            }}
                            placeholder="Pilih Praktkum"
                            optionLabelKey='name'
                            optionValueKey='id'
                        />
                    </FormGroup>
                    <FormGroup
                        id='name'
                        label='Nama Modul'
                        error={errors['name']}
                        required>
                        <Input
                            type='text'
                            id='name'
                            name='name'
                            value={formData['name'] || ''}
                            onChange={handleChange}
                            placeholder='Nama Modul'
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

export default PracticumModuleFormDialog
import { TestingCategoryInputDTO } from '@/application/testing-category/TestingCategoryDTO'
import { TestingCategoryView } from '@/application/testing-category/TestingCategoryView'
import FormGroup from '@/presentation/components/custom/FormGroup'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { Input } from '@/presentation/components/ui/input'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { ApiResponse } from '@/presentation/shared/Types'
import React, { useEffect, useState } from 'react'


interface TestingCategoryFormDialogProps {
    title: string,
    open: boolean,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: TestingCategoryInputDTO) => Promise<void>
    testingCategory?: TestingCategoryView,
}

const TestingCategoryFormDialog: React.FC<TestingCategoryFormDialogProps> = ({
    title,
    open,
    onOpenChange,
    handleSave,
    testingCategory
}) => {
    const defaultFormData: TestingCategoryInputDTO = {
        name: ''
    }

    const [formData, setFormData] = useState<TestingCategoryInputDTO>(defaultFormData)
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    useEffect(() => {
        setErrors({})
        if (testingCategory) {
            setFormData({ name: testingCategory.name })
        } else {
            setFormData(defaultFormData)
        }
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

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
                        label='Kategori Pengujian'
                        error={errors['name']}
                        required>
                        <Input
                            type='text'
                            id='name'
                            name='name'
                            value={formData['name'] || ''}
                            onChange={handleChange}
                            placeholder='Kategori Pengujian'
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

export default TestingCategoryFormDialog
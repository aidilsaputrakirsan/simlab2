import { PublicationCategoryInputDTO } from '@/application/publication-category/PublicationCategoryDTO';
import { PublicationCategoryView } from '@/application/publication-category/PublicationCategoryView';
import FormGroup from '@/presentation/components/custom/FormGroup';
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Input } from '@/presentation/components/ui/input';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { ApiResponse } from '@/presentation/shared/Types';
import React, { useEffect, useState } from 'react'

interface PublicationCategoryFormDialogProps {
    title: string,
    open: boolean,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: PublicationCategoryInputDTO) => Promise<void>
    category?: PublicationCategoryView
}

const PublicationCategoryFormDialog: React.FC<PublicationCategoryFormDialogProps> = ({
    title,
    open,
    onOpenChange,
    handleSave,
    category
}) => {
    const defaultFormData: PublicationCategoryInputDTO = {
        name: ''
    }

    const [formData, setFormData] = useState<PublicationCategoryInputDTO>(defaultFormData);
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
        if (category) {
            setFormData({ name: category.name ?? '' })
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
                <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                    <ScrollArea className='h-full max-h-[70vh]'>
                        <div className='flex flex-col gap-5 p-1'>
                            <FormGroup id='name' label='Nama Kategori Publikasi' error={errors['name']} required>
                                <Input type='text' id='name' name='name' value={formData['name'] || ''} onChange={handleChange} placeholder='Nama Kategori' />
                            </FormGroup>
                        </div>
                    </ScrollArea>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Tutup</Button>
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

export default PublicationCategoryFormDialog

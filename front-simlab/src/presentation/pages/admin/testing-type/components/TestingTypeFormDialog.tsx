import { TestingCategoryView } from '@/application/testing-category/TestingCategoryView';
import { TestingTypeInputDTO } from '@/application/testing-type/dtos/TestingTypeDTO';
import { TestingTypeView } from '@/application/testing-type/TestingTypeView';
import { Combobox } from '@/presentation/components/custom/combobox';
import FormGroup from '@/presentation/components/custom/FormGroup';
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Input } from '@/presentation/components/ui/input';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { ApiResponse } from '@/presentation/shared/Types';
import React, { useEffect, useState } from 'react'

interface TestingTypeFormDialogProps {
    title: string,
    open: boolean,
    testingCategories: TestingCategoryView[]
    onOpenChange: (open: boolean) => void,
    handleSave: (data: TestingTypeInputDTO) => Promise<void>
    testingType?: TestingTypeView
}

const TestingTypeFormDialog: React.FC<TestingTypeFormDialogProps> = ({
    title,
    open,
    testingCategories,
    onOpenChange,
    handleSave,
    testingType
}) => {
    const defaultFormData: TestingTypeInputDTO = {
        name: '',
        unit: '',
        student_price: null,
        lecturer_price: null,
        external_price: null,
        testing_category_id: null
    }

    const [formData, setFormData] = useState<TestingTypeInputDTO>(defaultFormData);
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
        if (testingType) {
            setFormData({
                name: testingType.name ?? '',
                unit: testingType.unit ?? '',
                student_price: testingType.studentPrice.amount ?? null,
                lecturer_price: testingType.lecturerPrice.amount ?? null,
                external_price: testingType.externalPrice.amount ?? null,
                testing_category_id: testingType.testingCategory?.id ?? null
            })
        } else {
            setFormData(defaultFormData)
        }
    }, [open])

    const handleChange = (e: React.ChangeEvent) => {
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                    <ScrollArea className='h-full max-h-[70vh]'>
                        <div className='flex flex-col gap-5 p-1'>
                            <FormGroup
                                id='name'
                                label='Jenis Pengujian'
                                error={errors['name']}
                                required>
                                <Input
                                    type='text'
                                    id='name'
                                    name='name'
                                    value={formData['name'] || ''}
                                    onChange={handleChange}
                                    placeholder='Jenis Pengujian'
                                />
                            </FormGroup>
                            <FormGroup
                                id='unit'
                                label='Satuan Pengujian'
                                error={errors['unit']}
                                required>
                                <Input
                                    type='text'
                                    id='unit'
                                    name='unit'
                                    value={formData['unit'] || ''}
                                    onChange={handleChange}
                                    placeholder='Satuan Pengujian'
                                />
                            </FormGroup>
                            <FormGroup
                                id='testing_category_id'
                                label='Kategori Pengujian'
                                error={errors['testing_category_id']}
                                required>
                                <Combobox
                                    options={testingCategories}
                                    value={formData.testing_category_id?.toString() || ''}
                                    onChange={(val) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            testing_category_id: val ? Number(val) : 0
                                        }))
                                    }}
                                    placeholder="Pilih Kategori"
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

export default TestingTypeFormDialog

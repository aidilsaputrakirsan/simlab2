import { UserInputDTO } from '@/application/user/dto/UserDTO'
import { UserView } from '@/application/user/UserView'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { ApiResponse } from '@/shared/Types'
import React, { useEffect, useState } from 'react'

interface LaboranFormDialogProps {
    title: string,
    open: boolean,
    data: any,
    dataId: number | null,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>
}

const LaboranFormDialog: React.FC<LaboranFormDialogProps> = ({
    title,
    open,
    data,
    dataId,
    onOpenChange,
    handleSave
}) => {
    const [formData, setFormData] = useState<UserInputDTO>({
        name: '',
        email: '',
        role: 'Laboran',
        identity_num: '',
        password: ''
    });
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
    }, [open])

    useEffect(() => {
        if (dataId) {
            const foundData = data.find((data: UserView) => data.id == dataId);
            const laboranData: UserInputDTO = {
                name: foundData?.name || '',
                email: foundData?.email || '',
                role: 'Laboran',
                identity_num: foundData?.identity_num || '',
                password: ''
            }
            setFormData(laboranData)
        } else {
            setFormData({
                name: '',
                email: '',
                role: 'Laboran',
                identity_num: '',
                password: ''
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
                <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='email'>
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type='email'
                            id='email'
                            name='email'
                            value={formData['email'] || ''}
                            onChange={dataId ? undefined : handleChange}
                            placeholder='Email'
                            disabled={dataId ? true : false}
                        />
                        {errors['email'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['email']}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='name'>
                            Nama Petugas Laboran <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type='text'
                            id='name'
                            name='name'
                            value={formData['name'] || ''}
                            onChange={handleChange}
                            placeholder='Nama Petugas Laboran'
                        />
                        {errors['name'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['name']}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='password'>
                            Password <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type='password'
                            id='password'
                            name='password'
                            value={formData['password'] || ''}
                            onChange={handleChange}
                            placeholder='*****'
                        />
                        {errors['password'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['password']}</p>
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

export default LaboranFormDialog

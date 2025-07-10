import React, { useEffect, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogDescription, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { ApiResponse } from '@/shared/Types'
import { Button } from '@/presentation/components/ui/button'
import { UserView } from '@/application/user/UserView'
import { Label } from '@/presentation/components/ui/label'
import { Input } from '@/presentation/components/ui/input'

interface AdminFormDialogProps {
    title: string,
    open: boolean,
    data: any
    dataId: number | null,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>
}

const AdminFormDialog: React.FC<AdminFormDialogProps> = ({ title, open, onOpenChange, data, dataId, handleSave }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
    }, [open])

    useEffect(() => {
        if (dataId) {
            const adminData = {
                name: data.find((data: UserView) => data.id == dataId).name,
                email: data.find((data: UserView) => data.id == dataId).email,
                password: null,
                role: data.find((data: UserView) => data.id == dataId).role
            }
            setFormData(adminData)
        } else {
            setFormData({})
        }
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            role: 'Admin',
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
                <form>
                    <div className="mb-4">
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
                    <div className="mb-4">
                        <label htmlFor='name'>
                            Nama Petugas Laboran <span className="text-red-500">*</span>
                        </label>
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
                    <div className="mb-4">
                        <label htmlFor='password'>
                            Password
                        </label>
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

export default AdminFormDialog

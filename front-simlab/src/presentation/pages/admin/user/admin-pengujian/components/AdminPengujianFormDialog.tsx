import { UserInputDTO } from '@/application/user/UserDTO'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { UserView } from '@/application/user/UserView'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { ApiResponse } from '@/presentation/shared/Types'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ScrollArea } from '@/presentation/components/ui/scroll-area'
import { Label } from '@/presentation/components/ui/label'
import { Input } from '@/presentation/components/ui/input'
import { Button } from '@/presentation/components/ui/button'

interface AdminPengujianFormDialogProps {
    title: string,
    open: boolean,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>,
    adminPengujian?: UserView
}

const AdminPengujianFormDialog: React.FC<AdminPengujianFormDialogProps> = ({
    title,
    open,
    onOpenChange,
    handleSave,
    adminPengujian
}) => {
    const defaultFormData: UserInputDTO = {
        name: null,
        email: null,
        role: 'admin_pengujian',
        study_program_id: null,
        identity_num: null,
        password: null
    }
    const [formData, setFormData] = useState<UserInputDTO>(defaultFormData);
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
        if (adminPengujian) {
            setFormData({
                name: adminPengujian.name,
                email: adminPengujian.email,
                role: 'admin_pengujian',
                study_program_id: adminPengujian.studyProgram?.id ?? null,
                identity_num: adminPengujian.identityNum,
                password: ''
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
            toast.error(error.message)
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
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='email'>
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <div>
                                    <Input
                                        type='email'
                                        id='email'
                                        name='email'
                                        value={formData['email'] || ''}
                                        onChange={adminPengujian ? undefined : handleChange}
                                        placeholder='Email'
                                        disabled={adminPengujian ? true : false}
                                    />
                                    {errors['email'] && (
                                        <p className="mt-1 text-xs italic text-red-500">{errors['email']}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='name'>
                                    Nama <span className="text-red-500">*</span>
                                </Label>
                                <div>
                                    <Input
                                        type='text'
                                        id='name'
                                        name='name'
                                        value={formData['name'] || ''}
                                        onChange={handleChange}
                                        placeholder='Nama'
                                    />
                                    {errors['name'] && (
                                        <p className="mt-1 text-xs italic text-red-500">{errors['name']}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='password'>
                                    Password <span className="text-red-500">*</span>
                                </Label>
                                <div>
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
                            </div>
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

export default AdminPengujianFormDialog
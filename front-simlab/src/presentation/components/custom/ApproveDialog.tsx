import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogDescription
} from '@/presentation/components/ui/dialog'
import { Button } from '@/presentation/components/ui/button'
import { Textarea } from '../ui/textarea'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { toast } from 'sonner'
import { ApiResponse } from '@/presentation/shared/Types'
import FormGroup from './FormGroup'

interface ApproveDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    handleSave: (information: string) => Promise<void>
    isInformationRequired?: boolean
    title?: string,
    message?: string,
    buttonLabel?: string,
}

const ApproveDialog: React.FC<ApproveDialogProps> = ({
    open,
    onOpenChange,
    handleSave,
    isInformationRequired,
    title,
    message,
    buttonLabel
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [information, setInformation] = useState<string>('')
    const { errors, processErrors } = useValidationErrors()

    useEffect(() => {
        setInformation('')
    }, [open])

    const onSubmit = async () => {
        setIsSubmitting(true)
        try {
            await handleSave(information)
            onOpenChange(false)
        } catch (e) {
            const error = e as ApiResponse
            toast.error(error.message || 'Gagal submit')

            if (error.errors) {
                processErrors(error.errors);
            }
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title || 'Konfirmasi Verifikasi'}</DialogTitle>
                    <DialogDescription>{message || 'Apakah Anda yakin ingin melanjutkan proses verifikasi?'}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-5">
                    <FormGroup
                        id='name'
                        label={`Catatan ${!isInformationRequired ? '(*optional)' : ''}`}
                        error={errors['information']}
                        required={isInformationRequired}>
                        <Textarea
                            id="reason"
                            value={information}
                            onChange={e => setInformation(e.target.value)}
                            placeholder="Masukkan Catatan"
                            rows={4}
                        />
                    </FormGroup>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Batal</Button>
                    </DialogClose>
                    <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Memproses...' : (buttonLabel || 'Verifikasi')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ApproveDialog
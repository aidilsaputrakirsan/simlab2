import { PaymentInputProofDTO } from '@/application/payment/dto/PaymentDTO';
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { ApiResponse } from '@/presentation/shared/Types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogDescription
} from '@/presentation/components/ui/dialog'
import React, { useEffect, useState } from 'react'
import FormGroup from '@/presentation/components/custom/FormGroup';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import { toast } from 'sonner';
import { PaymentView } from '@/application/payment/PaymentView';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import { Eye } from 'lucide-react';

interface PaymentProofFormDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>,
    paymentId: number | null
}

const PaymentProofFormDialog: React.FC<PaymentProofFormDialogProps> = ({
    open,
    onOpenChange,
    handleSave,
    paymentId
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { errors, processErrors, setErrors } = useValidationErrors()

    const [formData, setFormData] = useState<PaymentInputProofDTO>({
        payment_proof: null
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, type, value } = e.target;

        if (type == 'file') {
            setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).files ? (e.target as HTMLInputElement).files![0] : null }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const { paymentService } = useDepedencies()
    const [payment, setPayment] = useState<PaymentView>()

    useEffect(() => {
        const loadSteps = async () => {
            const res = await paymentService.getPaymentData(paymentId ?? 0)
            setPayment(res.data)
        }

        loadSteps()
    }, [paymentId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({})

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
                    <DialogTitle>{'Buat Pembayaran'}</DialogTitle>
                    <DialogDescription>{'Lengkapi nomor pembayaran, VA, dan lampirkan invoice'}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-5">
                    <FormGroup
                        id='payment_number'
                        label={`No Pembayaran`}
                        required>
                        <Input
                            type='text'
                            id='payment_number'
                            name='payment_number'
                            value={payment?.paymentNumber}
                            placeholder='No Pembayaran'
                            disabled
                        />
                    </FormGroup>
                    <FormGroup
                        id='va_number'
                        label={`No Virtual Account`}
                        required>
                        <Input
                            type='text'
                            id='va_number'
                            name='va_number'
                            value={payment?.vaNumber}
                            placeholder='No Virtual Account'
                            disabled
                        />
                    </FormGroup>
                    <FormGroup
                        id='invoice_file'
                        label='File Invoice'>
                        {payment?.invoiceFile ? (
                            <a href={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/${payment.invoiceFile}`} className='w-full' target='_blank'>
                                <Button className='w-full'>Open File <Eye /></Button>
                            </a>
                        ) : (
                            <Button variant={'secondary'}>N/A</Button>
                        )}
                    </FormGroup>
                        <hr />
                    <FormGroup
                        id='payment_proof'
                        label='Bukti Pembayaran'
                        error={errors['payment_proof']}
                        required>
                        <Input
                            type='file'
                            id='payment_proof'
                            name='payment_proof'
                            onChange={handleChange}
                        />
                    </FormGroup>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Batal</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Memproses...' : 'Buat'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PaymentProofFormDialog
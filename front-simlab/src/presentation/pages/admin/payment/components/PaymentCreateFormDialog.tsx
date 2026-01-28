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
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { PaymentInputDTO } from '@/application/payment/dto/PaymentDTO';
import FormGroup from '@/presentation/components/custom/FormGroup';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import { ApiResponse } from '@/presentation/shared/Types';
import { toast } from 'sonner';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';

interface PaymentCreateFormDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>
}

const PaymentCreateFormDialog: React.FC<PaymentCreateFormDialogProps> = ({
    open,
    onOpenChange,
    handleSave,
}) => {
    const { paymentService } = useDepedencies()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingNumber, setIsLoadingNumber] = useState(false);
    const { errors, processErrors, setErrors } = useValidationErrors()

    const [formData, setFormData] = useState<PaymentInputDTO>({
        payment_number: '',
        va_number: '',
        invoice_file: null
    });

    useEffect(() => {
        const fetchPaymentNumber = async () => {
            if (open) {
                setIsLoadingNumber(true);
                try {
                    const paymentNumber = await paymentService.generatePaymentNumber();
                    setFormData(prev => ({ ...prev, payment_number: paymentNumber }));
                } catch (error) {
                    console.error('Failed to generate payment number:', error);
                } finally {
                    setIsLoadingNumber(false);
                }
            }
        };

        fetchPaymentNumber();
    }, [open]);

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
                        error={errors['payment_number']}
                        required>
                        <Input
                            type='text'
                            id='payment_number'
                            name='payment_number'
                            value={formData.payment_number || ''}
                            placeholder={isLoadingNumber ? 'Memuat...' : 'No Pembayaran'}
                            disabled={isLoadingNumber}
                            readOnly
                            className='bg-muted'
                        />
                    </FormGroup>
                    <FormGroup
                        id='va_number'
                        label={`No Virtual Account`}
                        error={errors['va_number']}
                        required>
                        <Input
                            type='text'
                            id='va_number'
                            name='va_number'
                            onChange={handleChange}
                            placeholder='No Virtual Account'
                        />
                    </FormGroup>
                    <FormGroup
                        id='invoice_file'
                        label='File Invoice'
                        error={errors['invoice_file']}>
                        <Input
                            type='file'
                            id='invoice_file'
                            name='invoice_file'
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

export default PaymentCreateFormDialog
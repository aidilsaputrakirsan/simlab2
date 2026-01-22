import { Payment } from "@/domain/payment/Payment"
import { PaymentStatus } from "@/domain/payment/PaymentStatus"

export type PaymentAPI = {
    id: number,
    payment_number: string,
    amount: number,
    invoice_file: string,
    payment_proof: string,
    va_number: string
    status: string
}

export function toDomain(api: PaymentAPI): Payment {
    return new Payment(
        api.id,
        api.payment_number,
        api.amount,
        api.invoice_file,
        api.payment_proof,
        api.va_number,
        api.status as PaymentStatus
    )
}
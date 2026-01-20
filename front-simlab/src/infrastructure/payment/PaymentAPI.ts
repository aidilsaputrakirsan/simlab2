import { Payment, PaymentUser } from "@/domain/payment/Payment"
import { PaymentStatus } from "@/domain/payment/PaymentStatus"

export type PaymentUserAPI = {
    name: string;
    email: string;
    study_program: string | null;
    institution: string | null;
}

export type PaymentAPI = {
    id: number,
    payment_number: string,
    amount: number,
    invoice_file: string,
    payment_proof: string,
    va_number: string,
    status: string,
    payment_type: string,
    payment_category: string,
    payable_id: number,
    user: PaymentUserAPI | null,
}

export function toDomain(api: PaymentAPI): Payment {
    const user: PaymentUser | null = api.user ? {
        name: api.user.name,
        email: api.user.email,
        studyProgram: api.user.study_program,
        institution: api.user.institution
    } : null;

    return new Payment(
        api.id,
        api.payment_number,
        api.amount,
        api.invoice_file,
        api.payment_proof,
        api.va_number,
        api.status as PaymentStatus,
        api.payment_type,
        api.payment_category,
        api.payable_id,
        user,
    )
}
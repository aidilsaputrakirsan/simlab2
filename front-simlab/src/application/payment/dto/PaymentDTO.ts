export interface PaymentInputDTO {
    payment_number: string,
    va_number: string,
    invoice_file: string | File | null;
}

export interface PaymentInputProofDTO {
    payment_proof: string | File | null
}
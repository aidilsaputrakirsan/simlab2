export interface PaymentInputDTO {
    payment_number: string,
    va_number: string,
    invoice_file: string | File | null;
}

export interface PaymentInputProofDTO {
    payment_proof: string | File | null
}

export interface PaymentTableParam {
    page: number,
    per_page: number,
    search: string,
}

export interface PaymentVerifDTO {
    action: 'approved' | 'rejected';
    receipt_file?: File | null;
}
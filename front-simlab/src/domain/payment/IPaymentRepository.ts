import { ApiResponse } from "@/presentation/shared/Types"
import { Payment } from "./Payment"

export interface IPaymentRepository {
    createPayment(id: number, data: {
        payment_number: string | null,
        va_number: string | null,
        invoice_file: string | File | null
    }): Promise<ApiResponse>
    storePaymentProof(id: number, data: {
        payment_proof: string | File | null
    }): Promise<ApiResponse>
    getPaymentData(id: number): Promise<ApiResponse<Payment>>
    verif(id: number, data:{action: 'approved' | 'rejected'}): Promise<ApiResponse>
}
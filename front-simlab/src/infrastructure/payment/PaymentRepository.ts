import { IPaymentRepository } from "@/domain/payment/IPaymentRepository";
import { ApiResponse } from "@/presentation/shared/Types";
import { fetchApi, jsonToFormData } from "../ApiClient";
import { Payment } from "@/domain/payment/Payment";
import { PaymentAPI, toDomain } from "./PaymentAPI";

export class PaymentRepository implements IPaymentRepository {
    async createPayment(id: number, data: { payment_number: string | null; va_number: string | null; invoice_file: string | File | null; }): Promise<ApiResponse> {
        const bodyFormData = jsonToFormData(data, 'PUT')
        console.log(bodyFormData);

        const response = await fetchApi(`/payments/${id}/create-payment`, {
            method: 'POST',
            body: bodyFormData
        });

        const json = await response.json() as ApiResponse
        if (response.ok) {
            return json
        }
        throw json
    }
    async storePaymentProof(id: number, data: { payment_proof: string | File | null; }): Promise<ApiResponse> {
        const bodyFormData = jsonToFormData(data, 'PUT')
        const response = await fetchApi(`/payments/${id}/store-proof`, {
            method: 'POST',
            body: bodyFormData
        });

        const json = await response.json() as ApiResponse
        if (response.ok) {
            return json
        }
        throw json
    }

    async getPaymentData(id: number): Promise<ApiResponse<Payment>> {
        const response = await fetchApi(`/payments/${id}`, {
            method: 'GET'
        })

        const json = await response.json() as ApiResponse
        if (response.ok) {
            const data = json.data as PaymentAPI
            return {
                ...json,
                data: toDomain(data)
            }
        }
        throw json
    }

    async verif(id: number, data: { action: "approved" | "rejected"; }): Promise<ApiResponse> {
        const response = await fetchApi(`/payments/${id}/verif`, {
            method: 'PUT',
            body: JSON.stringify(data)
        })

        const json = await response.json() as ApiResponse
        if (response.ok) {
            return json
        }
        throw json
    }
}
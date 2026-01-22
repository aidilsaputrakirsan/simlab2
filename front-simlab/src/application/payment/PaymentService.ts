import { IPaymentRepository } from "@/domain/payment/IPaymentRepository";
import { PaymentRepository } from "@/infrastructure/payment/PaymentRepository";
import { PaymentInputDTO, PaymentInputProofDTO } from "./dto/PaymentDTO";
import { ApiResponse } from "@/presentation/shared/Types";
import { PaymentView } from "./PaymentView";

export class PaymentService {
    private readonly paymentRepository: IPaymentRepository = new PaymentRepository()

    async createPayment(id: number, data: PaymentInputDTO): Promise<ApiResponse> {
        return await this.paymentRepository.createPayment(id, data)
    }

    async storePaymentProof(id: number, data: PaymentInputProofDTO): Promise<ApiResponse> {
        return await this.paymentRepository.storePaymentProof(id, data)
    }

    async getPaymentData(id: number): Promise<ApiResponse<PaymentView>> {
        const payment = await this.paymentRepository.getPaymentData(id)

        return {
            ...payment,
            data: payment.data ? PaymentView.fromDomain(payment.data) : undefined
        }
    }

    async verif(id: number, data: {action: 'approved' | 'rejected'}): Promise<ApiResponse> {
        return await this.paymentRepository.verif(id, data)
    }
}
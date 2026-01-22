import { PaymentStatus } from "@/domain/payment/PaymentStatus";
import { MoneyView } from "../money/MoneyView";
import { Payment } from "@/domain/payment/Payment";

export class PaymentView {
    constructor(
        readonly id: number,
        readonly paymentNumber: string,
        readonly amount: MoneyView,
        readonly invoiceFile: string,
        readonly paymentProof: string,
        readonly vaNumber: string,
        readonly status: PaymentStatus
    ) { }

    static fromDomain(entity: Payment): PaymentView {
        return new PaymentView(
            entity.id,
            entity.paymentNumber,
            MoneyView.toViewModel(entity.amount),
            entity.invoiceFile,
            entity.paymentProof,
            entity.vaNumber,
            entity.status 
        )
    }
}
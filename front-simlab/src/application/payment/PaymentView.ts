import { PaymentStatus } from "@/domain/payment/PaymentStatus";
import { MoneyView } from "../money/MoneyView";
import { Payment } from "@/domain/payment/Payment";

export interface PaymentUserView {
    readonly name: string;
    readonly email: string;
    readonly studyProgram: string | null;
    readonly institution: string | null;
}

export class PaymentView {
    constructor(
        readonly id: number,
        readonly paymentNumber: string,
        readonly amount: MoneyView,
        readonly invoiceFile: string,
        readonly paymentProof: string,
        readonly vaNumber: string,
        readonly status: PaymentStatus,
        readonly paymentType: string,
        readonly paymentCategory: string,
        readonly payableId: number,
        readonly user: PaymentUserView | null,
    ) { }

    static fromDomain(entity: Payment): PaymentView {
        const userView: PaymentUserView | null = entity.user ? {
            name: entity.user.name,
            email: entity.user.email,
            studyProgram: entity.user.studyProgram,
            institution: entity.user.institution
        } : null;

        return new PaymentView(
            entity.id,
            entity.paymentNumber,
            MoneyView.toViewModel(entity.amount),
            entity.invoiceFile,
            entity.paymentProof,
            entity.vaNumber,
            entity.status,
            entity.paymentType,
            entity.paymentCategory,
            entity.payableId,
            userView,
        )
    }
}
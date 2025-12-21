import { PaymentStatus } from "./PaymentStatus";

export class Payment {
    constructor(
        readonly id: number,
        readonly paymentNumber: string,
        readonly amount: number,
        readonly invoiceFile: string,
        readonly paymentProof: string,
        readonly vaNumber: string,
        readonly status: PaymentStatus
    ){}
}
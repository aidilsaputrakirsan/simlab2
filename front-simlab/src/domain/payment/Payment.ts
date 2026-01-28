import { PaymentStatus } from "./PaymentStatus";

export interface PaymentUser {
    readonly name: string;
    readonly email: string;
    readonly studyProgram: string | null;
    readonly institution: string | null;
}

export class Payment {
    constructor(
        readonly id: number,
        readonly userId: number,
        readonly paymentNumber: string,
        readonly amount: number,
        readonly invoiceFile: string,
        readonly paymentProof: string,
        readonly receiptFile: string,
        readonly vaNumber: string,
        readonly status: PaymentStatus,
        readonly paymentType: string,
        readonly paymentCategory: string,
        readonly payableId: number,
        readonly payableStatus: string | null,
        readonly canVerif: number | null,
        readonly user: PaymentUser | null,
    ){}
}
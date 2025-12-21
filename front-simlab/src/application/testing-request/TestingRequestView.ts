import { TestingRequestStatus } from "@/domain/testing-request/TestingRequestStatus"
import { TimeView } from "../time/TimeView"
import { TestingRequest } from "@/domain/testing-request/TestingRequest"
import { TestingRequestItemView } from "@/application/testing-request/TestingRequestItemView"
import { PaymentStatus } from "@/domain/payment/PaymentStatus"
import { Requestor } from "@/domain/shared/value-object/Requestor"
import { Laboran } from "@/domain/shared/value-object/Laboran"

export class TestingRequestView {
    constructor(
        readonly id: number,
        readonly academicYear: string,
        readonly phoneNumber: string,
        readonly activityName: string,
        readonly supervisor: string | null,
        readonly supervisorEmail: string | null,
        readonly testingTime: TimeView,
        readonly status: TestingRequestStatus,
        readonly information: string | null,
        readonly resultFile: string | null,
        readonly createdAt: TimeView | null,
        readonly updatedAt: TimeView | null,
        readonly testingRequestItems: TestingRequestItemView[],
        
        readonly hasPaidItems: boolean,
        readonly paymentStatus: PaymentStatus,
        readonly paymentId: number,
        readonly isInvoiceHasUploaded: boolean,
        readonly isPaymentProofHasUploaded: boolean,
        readonly requestor?: Requestor,
        readonly laboran?: Laboran,
        readonly canVerif?: number,
    ) { }

    static fromDomain(entity: TestingRequest): TestingRequestView {
        return new TestingRequestView(
            entity.id,
            entity.academicYear,
            entity.phoneNumber,
            entity.activityName,
            entity.supervisor,
            entity.supervisorEmail,
            TimeView.fromDomain(entity.testingTime),
            entity.status,
            entity.information,
            entity.resultFile,
            entity.createdAt ? TimeView.fromDomain(entity.createdAt) : null,
            entity.updatedAt ? TimeView.fromDomain(entity.updatedAt) : null,
            entity.getTestingRequestItems().map(TestingRequestItemView.fromDomain),
            entity.hasPaidItems,
            entity.paymentStatus,
            entity.paymentId,
            entity.isInvoiceHasUploaded,
            entity.isPaymentProofHasUploaded,
            entity.getRequestor(),
            entity.getLaboran(),
            entity.getCanVerif(),
        )
    }
}
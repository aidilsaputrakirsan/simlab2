import { TestingRequestStatus } from "@/domain/testing-request/TestingRequestStatus"
import { TimeView } from "../time/TimeView"
import { TestingRequest } from "@/domain/testing-request/TestingRequest"
import { TestingRequestItemView } from "@/application/testing-request/TestingRequestItemView"

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

        readonly requestor?: {
            name: string,
            email: string
        },
        readonly laboran?: {
            name: string,
            email: string
        },
        readonly canVerif?: number
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
            entity.getTestingRequestItems().map((item) => TestingRequestItemView.fromDomain(item)),
            entity.getRequestor(),
            entity.getLaboran(),
            entity.getCanVerif()
        )
    }
}
import { TestingRequestStatus } from "@/domain/testing-request/TestingRequestStatus"
import { TimeView } from "../time/TimeView"
import { TestRequest } from "@/domain/testing-request/TestingRequest"

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
        
        readonly requestor?: {
            name: string,
            email: string
        },
        readonly laboran?: {
            name: string,
            email: string
        }
    ) { }

    static fromDomain(entity: TestRequest): TestingRequestView {
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
            entity.getRequestor(),
            entity.getLaboran()
        )
    }
}
import { TestingRequestApprovalAction } from "@/domain/testing-request/TestingRequestApprovalAction";
import { TimeView } from "../time/TimeView";
import { TestingRequestApprovalStatus } from "@/domain/testing-request/TestingRequestApprovalStatus";
import { TestingRequestApproval } from "@/domain/testing-request/TestingRequestApproval";

export class TestingRequestApprovalView {
    constructor(
        readonly id: number,
        readonly role: string,
        readonly action: TestingRequestApprovalAction,
        readonly status: TestingRequestApprovalStatus,
        readonly description: string,
        readonly information: string,
        readonly approvedAt?: TimeView,
        readonly approver?: string
    ) { }

    static fromDomain(entity: TestingRequestApproval): TestingRequestApprovalView {
        return new TestingRequestApprovalView(
            entity.id,
            entity.role,
            entity.action,
            entity.status,
            entity.description,
            entity.information,
            entity.approvedAt ? TimeView.fromDomain(entity.approvedAt) : undefined,
            entity.approver ?? undefined
        )
    }

    formatedRoleLabel(): string {
        return this.role
            .replace(/_/g, ' ') // replace underscores with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize each word
    }
}
import { TestingRequestApproval } from "@/domain/testing-request/TestingRequestApproval";
import { TestingRequestApprovalAction } from "@/domain/testing-request/TestingRequestApprovalAction";
import { TestingRequestApprovalStatus } from "@/domain/testing-request/TestingRequestApprovalStatus";
import { Time } from "@/domain/time/Time";

export type TestingRequestApprovalAPI = {
    id: number;
    role: string;
    action: string;
    status: string;
    description: string;
    information: string;
    approved_at?: string;
    approver?: string;
}

export function toDomain(api: TestingRequestApprovalAPI): TestingRequestApproval {
    return new TestingRequestApproval(
        api.id,
        api.role,
        api.action as TestingRequestApprovalAction,
        api.status as TestingRequestApprovalStatus,
        api.description,
        api.information,
        api.approved_at ? new Time(api.approved_at) : undefined,
        api.approver ?? undefined
    )
}
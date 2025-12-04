import { Time } from "../time/Time";
import { TestingRequestApprovalAction } from "./TestingRequestApprovalAction";
import { TestingRequestApprovalStatus } from "./TestingRequestApprovalStatus";

export class TestingRequestApproval {
    constructor(
        readonly id: number,
        readonly role: string,
        readonly action: TestingRequestApprovalAction,
        readonly status: TestingRequestApprovalStatus,
        readonly description: string,
        readonly information: string,
        readonly approvedAt?: Time,
        readonly approver?: string,
    ) { }
}
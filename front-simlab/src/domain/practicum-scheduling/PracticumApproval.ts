import { Time } from "../time/Time";
import { PracticumApprovalAction } from "./PracticumApprovalAction";
import { PracticumApprovalStatus } from "./PracticumApprovalStatus";

export class PracticumApproval {
    constructor(
        readonly id: number,
        readonly role: string,
        readonly action: PracticumApprovalAction,
        readonly status: PracticumApprovalStatus,
        readonly description: string,
        readonly information: string,
        readonly approvedAt?: Time,
        readonly approver?: string,
    ) { }
}
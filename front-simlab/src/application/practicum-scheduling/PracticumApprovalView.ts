import { PracticumApproval } from "@/domain/practicum-scheduling/PracticumApproval";
import { TimeView } from "../time/TimeView";
import { PracticumApprovalAction } from "@/domain/practicum-scheduling/PracticumApprovalAction";
import { PracticumApprovalStatus } from "@/domain/practicum-scheduling/PracticumApprovalStatus";

export class PracticumApprovalView {
    constructor(
        readonly id: number,
        readonly role: string,
        readonly action: PracticumApprovalAction,
        readonly status: PracticumApprovalStatus,
        readonly description: string,
        readonly information: string,
        readonly approvedAt?: TimeView,
        readonly approver?: string
    ) { }

    static fromDomain(entity: PracticumApproval): PracticumApprovalView {
        return new PracticumApprovalView(
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
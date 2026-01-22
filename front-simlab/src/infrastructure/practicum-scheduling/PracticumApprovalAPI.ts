import { PracticumApproval } from "@/domain/practicum-scheduling/PracticumApproval";
import { Time } from "@/domain/time/Time";
import { PracticumApprovalAction } from "@/domain/practicum-scheduling/PracticumApprovalAction";
import { PracticumApprovalStatus } from "@/domain/practicum-scheduling/PracticumApprovalStatus";

export type PracticumApprovalAPI = {
    id: number;
    role: string;
    action: string;
    status: string;
    description: string;
    information: string;
    approved_at?: string;
    approver?: string;
}

export function toDomain(api: PracticumApprovalAPI): PracticumApproval {
    return new PracticumApproval(
        api.id,
        api.role,
        api.action as PracticumApprovalAction,
        api.status as PracticumApprovalStatus,
        api.description,
        api.information,
        api.approved_at ? new Time(api.approved_at) : undefined,
        api.approver ?? undefined
    )
}
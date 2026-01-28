import { PracticumClass } from "@/domain/practicum-scheduling/PracticumClass";
import { TimeView } from "../time/TimeView";
import { PracticumSessionView } from "./PracticumSessionView";

export class PracticumClassView {
    private constructor(
        readonly id: number,
        readonly name: string,
        readonly practicumAssistant: string,
        readonly totalParticipant: number,
        readonly totalGroup: number,
        readonly lecturerId: number,
        readonly laboratoryRoomId: number,
        readonly createdAt: TimeView,
        readonly updatedAt: TimeView,
        readonly practicumSessions?: PracticumSessionView[],
        readonly lecturer?: {
            name: string,
            email: string,
            identityNum: string
        },
        readonly laboratoryRoomName?: string,
    ) { }

    static fromDomain(entity: PracticumClass): PracticumClassView {
        return new PracticumClassView(
            entity.id,
            entity.name,
            entity.practicumAssistant,
            entity.totalParticipant,
            entity.totalGroup,
            entity.lecturerId,
            entity.laboratoryRoomId,
            TimeView.fromDomain(entity.createdAt),
            TimeView.fromDomain(entity.updatedAt),
            entity.practicumSessions ? entity.practicumSessions.map(PracticumSessionView.fromDomain) : undefined,
            entity.getLecturer() ? {
                name: entity.getLecturer()!.name,
                email: entity.getLecturer()!.email,
                identityNum: entity.getLecturer()!.identityNumber
            } : undefined,
            entity.getLaboratoryRoomName(),
        )
    }
}
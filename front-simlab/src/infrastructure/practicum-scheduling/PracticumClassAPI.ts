import { PracticumClass } from "@/domain/practicum-scheduling/PracticumClass";
import { Time } from "@/domain/time/Time";
import { PracticumSessionAPI, toDomain as toPracticumSesion } from "./PracticumSessionAPI";
import { Lecturer } from "@/domain/shared/value-object/Lecturer";

export type PracticumClassAPI = {
    id: number;
    name: string;
    practicum_assistant: string;
    total_participant: number;
    total_group: number;
    created_at: string;
    updated_at: string;
    lecturer?: {
        name: string,
        email: string,
        identity_num: string
    },
    laboratory_room_name?: string,
    practicum_sessions: PracticumSessionAPI[]
}

export function toDomain(api: PracticumClassAPI): PracticumClass {
    const practicumClass = new PracticumClass(
        api.id,
        api.name,
        api.practicum_assistant,
        api.total_participant,
        api.total_group,
        new Time(api.created_at),
        new Time(api.updated_at),
        api.practicum_sessions ? api.practicum_sessions.map(toPracticumSesion) : undefined
    )

    if (api.laboratory_room_name) {
        practicumClass.setLaboratoryRoomName(api.laboratory_room_name)
    }

    if (api.lecturer) {
        const lecturer = new Lecturer(api.lecturer.name, api.lecturer.email, api.lecturer.identity_num)
        practicumClass.setLecturer(lecturer)
    }

    return practicumClass
}
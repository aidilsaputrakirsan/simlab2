import { Time } from "../time/Time";
import { PracticumSession } from "./PracticumSession";
import { Lecturer } from "../shared/value-object/Lecturer";

export class PracticumClass {
    private laboratoryRoomName?: string
    private laboratoryRoomPic?: string
    private lecturer?: Lecturer

    constructor(
        readonly id: number,
        readonly name: string,
        readonly practicumAssistant: string,
        readonly totalParticipant: number,
        readonly totalGroup: number,
        readonly lecturerId: number,
        readonly laboratoryRoomId: number,
        readonly createdAt: Time,
        readonly updatedAt: Time,
        readonly practicumSessions?: PracticumSession[]
    ) { }

    setLaboratoryRoomName(name: string) {
        this.laboratoryRoomName = name
    }

    setLaboratoryRoomPic(pic: string) {
        this.laboratoryRoomPic = pic
    }

    setLecturer(lecturerData: Lecturer) {
        this.lecturer = lecturerData
    }

    getLaboratoryRoomName(): string | undefined {
        return this.laboratoryRoomName
    }

    getLaboratoryRoomPic(): string | undefined {
        return this.laboratoryRoomPic
    }

    getLecturer(): Lecturer | undefined {
        return this.lecturer
    }
}
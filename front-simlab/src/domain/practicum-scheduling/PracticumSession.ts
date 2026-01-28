import { Time } from "../time/Time";

export class PracticumSession {
    private practicumModule?: string

    constructor(
        readonly id: number,
        readonly startTime: Time,
        readonly endTime: Time,
        readonly isClassConducted: number | null,
        readonly laboranComment: string | null,
        readonly laboranCommentedAt: Time | null,
        readonly lecturerComment: string | null,
        readonly lecturerCommentedAt: Time | null,
        readonly practicumModuleId: number | null,
    ) { }

    setPracticumModule(practicumModule: string) {
        this.practicumModule = practicumModule
    }

    getPracticumModule(): string | undefined {
        return this.practicumModule
    }
}
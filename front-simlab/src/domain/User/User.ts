import { Institution } from "../institution/Institution";
import { StudyProgram } from "../study-program/StudyProgram";
import { Time } from "../time/Time";
import { userRole } from "./UserRole";

export class User {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly email: string,
        readonly role: userRole,
        readonly identityNum: string,
        readonly isManager: boolean,
        readonly isActive: 'Active' | 'Deactive',
        readonly createdAt: Time | null,
        readonly updatedAt: Time | null,
        readonly institution?: Institution,
        readonly studyProgram?: StudyProgram,
    ){}
}
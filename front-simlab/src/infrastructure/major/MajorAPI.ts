import { Major } from "../../domain/major/Major";
import { FacultyAPI, toDomain as toFaculty } from "../faculty/FacultyAPI";

export type MajorAPI= {
    id: number;
    code: string;
    name: string;
    faculty?: FacultyAPI
}

export function toDomain(api: MajorAPI): Major {
    return new Major(
        api.id,
        api.code,
        api.name,
        api.faculty ? toFaculty(api.faculty) : undefined
    )
}
import { PracticumScheduling } from "@/domain/practicum-scheduling/PracticumScheduling";
import { PracticumSchedulingEquipmentAPI, toDomain as toPracticumSchedulingEquipment } from "./PracticumSchedulingEquipmentAPI";
import { PracticumSchedulingMaterialAPI, toDomain as toPracticumSchedulingMaterial } from "./PracticumSchedulingMaterialAPI";
import { Time } from "@/domain/time/Time";
import { PracticumSchedulingStatus } from "@/domain/practicum-scheduling/PracticumSchedulingStatus";
import { PracticumClassAPI, toDomain as toPracticumClass } from "./PracticumClassAPI";
import { Requestor } from "@/domain/shared/value-object/Requestor";
import { Laboran } from "@/domain/shared/value-object/Laboran";

export type PracticumSchedulingAPI = {
    id: number;
    academic_year: string,
    phone_number: number,
    requestor: {
        name: string,
        email: string,
        identity_num: string,
        study_program: string,
        institution: string
    },
    laboran: {
        name: string,
        email: string
    },
    status: string
    created_at: string;
    updated_at: string;
    canVerif: number;
    practicum_name: string;
    practicum_classes: PracticumClassAPI[];
    practicum_scheduling_equipments: PracticumSchedulingEquipmentAPI[];
    practicum_scheduling_materials: PracticumSchedulingMaterialAPI[];
}

export function toDomain(api: PracticumSchedulingAPI): PracticumScheduling {
    const practicumScheduling = new PracticumScheduling(
        api.id,
        api.academic_year,
        api.phone_number,
        api.status as PracticumSchedulingStatus,
        api.practicum_name,
        new Time(api.created_at),
        new Time(api.updated_at),
    )

    if (api.requestor) {
        const requestor = new Requestor(api.requestor.name, api.requestor.email, api.requestor.identity_num, api.requestor.study_program, api.requestor.institution)
        practicumScheduling.setRequestor(requestor)
    }

    if (api.laboran) {
        const laboran = new Laboran(api.laboran.name, api.laboran.email)
        practicumScheduling.setLaboran(laboran)
    }

    if (api.canVerif !== undefined) {
        practicumScheduling.setCanVerif(api.canVerif)
    }

    if (api.practicum_classes) {
        const items = api.practicum_classes.map(
            (item) => toPracticumClass(item)
        )
        practicumScheduling.setPracticumClasses(items)
    }

    if (api.practicum_scheduling_equipments) {
        const items = api.practicum_scheduling_equipments.map(
            (item) => toPracticumSchedulingEquipment(item)
        )
        practicumScheduling.setPracticumSchedlingEquipments(items)
    }

    if (api.practicum_scheduling_materials) {
        const items = api.practicum_scheduling_materials.map(
            (item) => toPracticumSchedulingMaterial(item)
        )
        practicumScheduling.setPracticumSchedlingMaterials(items)
    }

    return practicumScheduling
}
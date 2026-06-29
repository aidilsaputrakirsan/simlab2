import { Laboran } from "../shared/value-object/Laboran";
import { Requestor } from "../shared/value-object/Requestor";
import { Time } from "../time/Time";
import { PracticumClass } from "./PracticumClass";
import { PracticumSchedulingEquipment } from "./PracticumSchedulingEquipment";
import { PracticumSchedulingMaterial } from "./PracticumSchedulingMaterial";
import { PracticumSchedulingStatus } from "./PracticumSchedulingStatus";


export class PracticumScheduling {
    private laboran?: Laboran;
    private requestor?: Requestor
    private canVerif?: number
    private practicumSchedulingEquipments: PracticumSchedulingEquipment[] = []
    private practicumSchedulingMaterials: PracticumSchedulingMaterial[] = []
    private proposedMaterials: { id: number; name: string; quantity: string }[] = []
    private practicumClasses: PracticumClass[] = []

    constructor(
        readonly id: number,
        readonly academicYear: string,
        readonly practicumId: number,
        readonly phoneNumber: number,
        readonly status: PracticumSchedulingStatus,
        readonly practicumName: string,
        readonly createdAt: Time,
        readonly updatedAt: Time,
    ) { }

    setLaboran(laboran: Laboran) {
        this.laboran = laboran
    }

    setRequestor(requestor: Requestor) {
        this.requestor = requestor
    }

    setCanVerif(value: number) {
        this.canVerif = value
    }

    setPracticumSchedlingEquipments(items: PracticumSchedulingEquipment[]) {
        this.practicumSchedulingEquipments = items
    }

    setPracticumSchedlingMaterials(items: PracticumSchedulingMaterial[]) {
        this.practicumSchedulingMaterials = items
    }

    setProposedMaterials(items: { id: number; name: string; quantity: string }[]) {
        this.proposedMaterials = items
    }

    setPracticumClasses(items: PracticumClass[]) {
        this.practicumClasses = items
    }

    getLaboran(): Laboran | undefined {
        return this.laboran
    }

    getRequestor(): Requestor | undefined {
        return this.requestor
    }

    getCanVerif(): number | undefined {
        return this.canVerif
    }

    getPracticumSchedulingEquipments(): PracticumSchedulingEquipment[] {
        return this.practicumSchedulingEquipments
    }

    getPracticumSchedulingMaterials(): PracticumSchedulingMaterial[] {
        return this.practicumSchedulingMaterials
    }

    getProposedMaterials(): { id: number; name: string; quantity: string }[] {
        return this.proposedMaterials
    }

    getPracticumClasses(): PracticumClass[] {
        return this.practicumClasses
    }
}
import { Laboran } from "../shared/value-object/Laboran";
import { Requestor } from "../shared/value-object/Requestor";
import { Time } from "../time/Time";
import { BookingApproval } from "./BookingApproval";
import { BookingEquipment } from "./BookingEquipment";
import { BookingMaterial } from "./BookingMaterial";
import { BookingStatus } from "./BookingStatus";
import { BookingType } from "./BookingType";

export class Booking {
    private laboratoryRoomName?: string
    private requestor?: Requestor
    private laboran?: Laboran
    private academicYear?: string
    private bookingEquipments: BookingEquipment[] = []
    private bookingMaterial: BookingMaterial[] = []
    private bookingApprovals : BookingApproval[] = []
    private isRequestorCanReturn: boolean = false

    constructor(
        readonly id: number,
        readonly phoneNumber: string,
        readonly purpose: string,
        readonly supportingFile: string | null,
        readonly activityName: string,
        readonly supervisor: string | null,
        readonly supervisorEmail: string | null,
        readonly startTime: Time,
        readonly endTime: Time,
        readonly status: BookingStatus,
        readonly bookingType: BookingType,
        readonly totalParticipant: number,
        readonly participantList: string,
        readonly createdAt: Time,
        readonly updatedAt: Time,
        readonly isAllowedOffsite?: boolean,
    ) { }

    // === Setter Methods

    setLaboratoryRoomName(name: string) {
        this.laboratoryRoomName = name;
    }

    setLaboran(laboranData: Laboran) {
        this.laboran = laboranData
    }

    setRequestor(requestorData: Requestor) {
        this.requestor = requestorData;
    }

    setAcademicYearLabel(label: string) {
        this.academicYear = label;
    }

    setBookingEquipments(equipments: BookingEquipment[]) {
        this.bookingEquipments = equipments;
    }

    setBookingMaterial(materials: BookingMaterial[]) {
        this.bookingMaterial = materials;
    }

    setBookingApproval(approvals: BookingApproval[]) {
        this.bookingApprovals = approvals
    }

    setIsRequestorCanReturn(can_return: boolean) {
        this.isRequestorCanReturn = can_return
    }

    // === Getter Methods

    getLaboratoryRoomName(): string | undefined {
        return this.laboratoryRoomName;
    }

    getLaboran(): Laboran | undefined {
        return this.laboran
    }

    getRequestor(): Requestor | undefined {
        return this.requestor;
    }

    getAcademicYear(): string | undefined {
        return this.academicYear;
    }

    getEquipments(): BookingEquipment[] {
        return this.bookingEquipments;
    }

    getMaterials(): BookingMaterial[] {
        return this.bookingMaterial;
    }

    getApprovals(): BookingApproval[] {
        return this.bookingApprovals
    }
    
    getIsRequestorCanReturn(): boolean {
        return this.isRequestorCanReturn
    }
}
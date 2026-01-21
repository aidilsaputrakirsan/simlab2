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
    private roomPrice: number = 0
    private equipmentTotalPrice: number = 0
    private materialTotalPrice: number = 0
    private totalPrice: number = 0
    private hasPaidItems: boolean = false
    private paymentId?: number
    private paymentStatus?: string
    private isPaymentProofHasUploaded: boolean = false
    private canVerif: number = 2

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

    setPriceInfo(roomPrice: number, equipmentTotalPrice: number, materialTotalPrice: number, totalPrice: number, hasPaidItems: boolean) {
        this.roomPrice = roomPrice
        this.equipmentTotalPrice = equipmentTotalPrice
        this.materialTotalPrice = materialTotalPrice
        this.totalPrice = totalPrice
        this.hasPaidItems = hasPaidItems
    }

    setPaymentInfo(paymentId?: number, paymentStatus?: string, isPaymentProofHasUploaded?: boolean) {
        this.paymentId = paymentId
        this.paymentStatus = paymentStatus
        this.isPaymentProofHasUploaded = isPaymentProofHasUploaded ?? false
    }

    setCanVerif(canVerif: number) {
        this.canVerif = canVerif
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

    getRoomPrice(): number {
        return this.roomPrice
    }

    getEquipmentTotalPrice(): number {
        return this.equipmentTotalPrice
    }

    getMaterialTotalPrice(): number {
        return this.materialTotalPrice
    }

    getTotalPrice(): number {
        return this.totalPrice
    }

    getHasPaidItems(): boolean {
        return this.hasPaidItems
    }

    getPaymentId(): number | undefined {
        return this.paymentId
    }

    getPaymentStatus(): string | undefined {
        return this.paymentStatus
    }

    getIsPaymentProofHasUploaded(): boolean {
        return this.isPaymentProofHasUploaded
    }

    getCanVerif(): number {
        return this.canVerif
    }
}
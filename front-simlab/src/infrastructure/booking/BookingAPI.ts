import { Booking } from "@/domain/booking/Booking";
import { BookingStatus } from "@/domain/booking/BookingStatus";
import { BookingType } from "@/domain/booking/BookingType";
import { Time } from "@/domain/time/Time";
import { BookingEquipmentAPI, toDomain as toBookingEquipment } from "./BookingEquipmentAPI";
import { BookingMaterialAPI, toDomain as toBookingMaterial } from "./BookingMaterialAPI";
import { BookingApprovalAPI, toDomain as toBookingApproval } from "./BookingApprovalAPI";
import { Requestor } from "@/domain/shared/value-object/Requestor";
import { Laboran } from "@/domain/shared/value-object/Laboran";

export type BookingAPI = {
    id: number;
    phone_number: string;
    purpose: string;
    supporting_file: string | null;
    activity_name: string;
    supervisor: string | null,
    supervisor_email: string | null;
    start_time: string;
    end_time: string;
    status: string;
    booking_type: string;
    total_participant: number;
    participant_list: string;
    is_allowed_offsite: number
    created_at: string;
    updated_at: string;
    academic_year: string,
    requestor: {
        name: string,
        email: string,
        identity_num: string,
        study_program: string,
        institution: string
        is_mahasiswa: boolean
    };
    laboran: {
        name: string,
        email: string
    };
    laboratory_room_name: string
    booking_equipments: BookingEquipmentAPI[];
    booking_materials: BookingMaterialAPI[];
    approvals: BookingApprovalAPI[];
    is_requestor_can_return: number;
    // Price fields
    room_price: number;
    equipment_total_price: number;
    material_total_price: number;
    total_price: number;
    has_paid_items: boolean;
    payment_id?: number;
    payment_status?: string;
    is_payment_proof_has_uploaded?: boolean;
    canVerif?: number;
}

export function toDomain(api: BookingAPI): Booking {
    const booking = new Booking(
        api.id,
        api.phone_number,
        api.purpose,
        api.supporting_file,
        api.activity_name,
        api.supervisor,
        api.supervisor_email,
        new Time(api.start_time),
        new Time(api.end_time),
        api.status as BookingStatus,
        api.booking_type as BookingType,
        api.total_participant,
        api.participant_list,
        new Time(api.created_at),
        new Time(api.updated_at),
        api.is_allowed_offsite ? !!api.is_allowed_offsite : undefined,
    );

    if (api.is_requestor_can_return) {
        booking.setIsRequestorCanReturn(Boolean(api.is_requestor_can_return))
    }

    if (api.laboratory_room_name) {
        booking.setLaboratoryRoomName(api.laboratory_room_name);
    }

    if (api.requestor) {
        const requestor = new Requestor(api.requestor.name, api.requestor.email, api.requestor.identity_num, api.requestor.study_program, api.requestor.institution, api.requestor.is_mahasiswa)
        booking.setRequestor(requestor);
    }

    if (api.laboran) {
        const laboran = new Laboran(api.laboran.name, api.laboran.email)
        booking.setLaboran(laboran);
    }

    if (api.academic_year) {
        booking.setAcademicYearLabel(api.academic_year);
    }

    if (api.booking_equipments?.length) {
        const equipments = api.booking_equipments.map(
            (equipment) => toBookingEquipment(equipment)
        );
        booking.setBookingEquipments(equipments);
    }

    if (api.booking_materials?.length) {
        const materials = api.booking_materials.map(
            (material) => toBookingMaterial(material)
        );
        booking.setBookingMaterial(materials);
    }

    if (api.approvals?.length) {
        const approvals = api.approvals.map(
            (approval) => toBookingApproval(approval)
        )
        booking.setBookingApproval(approvals)
    }

    // Set price information
    booking.setPriceInfo(
        api.room_price ?? 0,
        api.equipment_total_price ?? 0,
        api.material_total_price ?? 0,
        api.total_price ?? 0,
        api.has_paid_items ?? false
    );

    // Set payment information
    booking.setPaymentInfo(api.payment_id, api.payment_status, api.is_payment_proof_has_uploaded);

    // Set canVerif for verification status
    if (api.canVerif !== undefined) {
        booking.setCanVerif(api.canVerif);
    }

    return booking;
}
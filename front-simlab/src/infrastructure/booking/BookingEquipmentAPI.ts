import { BookingEquipment } from "@/domain/booking/BookingEquipment";

export type BookingEquipmentAPI = {
    id: number;
    laboratory_equipment_id: number;
    quantity: number;
    equipment_name: string,
    unit: string;
    price: number;
    subtotal: number;
}

export function toDomain(api: BookingEquipmentAPI): BookingEquipment {
    const bookingEquipment = new BookingEquipment(
        api.id,
        api.laboratory_equipment_id,
        api.quantity,
        api.price ?? 0,
        api.subtotal ?? 0,
    )

    if (api.equipment_name) {
        bookingEquipment.setEquipmentName(api.equipment_name)
    }

    if (api.unit) {
        bookingEquipment.setUnit(api.unit)
    }

    return bookingEquipment
}
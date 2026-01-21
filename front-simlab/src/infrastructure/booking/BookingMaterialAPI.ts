import { BookingMaterial } from "@/domain/booking/BookingMaterial";

export type BookingMaterialAPI = {
    id: number;
    laboratory_material_id: number;
    quantity: number;
    material_name: string;
    unit: string;
    price: number;
    subtotal: number;
}

export function toDomain(api: BookingMaterialAPI): BookingMaterial {
    const bookingMaterial = new BookingMaterial(
        api.id,
        api.laboratory_material_id,
        api.quantity,
        api.price ?? 0,
        api.subtotal ?? 0,
    )

    if (api.material_name) {
        bookingMaterial.setMaterialName(api.material_name)
    }

    if (api.unit) {
        bookingMaterial.setUnit(api.unit)
    }

    return bookingMaterial
}
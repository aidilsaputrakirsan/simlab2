import { BookingEquipment } from "@/domain/booking/BookingEquipment";

export class BookingEquipmentView {
    constructor(
        readonly id: number,
        readonly laboratoryEquipmentId: number,
        readonly quantity: number,
        readonly price: number,
        readonly subtotal: number,
        readonly equipmentName?: string,
        readonly unit?: string
    ) { }

    static fromDomain(entity: BookingEquipment): BookingEquipmentView {
        return new BookingEquipmentView(
            entity.id,
            entity.laboratoryEquipmentId,
            entity.quantity,
            entity.price,
            entity.subtotal,
            entity.getEquipmentName(),
            entity.getUnit()
        )
    }

    formatPrice(): string {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(this.price)
    }

    formatSubtotal(): string {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(this.subtotal)
    }
}
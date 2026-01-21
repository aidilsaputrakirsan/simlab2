import { BookingMaterial } from "@/domain/booking/BookingMaterial";

export class BookingMaterialtView {
    constructor(
        readonly id: number,
        readonly laboratoryMaterialId: number,
        readonly quantity: number,
        readonly price: number,
        readonly subtotal: number,
        readonly materialName?: string,
        readonly unit?: string
    ) { }

    static fromDomain(entity: BookingMaterial): BookingMaterialtView {
        return new BookingMaterialtView(
            entity.id,
            entity.laboratoryMaterialId,
            entity.quantity,
            entity.price,
            entity.subtotal,
            entity.getMaterialName(),
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
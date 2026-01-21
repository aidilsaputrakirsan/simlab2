export class BookingEquipment {
    private equipmentName?: string
    private unit?: string
    constructor(
        readonly id: number,
        readonly laboratoryEquipmentId: number,
        readonly quantity: number,
        readonly price: number,
        readonly subtotal: number,
    ){}

    setUnit(unit: string) {
        this.unit = unit
    }

    getUnit(): string | undefined {
        return this.unit
    }

    setEquipmentName(name: string) {
        this.equipmentName = name
    }

    getEquipmentName(): string | undefined {
        return this.equipmentName
    }
}
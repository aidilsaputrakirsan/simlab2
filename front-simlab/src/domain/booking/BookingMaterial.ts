export class BookingMaterial {
    private materialName?: string
    private unit?: string
    constructor(
        readonly id: number,
        readonly laboratoryMaterialId: number,
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

    setMaterialName(name: string) {
        this.materialName = name
    }

    getMaterialName(): string | undefined {
        return this.materialName
    }
}
export class PracticumSchedulingMaterial {
    constructor(
        readonly id: number,
        readonly materialName: string,
        readonly unit: string,
        readonly quantity: number,
        readonly realization: number,
    ){}
}
export class TestingType {

    private testingCategory?: {
        id: number,
        name: string
    };

    constructor(
        readonly id: number,
        readonly name: string,
        readonly unit: string,
        readonly studentPrice: number,
        readonly lecturerPrice: number,
        readonly externalPrice: number,
    ){}

    setTestingCategory(testingCategoryData: {id: number, name: string}) {
        this.testingCategory = testingCategoryData
    }

    getTestingCategory() {
        return this.testingCategory
    }
}
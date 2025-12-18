import { PaymentStatus } from "../payment/PaymentStatus";
import { Laboran } from "../shared/value-object/Laboran";
import { Requestor } from "../shared/value-object/Requestor";
import { Time } from "../time/Time";
import { TestingRequestItem } from "./TestingRequestItem";
import { TestingRequestStatus } from "./TestingRequestStatus";

export class TestingRequest {
    private laboran?: Laboran;
    private requestor?: Requestor
    private canVerif?: number
    private testingRequestItems: TestingRequestItem[] = []

    constructor(
        readonly id: number,
        readonly academicYear: string,
        readonly phoneNumber:string,
        readonly activityName: string,
        readonly supervisor: string | null,
        readonly supervisorEmail: string | null,
        readonly testingTime: Time,
        readonly status: TestingRequestStatus,
        readonly information: string | null,
        readonly resultFile: string | null,
        readonly createdAt: Time | null,
        readonly updatedAt: Time | null,
        readonly hasPaidItems: boolean,
        readonly paymentStatus: PaymentStatus
    ){}

    setLaboran(laboran: Laboran) {
        this.laboran = laboran
    }

    setRequestor(requestor: Requestor) {
        this.requestor = requestor
    }

    setCanVerif(value: number) {
        this.canVerif = value
    }

    setTestingRequestItems(items: TestingRequestItem[]) {
        this.testingRequestItems = items
    }

    getLaboran(): Laboran | undefined {
        return this.laboran
    }

    getRequestor(): Requestor | undefined {
        return this.requestor
    }

    getCanVerif(): number | undefined {
        return this.canVerif
    }

    getTestingRequestItems(): TestingRequestItem[] {
        return this.testingRequestItems
    }
}
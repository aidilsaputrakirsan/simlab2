import { Laboran } from "../shared/value-object/Laboran";
import { Requestor } from "../shared/value-object/Requestor";
import { Time } from "../time/Time";
import { TestingRequestStatus } from "./TestingRequestStatus";

export class TestRequest {
    private laboran?: Laboran;
    private requestor?: Requestor

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
        readonly updatedAt: Time | null
    ){}

    setLaboran(laboran: Laboran) {
        this.laboran = laboran
    }

    setRequestor(requestor: Requestor) {
        this.requestor = requestor
    }

    getLaboran(): Laboran | undefined {
        return this.laboran
    }

    getRequestor(): Requestor | undefined {
        return this.requestor
    }
}
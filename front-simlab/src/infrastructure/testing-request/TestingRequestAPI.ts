import { Laboran } from "@/domain/shared/value-object/Laboran"
import { Requestor } from "@/domain/shared/value-object/Requestor"
import { TestingRequest } from "@/domain/testing-request/TestingRequest"
import { TestingRequestStatus } from "@/domain/testing-request/TestingRequestStatus"
import { Time } from "@/domain/time/Time"
import { TestingRequestItemAPI, toDomain as toTestingRequestItem } from "./TestingRequestItemAPI"
import { PaymentStatus } from "@/domain/payment/PaymentStatus"

export type TestingRequestApi = {
    id: number,
    academic_year: string,
    requestor: {
        name: string,
        email: string
    },
    laboran: {
        name: string,
        email: string
    },
    phone_number: string,
    activity_name: string,
    supervisor: string | null,
    supervisor_email: string | null,
    testing_time: string,
    status: string,
    information: string | null,
    result_file: string | null,
    created_at: string | null,
    updated_at: string | null,
    has_paid_items: boolean
    canVerif: number,
    payment_status: string
    testing_request_items: TestingRequestItemAPI[]
}

export function toDomain(api: TestingRequestApi): TestingRequest {
    const testRequest = new TestingRequest(
        api.id,
        api.academic_year,
        api.phone_number,
        api.activity_name,
        api.supervisor,
        api.supervisor_email,
        new Time(api.testing_time),
        api.status as TestingRequestStatus,
        api.information,
        api.result_file,
        api.created_at ? new Time(api.created_at) : null,
        api.updated_at ? new Time(api.updated_at) : null,
        api.has_paid_items,
        api.payment_status as PaymentStatus
    )

    if (api.requestor) {
        const requestor = new Requestor(api.requestor.name, api.requestor.email)
        testRequest.setRequestor(requestor)
    }

    if (api.laboran) {
        const laboran = new Laboran(api.laboran.name, api.laboran.email)
        testRequest.setLaboran(laboran)
    }

    if (api.canVerif !== undefined) {
        testRequest.setCanVerif(api.canVerif)
    }
    
    if (api.testing_request_items) {
        const items = api.testing_request_items.map(
            (item) => toTestingRequestItem(item)
        )
        testRequest.setTestingRequestItems(items)
    }

    return testRequest
}
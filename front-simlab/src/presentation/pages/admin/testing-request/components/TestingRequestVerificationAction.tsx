import { TestingRequestView } from '@/application/testing-request/TestingRequestView'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'
import React from 'react'

interface TestingRequestVerificationActionProps {
    testingRequest: TestingRequestView
    openApproval: (id: number) => void
    openRejection: (id: number) => void,
}

const TestingRequestVerificationAction: React.FC<TestingRequestVerificationActionProps> = ({
    testingRequest,
    openApproval,
    openRejection
}) => {
    const status = testingRequest.canVerif

    if (status === 0) return <Badge variant="success">Disetujui</Badge>
    if (status === 1)
        return (
            <div className="flex gap-2">
                <Button size="sm" onClick={() => openApproval(testingRequest.id)}>
                    Terima
                </Button>
                <Button size="sm" variant="destructive" onClick={() => openRejection(testingRequest.id)}>
                    Tolak
                </Button>
            </div>
        )

    if (status === 2) {
        // If has paid items, show that it's verified via payment page
        if (testingRequest.hasPaidItems) {
            return <Badge variant="secondary">Diverifikasi via Pembayaran</Badge>
        }
        return <Badge variant="default">Menunggu</Badge>
    }
    if (status === 3) return <Badge variant="destructive">Ditolak</Badge>

    return null
}

export default TestingRequestVerificationAction
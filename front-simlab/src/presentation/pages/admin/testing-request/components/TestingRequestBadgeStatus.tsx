import { TestingRequestStatus } from '@/domain/testing-request/TestingRequestStatus'
import { Badge } from '@/presentation/components/ui/badge'
import React from 'react'

interface TestingRequestBadgeStatusProps {
    status: TestingRequestStatus
}

const TestingRequestBadgeStatus: React.FC<TestingRequestBadgeStatusProps> = ({ status }) => {
    switch (status) {
        case TestingRequestStatus.Draft:
            return (
                <Badge variant={'secondary'}>Draft</Badge>
            )
        case TestingRequestStatus.Pending:
            return (
                <Badge variant={'default'}>Pending</Badge>
            )

        case TestingRequestStatus.Approved:
            return (
                <Badge variant={'success'}>Disetujui</Badge>
            )

        case TestingRequestStatus.Revision:
            return (
                <Badge variant={'warning'}>Revisi</Badge>
            )

        case TestingRequestStatus.Rejected:
            return (
                <Badge variant={'destructive'}>Ditolak</Badge>
            )
    }
}

export default TestingRequestBadgeStatus
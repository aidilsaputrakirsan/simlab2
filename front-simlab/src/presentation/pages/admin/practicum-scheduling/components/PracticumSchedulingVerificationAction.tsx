import { PracticumSchedulingView } from '@/application/practicum-scheduling/PracticumSchedulingView'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'
import React from 'react'

interface PracticumSchedulingVerificationActionProps {
    practicumScheduling: PracticumSchedulingView,
    openApproval: (id: number) => void
    openRejection: (id: number) => void,
}

const PracticumSchedulingVerificationAction: React.FC<PracticumSchedulingVerificationActionProps> = ({
    practicumScheduling,
    openApproval,
    openRejection
}) => {
    const status = practicumScheduling.canVerif

    if (status === 0) return <Badge variant="success">Disetujui</Badge>
    if (status === 1)
        return (
            <div className="flex gap-2">
                <Button size="sm" onClick={() => openApproval(practicumScheduling.id)}>
                    Terima
                </Button>
                <Button size="sm" variant="destructive" onClick={() => openRejection(practicumScheduling.id)}>
                    Tolak
                </Button>
            </div>
        )

    if (status === 2) return <Badge variant="default">Menunggu</Badge>
    if (status === 3) return <Badge variant="destructive">Ditolak</Badge>

    return null
}

export default PracticumSchedulingVerificationAction
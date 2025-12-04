import { useAuth } from '@/application/hooks/useAuth'
import { userRole } from '@/domain/User/UserRole'
import React from 'react'
import KepalaLabTerpaduTestingRequestApproval from './components/KepalaLabTerpaduTestingRequestApproval'
import LaboranTestingRequestVerification from './components/LaboranTestingRequestVerification'

const TestingRequestVerification = () => {
    const { user } = useAuth()
    return (
        <>
            {user?.role === userRole.KepalaLabTerpadu ? (
                <KepalaLabTerpaduTestingRequestApproval/>
            ) : (
                <LaboranTestingRequestVerification/>
            )}
        </>
    )
}

export default TestingRequestVerification
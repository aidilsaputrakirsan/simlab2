import { useAuth } from '@/application/hooks/useAuth'
import { userRole } from '@/domain/User/UserRole'
import React from 'react'
import KepalaLabTerpaduTestingRequestApproval from './components/KepalaLabTerpaduTestingRequestApproval'
import LaboranTestingRequestVerification from './components/LaboranTestingRequestVerification'
import AdminKeuanganTestingRequest from './components/AdminKeuanganTestingRequest'

const TestingRequestVerification = () => {
    const { user } = useAuth()
    return (
        <>
            {user?.role === userRole.KepalaLabTerpadu && (
                <KepalaLabTerpaduTestingRequestApproval/>
            )}

            {user?.role === userRole.Laboran && (
                <LaboranTestingRequestVerification/>
            )}

            {user?.role === userRole.AdminKeuangan && (
                <AdminKeuanganTestingRequest/>
            )}
        </>
    )
}

export default TestingRequestVerification
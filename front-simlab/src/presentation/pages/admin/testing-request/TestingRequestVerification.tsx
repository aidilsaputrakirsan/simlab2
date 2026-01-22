import { useAuth } from '@/application/hooks/useAuth'
import { userRole } from '@/domain/User/UserRole'
import KepalaLabTerpaduTestingRequestApproval from './components/KepalaLabTerpaduTestingRequestApproval'
import LaboranTestingRequestVerification from './components/LaboranTestingRequestVerification'
import AdminPengujianTestingRequest from './components/AdminPengujianTestingRequest'

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

            {user?.role === userRole.AdminPengujian && (
                <AdminPengujianTestingRequest/>
            )}
        </>
    )
}

export default TestingRequestVerification
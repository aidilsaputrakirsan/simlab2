import { useAuth } from '@/application/hooks/useAuth'
import { userRole } from '@/domain/User/UserRole'
import KepalaLabTerpaduTestingRequestApproval from './components/KepalaLabTerpaduTestingRequestApproval'
import LaboranTestingRequestVerification from './components/LaboranTestingRequestVerification'

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
        </>
    )
}

export default TestingRequestVerification
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

const BaseLayout = () => {
    return (
        <>
            <Outlet />
            <Toaster position="top-right" richColors expand={true} closeButton />
        </>
    )
}

export default BaseLayout
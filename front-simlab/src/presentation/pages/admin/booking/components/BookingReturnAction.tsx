import { BookingView } from '@/application/booking/BookingView'
import { BookingStatus } from '@/domain/booking/BookingStatus'
import { Button } from '@/presentation/components/ui/button';
import React from 'react'
import { NavLink } from 'react-router-dom';

interface BookingReturnActionProps {
    booking: BookingView,
    openReturnConfirmation?: (id: number) => void 
}

const BookingReturnAction: React.FC<BookingReturnActionProps> = ({
    booking,
    openReturnConfirmation
}) => {
    if (booking.status === BookingStatus.Draft) {
        return (
            <NavLink to={`/panel/peminjaman/${booking.id}/manage`}>
                <Button size="sm">Lanjutkan</Button>
            </NavLink>
        );
    }
    return (
        <div className='flex gap-2'>
            {booking.isRequestorCanReturn && (
                <Button variant={'success'} onClick={() => openReturnConfirmation?.(booking.id)}>Kembalikan Alat</Button>
            )}
            <NavLink to={`/panel/peminjaman/${booking.id}/detail`}>
                <Button variant="secondary" size="sm">Detail</Button>
            </NavLink>
        </div>
    )
}

export default BookingReturnAction
import { BookingView } from '@/application/booking/BookingView'
import { BookingStatus } from '@/domain/booking/BookingStatus'
import { Button } from '@/presentation/components/ui/button';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import { FileDown } from 'lucide-react';
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { toast } from 'sonner';

interface BookingReturnActionProps {
    booking: BookingView,
    openReturnConfirmation?: (id: number) => void
}

const BookingReturnAction: React.FC<BookingReturnActionProps> = ({
    booking,
    openReturnConfirmation
}) => {
    const { bookingService } = useDepedencies()
    const [isDownloading, setIsDownloading] = useState<boolean>(false)

    const handleDownloadDocument = async () => {
        setIsDownloading(true)
        try {
            await bookingService.downloadDocument(booking.id)
        } catch {
            toast.error('Gagal mengunduh dokumen peminjaman')
        } finally {
            setIsDownloading(false)
        }
    }
    if (booking.status === BookingStatus.Draft) {
        return (
            <NavLink to={`/panel/peminjaman/${booking.id}/manage`}>
                <Button size="sm">Lanjutkan</Button>
            </NavLink>
        );
    }

    return (
        <div className='flex gap-2 flex-wrap'>
            {booking.isRequestorCanReturn && (
                <Button variant={'success'} onClick={() => openReturnConfirmation?.(booking.id)}>Kembalikan Alat</Button>
            )}
            <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadDocument}
                disabled={isDownloading}
                title="Download Dokumen Peminjaman"
            >
                <FileDown />
                {isDownloading ? 'Mengunduh...' : 'Dokumen'}
            </Button>
            <NavLink to={`/panel/peminjaman/${booking.id}/detail`}>
                <Button variant="secondary" size="sm">Detail</Button>
            </NavLink>
        </div>
    )
}

export default BookingReturnAction
import { BookingView } from '@/application/booking/BookingView'
import { BookingApprovalStatus } from '@/domain/booking/BookingApprovalStatus'
import { BookingApprovalAction } from '@/domain/booking/BookingApprovalAction'
import { userRole } from '@/domain/User/UserRole'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'
import React from 'react'

interface BookingVerificationActionProps {
  booking: BookingView
  role: userRole
  openApproval: (id: number) => void
  openRejection: (id: number) => void,
  openReturnVerification?: (id: number) => void,
  openReturnConfirmation?: (id: number) => void
}

const BookingVerificationAction: React.FC<BookingVerificationActionProps> = ({
  booking,
  role,
  openApproval,
  openRejection,
  openReturnVerification,
  openReturnConfirmation
}) => {
  const approvals = booking.bookingApproval
  const canVerif = booking.canVerif

  // Use canVerif for head verification (KepalaLabTerpadu and AdminPengujian)
  // canVerif values: 0 = approved, 1 = can verify, 2 = waiting, 3 = rejected
  if (role === userRole.KepalaLabTerpadu || role === userRole.AdminPengujian) {
    if (canVerif === 0) return <Badge variant="success">Disetujui</Badge>
    if (canVerif === 1) {
      return (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => openApproval(booking.id)}>
            Terima
          </Button>
          <Button size="sm" variant="destructive" onClick={() => openRejection(booking.id)}>
            Tolak
          </Button>
        </div>
      )
    }
    if (canVerif === 2) {
      // For KepalaLabTerpadu viewing paid bookings - show that it's handled via payment
      if (role === userRole.KepalaLabTerpadu && booking.hasPaidItems) {
        return <Badge variant="secondary">Diverifikasi via Pembayaran</Badge>
      }
      return <Badge variant="default">Menunggu</Badge>
    }
    if (canVerif === 3) return <Badge variant="destructive">Ditolak</Badge>
  }

  // For Laboran, use the original approval-based logic
  const rejectedIndex = approvals.findIndex(a => a.status === BookingApprovalStatus.Rejected)
  const pendingIndex = approvals.findIndex(a => a.status === BookingApprovalStatus.Pending)

  // There are those who are REJECTED
  if (rejectedIndex !== -1) {
    const affectedRoles = approvals.slice(rejectedIndex)
    if (affectedRoles.some(a => a.role === role)) {
      return <Badge variant="destructive">Ditolak</Badge>
    }
    return <Badge variant="success">Disetujui</Badge>
  }

  // There is something PENDING
  if (pendingIndex !== -1) {
    const currentPending = approvals[pendingIndex]

    switch (currentPending.action) {
      case BookingApprovalAction.VerifiedByLaboran:
        if (role === userRole.Laboran) {
          return (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => openApproval(booking.id)}>
                Terima
              </Button>
              <Button size="sm" variant="destructive" onClick={() => openRejection(booking.id)}>
                Tolak
              </Button>
            </div>
          )
        }
        break;

      case BookingApprovalAction.ReturnedByRequestor:
        if (role === userRole.Laboran) {
          return (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => openReturnVerification?.(booking.id)}>
                Verifikasi Pengembalian
              </Button>
            </div>
          )
        }
        break;

      case BookingApprovalAction.ReturnConfirmedByLaboran:
        if (role === userRole.Laboran) {
          return (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => openReturnConfirmation?.(booking.id)}>
                Konfirmasi Pengembalian
              </Button>
            </div>
          )
        }
        break;
    }

    // If it has passed (previously approved)
    const beforePending = approvals.slice(0, pendingIndex)
    if (beforePending.some(a => a.role === role)) {
      return <Badge variant="success">Disetujui</Badge>
    }
  }

  // All Approved
  return <Badge variant="success">Disetujui</Badge>
}

export default BookingVerificationAction

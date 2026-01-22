import { useState, useCallback, useReducer } from "react"
import { toast } from "sonner"
import { BookingType } from "@/domain/booking/BookingType"
import { BookingView } from "@/application/booking/BookingView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"

// Dialog names
type DialogKey =
    | "KepalaLabApproval"
    | "LaboranApproval"
    | "rejection"
    | "returnVerification"
    | "returnConfirmation"

type DialogState = Record<DialogKey, boolean>

const initialDialogState: DialogState = {
    KepalaLabApproval: false,
    LaboranApproval: false,
    rejection: false,
    returnVerification: false,
    returnConfirmation: false,
}

function dialogReducer(
    state: DialogState,
    action: { type: "open" | "close"; key: DialogKey }
) {
    return { ...state, [action.key]: action.type === "open" }
}

export const useBookingVerification = (
    bookings: BookingView[],
    refresh?: () => void
) => {
    const { bookingService } = useDepedencies()

    // Selected booking
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null)
    const [approvalType, setApprovalType] =
        useState<"equipment_approve" | "approve" | null>(null)

    // All dialogs controlled by reducer (clean)
    const [dialogs, dispatch] = useReducer(dialogReducer, initialDialogState)

    // --- Helpers --------------------------------------------------------

    const findBookingAndSetApprovalType = useCallback(
        (id: number) => {
            setSelectedBookingId(id)
            const booking = bookings.find((b) => b.id === id)

            setApprovalType(
                booking?.bookingType === BookingType.Equipment
                    ? "equipment_approve"
                    : "approve"
            )
        },
        [bookings]
    )

    const openDialog = (key: DialogKey, id: number) => {
        findBookingAndSetApprovalType(id)
        dispatch({ type: "open", key })
    }

    const closeDialog = (key: DialogKey) => {
        dispatch({ type: "close", key })
    }

    // Dialog Open Handler
    const openKepalaLabApproval = (id: number) => openDialog("KepalaLabApproval", id)
    const openLaboranApproval = (id: number) => openDialog("LaboranApproval", id)
    const openRejection = (id: number) => openDialog("rejection", id)
    const openReturnVerification = (id: number) =>
        openDialog("returnVerification", id)
    const openReturnConfirmation = (id: number) =>
        openDialog("returnConfirmation", id)

    // --- Actions --------------------------------------------------------

    const handleKepalaLabApproval = async (laboran_id: number, information: string) => {
        if (!selectedBookingId) return

        const res = await bookingService.verifyBooking(selectedBookingId, {
            action: "approve",
            information,
            laboran_id
        })
        toast.success(res.message)
        closeDialog('KepalaLabApproval')
        refresh?.()
    }

    const handleLaboranApproval = async (information: string) => {
        if (!selectedBookingId) return

        const res = await bookingService.verifyBooking(selectedBookingId, {
            action: "approve",
            information,
        })
        toast.success(res.message)
        closeDialog('LaboranApproval')
        refresh?.()
    }

    const handleEquipmentApproval = async (
        information: string,
        laboratory_room_id: number | null,
        is_allowed_offsite: boolean
    ) => {
        if (!selectedBookingId) return

        const res = await bookingService.verifyBooking(selectedBookingId, {
            action: "approve",
            information,
            laboratory_room_id,
            is_allowed_offsite,
        })
        toast.success(res.message)
        closeDialog('LaboranApproval')
        refresh?.()
    }

    const handleRejection = async (information: string) => {
        if (!selectedBookingId) return

        const res = await bookingService.verifyBooking(selectedBookingId, {
            action: "reject",
            information,
        })
        toast.success(res.message)
        closeDialog('rejection')
        refresh?.()
    }

    const handleReturnVerification = async (information: string) => {
        if (!selectedBookingId) return

        const res = await bookingService.verifyBookingReturn(selectedBookingId, information)
        toast.success(res.message)
        closeDialog('returnVerification')
        refresh?.()
    }

    const handleReturnConfirmation = async (information: string) => {
        if (!selectedBookingId) return

        const res = await bookingService.confirmBookingReturn(selectedBookingId, information)
        toast.success(res.message)
        closeDialog('returnVerification')
        refresh?.()
    }

    return {
        // --- state ---
        selectedBookingId,
        approvalType,
        dialogs,

        // --- openers ---
        openKepalaLabApproval,
        openLaboranApproval,
        openRejection,
        openReturnVerification,
        openReturnConfirmation,

        // --- closers ---
        closeKepalaLabApproval: () => closeDialog("KepalaLabApproval"),
        closeLaboranApproval: () => closeDialog("KepalaLabApproval"),
        closeRejection: () => closeDialog("rejection"),
        closeReturnVerification: () => closeDialog("returnVerification"),
        closeReturnConfirmation: () => closeDialog("returnConfirmation"),

        // --- actions ---
        handleKepalaLabApproval,
        handleLaboranApproval,
        handleEquipmentApproval,
        handleRejection,
        handleReturnVerification,
        handleReturnConfirmation
    }
}

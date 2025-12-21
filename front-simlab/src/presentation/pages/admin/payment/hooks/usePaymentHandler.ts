import { PaymentInputDTO, PaymentInputProofDTO } from "@/application/payment/dto/PaymentDTO";
import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import { useReducer, useState } from "react";
import { toast } from "sonner";

// Dialog names
type DialogKey =
    | "createPayment"
    | "paymentProof"
    | "approval"
    | "rejection"

type DialogState = Record<DialogKey, boolean>

const initialDialogState: DialogState = {
    createPayment: false,
    paymentProof:false,
    approval: false,
    rejection: false,
}

function dialogReducer(
    state: DialogState,
    action: { type: "open" | "close"; key: DialogKey }
) {
    return { ...state, [action.key]: action.type === "open" }
}

export const usePaymentHandler = (
    refresh?: () => void
) => {
    const { paymentService } = useDepedencies()

    const [selectedPayment, setSelectedPayment] = useState<number | null>(null)

    const [dialogs, dispatch] = useReducer(dialogReducer, initialDialogState)


    const openDialog = (key: DialogKey, id: number) => {
        setSelectedPayment(id)
        dispatch({ type: "open", key })
    }

    const closeDialog = (key: DialogKey) => {
        dispatch({ type: "close", key })
    }

    const openCreatePayment = (id: number) => openDialog("createPayment", id)
    const openPaymentProof = (id: number) => openDialog("paymentProof", id)
    const openApproval = (id: number) => openDialog("approval", id)
    const openRejection = (id: number) => openDialog("rejection", id)

    const handleCreatePayment = async (data: PaymentInputDTO) => {
        if (!selectedPayment) return

        const res = await paymentService.createPayment(selectedPayment, data)
        toast.success(res.message)
        closeDialog('createPayment')
        refresh?.()
    }

    const handleStorePaymentProof = async (data: PaymentInputProofDTO) => {
        if (!selectedPayment) return

        const res = await paymentService.storePaymentProof(selectedPayment, data)
        toast.success(res.message)
        closeDialog('paymentProof')
        refresh?.()
    }

    const handleApproval = async () => {
        if (!selectedPayment) return

        const res = await paymentService.verif(selectedPayment, {
            action: 'approved'
        })
        toast.success(res.message)
        closeDialog('approval')
        refresh?.()
    }

    const handleRejection = async () => {
        if (!selectedPayment) return

        const res = await paymentService.verif(selectedPayment, {
            action: "rejected",
        })
        toast.success(res.message)
        closeDialog('rejection')
        refresh?.()
    }

    return {
        // --- state ---
        selectedPayment,
        dialogs,

        // --- openers ---
        openCreatePayment,
        openPaymentProof,
        openApproval,
        openRejection,

        // --- closers ---
        closeCreatePayment: () => closeDialog("createPayment"),
        closePaymentProof: () => closeDialog("paymentProof"),
        closeApproval: () => closeDialog("approval"),
        closeRejection: () => closeDialog("rejection"),

        // --- actions ---
        handleCreatePayment,
        handleStorePaymentProof,
        handleApproval,
        handleRejection,
    }
}
import { TestingRequestView } from "@/application/testing-request/TestingRequestView";
import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import { useReducer, useState } from "react";
import { toast } from "sonner";

// Dialog names
type DialogKey =
    | "KepalaLabApproval"
    | "LaboranApproval"
    | "rejection"

type DialogState = Record<DialogKey, boolean>

const initialDialogState: DialogState = {
    KepalaLabApproval: false,
    LaboranApproval: false,
    rejection: false,
}

function dialogReducer(
    state: DialogState,
    action: { type: "open" | "close"; key: DialogKey }
) {
    return { ...state, [action.key]: action.type === "open" }
}

export const useTestingRequestVerification = (
    testingRequests: TestingRequestView[],
    refresh?: () => void
) => {
    const { testingRequestService } = useDepedencies()

    const [selectedTestingRequestId, setSelectedTestingRequestId] = useState<number | null>(null)

    const [dialogs, dispatch] = useReducer(dialogReducer, initialDialogState)


    const openDialog = (key: DialogKey, id: number) => {
        setSelectedTestingRequestId(id)
        dispatch({ type: "open", key })
    }

    const closeDialog = (key: DialogKey) => {
        dispatch({ type: "close", key })
    }

    const openKepalaLabApproval = (id: number) => openDialog("KepalaLabApproval", id)
    const openLaboranApproval = (id: number) => openDialog("LaboranApproval", id)
    const openRejection = (id: number) => openDialog("rejection", id)

    const handleKepalaLabApproval = async (laboran_id: number, information: string) => {
        if (!selectedTestingRequestId) return

        const res = await testingRequestService.verifyTestingRequest(selectedTestingRequestId, {
            action: "approve",
            information,
            laboran_id
        })
        toast.success(res.message)
        closeDialog('KepalaLabApproval')
        refresh?.()
    }

    const handleLaboranApproval = async (information: string) => {
        if (!selectedTestingRequestId) return

        const res = await testingRequestService.verifyTestingRequest(selectedTestingRequestId, {
            action: "approve",
            information,
        })
        toast.success(res.message)
        closeDialog('LaboranApproval')
        refresh?.()
    }

    const handleRejection = async (information: string) => {
        if (!selectedTestingRequestId) return

        const res = await testingRequestService.verifyTestingRequest(selectedTestingRequestId, {
            action: "reject",
            information,
        })
        toast.success(res.message)
        closeDialog('rejection')
        refresh?.()
    }

    return {
        // --- state ---
        selectedTestingRequestId,
        dialogs,

        // --- openers ---
        openKepalaLabApproval,
        openLaboranApproval,
        openRejection,

        // --- closers ---
        closeKepalaLabApproval: () => closeDialog("KepalaLabApproval"),
        closeLaboranApproval: () => closeDialog("LaboranApproval"),
        closeRejection: () => closeDialog("rejection"),

        // --- actions ---
        handleKepalaLabApproval,
        handleLaboranApproval,
        handleRejection,
    }
}
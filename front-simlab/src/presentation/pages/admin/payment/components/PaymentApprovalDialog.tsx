import { Button } from "@/presentation/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog";
import { useEffect, useState } from "react";
import { PaymentView } from "@/application/payment/PaymentView";
import Item from "@/presentation/components/Item";
import { Eye } from "lucide-react";
import PaymentBadgeStatus from "./PaymentBadgeStatus";
import FormGroup from "@/presentation/components/custom/FormGroup";
import { Input } from "@/presentation/components/ui/input";

interface PaymentApprovalDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (receiptFile?: File | null) => Promise<void>;
    payment: PaymentView | null;
    isRejection?: boolean;
}

export default function PaymentApprovalDialog({
    open,
    onOpenChange,
    onConfirm,
    payment,
    isRejection = false
}: PaymentApprovalDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) {
            setReceiptFile(null);
            setError(null);
        }
    }, [open]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setReceiptFile(file);
        setError(null);
    };

    async function submit() {
        if (!isRejection && !receiptFile) {
            setError("File kwitansi wajib diupload untuk menerima pembayaran");
            return;
        }

        setIsLoading(true);
        try {
            await onConfirm(isRejection ? null : receiptFile);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isRejection ? "Tolak Pembayaran" : "Terima Pembayaran"}
                    </DialogTitle>
                    <DialogDescription>
                        {isRejection
                            ? "Apakah kamu yakin ingin menolak pembayaran ini?"
                            : "Apakah kamu yakin ingin menyetujui pembayaran ini?"}
                    </DialogDescription>
                </DialogHeader>

                {payment && (
                    <div className="flex flex-col gap-4 my-4">
                        <Item title="Payment Number" value={payment.paymentNumber || "-"} />
                        <Item title="VA Number" value={payment.vaNumber || "-"} />
                        <Item title="Total Amount" value={payment.amount?.formatToIDR() || "-"} />
                        
                        {payment.user && (
                            <>
                                <Item title="Nama Pemohon" value={payment.user.name || "-"} />
                                <Item title="Email" value={payment.user.email || "-"} />
                            </>
                        )}

                        <div className="flex flex-col">
                            <span className="font-semibold">File Invoice</span>
                            {payment.invoiceFile ? (
                                <a
                                    href={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/${payment.invoiceFile}`}
                                    className="w-full"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button className="w-full" type="button" variant="outline">
                                        Lihat File <Eye className="ml-2 h-4 w-4" />
                                    </Button>
                                </a>
                            ) : (
                                <Button variant="secondary" disabled>
                                    N/A
                                </Button>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <span className="font-semibold">Bukti Pembayaran</span>
                            {payment.paymentProof ? (
                                <a
                                    href={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/${payment.paymentProof}`}
                                    className="w-full"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button className="w-full" type="button" variant="outline">
                                        Lihat File <Eye className="ml-2 h-4 w-4" />
                                    </Button>
                                </a>
                            ) : (
                                <Button variant="secondary" disabled>
                                    N/A
                                </Button>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <span className="font-semibold">Status</span>
                            <PaymentBadgeStatus status={payment.status} />
                        </div>

                        {!isRejection && (
                            <>
                                <hr className="my-2" />
                                <FormGroup
                                    id="receipt_file"
                                    label="File Kwitansi"
                                    error={error || undefined}
                                    required
                                >
                                    <Input
                                        type="file"
                                        id="receipt_file"
                                        name="receipt_file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Format yang diizinkan: pdf (maks. 2MB)
                                    </p>
                                </FormGroup>
                            </>
                        )}
                    </div>
                )}

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Tutup
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        variant={isRejection ? "destructive" : "default"}
                        disabled={isLoading}
                        onClick={submit}
                    >
                        {isLoading
                            ? "Memproses..."
                            : isRejection
                            ? "Tolak"
                            : "Terima"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

import { Button } from "@/presentation/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/presentation/components/ui/dialog"
import { Input } from "@/presentation/components/ui/input"
import { Label } from "@/presentation/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"

interface ReportUploadDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (file: File) => Promise<void>
}

export default function ReportUploadDialog({
    open,
    onOpenChange,
    onConfirm
}: ReportUploadDialogProps) {
    const [file, setFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            if (selectedFile.type !== 'application/pdf') {
                toast.error("File harus berformat PDF")
                return
            }
            if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
                toast.error("Ukuran file maksimal 10MB")
                return
            }
            setFile(selectedFile)
        }
    }

    const handleSubmit = async () => {
        if (!file) {
            toast.error("Silakan pilih file terlebih dahulu")
            return
        }

        setIsLoading(true)
        try {
            await onConfirm(file)
            setFile(null)
            onOpenChange(false)
        } catch (error) {
            // Error handling handled by parent usually
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Hasil Pengujian</DialogTitle>
                    <DialogDescription>
                        Upload laporan hasil pengujian dalam format PDF. File sebelumnya akan tertimpa.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="report-file">File Laporan (PDF)</Label>
                        <Input
                            id="report-file"
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Batal
                    </Button>
                    <Button onClick={handleSubmit} disabled={!file || isLoading}>
                        {isLoading ? "Mengupload..." : "Upload"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

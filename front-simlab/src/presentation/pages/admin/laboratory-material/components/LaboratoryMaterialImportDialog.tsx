import { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { ScrollArea } from '@/presentation/components/ui/scroll-area'
import { Download, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { LaboratoryMaterialImportSummary } from '@/application/laboratory-material/LaboratoryMaterialDTO'
import { useDepedencies } from '@/presentation/contexts/useDepedencies'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    onImported: () => void
}

const LaboratoryMaterialImportDialog = ({ open, onOpenChange, onImported }: Props) => {
    const { laboratoryMaterialService } = useDepedencies()
    const [file, setFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [summary, setSummary] = useState<LaboratoryMaterialImportSummary | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const resetState = () => {
        setFile(null)
        setSummary(null)
        if (inputRef.current) inputRef.current.value = ''
    }

    const handleOpenChange = (value: boolean) => {
        if (!value) resetState()
        onOpenChange(value)
    }

    const handleDownloadTemplate = async () => {
        try {
            await laboratoryMaterialService.downloadTemplate()
        } catch {
            toast.error('Gagal mengunduh template')
        }
    }

    const handleImport = async () => {
        if (!file) {
            toast.error('Pilih file .xlsx terlebih dahulu')
            return
        }
        setIsLoading(true)
        setSummary(null)
        try {
            const res = await laboratoryMaterialService.importData(file)
            setSummary(res.data ?? null)
            toast.success(res.message)
            onImported()
        } catch (e: any) {
            toast.error(e?.message || 'Gagal mengimport data bahan')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import Bahan Laboratorium</DialogTitle>
                    <DialogDescription>
                        Unggah file Excel (.xlsx) sesuai template. Baris dengan Kode Asset yang sudah ada akan diperbarui (upsert).
                    </DialogDescription>
                </DialogHeader>

                <div className='flex flex-col gap-4'>
                    <Button type='button' variant='outline' onClick={handleDownloadTemplate} className='w-fit'>
                        <Download className='mr-1 h-4 w-4' /> Download Template
                    </Button>

                    <Input
                        ref={inputRef}
                        type='file'
                        accept='.xlsx'
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />

                    {summary && (
                        <ScrollArea className='max-h-64 rounded-md border p-3'>
                            <div className='flex flex-col gap-2 text-sm'>
                                <p className='font-medium text-green-600'>
                                    {summary.imported} bahan berhasil ditambahkan
                                </p>

                                {summary.updated > 0 && (
                                    <p className='font-medium text-amber-600'>
                                        {summary.updated} bahan diperbarui (kode sudah ada)
                                    </p>
                                )}

                                {summary.failed.length > 0 && (
                                    <div>
                                        <p className='font-medium text-red-600'>
                                            {summary.failed.length} baris gagal:
                                        </p>
                                        <ul className='list-disc pl-5 text-muted-foreground'>
                                            {summary.failed.map((f, i) => (
                                                <li key={i}>Baris {f.row}: {f.errors.join(', ')}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                <DialogFooter>
                    <Button type='button' variant='secondary' onClick={() => handleOpenChange(false)}>
                        Tutup
                    </Button>
                    <Button type='button' onClick={handleImport} disabled={isLoading || !file}>
                        <Upload className='mr-1 h-4 w-4' /> {isLoading ? 'Mengimport...' : 'Import'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default LaboratoryMaterialImportDialog

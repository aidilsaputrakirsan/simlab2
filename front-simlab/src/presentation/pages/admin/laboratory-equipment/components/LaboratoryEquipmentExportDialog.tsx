import { LaboratoryRoomSelectView } from '@/application/laboratory-room/LaboratoryRoomSelectView'
import { Button } from '@/presentation/components/ui/button'
import { Checkbox } from '@/presentation/components/ui/checkbox'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/presentation/components/ui/dialog'
import { Label } from '@/presentation/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/presentation/components/ui/radio-group'
import { ScrollArea } from '@/presentation/components/ui/scroll-area'
import { Download } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type ExportScope = 'all' | 'selected'

interface LaboratoryEquipmentExportDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    laboratoryRooms: LaboratoryRoomSelectView[]
    /** Daftar id kosong berarti mengunduh alat dari seluruh laboratorium */
    onExport: (laboratoryRoomIds: number[]) => Promise<void>
}

const LaboratoryEquipmentExportDialog: React.FC<LaboratoryEquipmentExportDialogProps> = ({
    open,
    onOpenChange,
    laboratoryRooms,
    onExport,
}) => {
    const [scope, setScope] = useState<ExportScope>('all')
    const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // Reset pilihan setiap kali modal dibuka kembali
    useEffect(() => {
        if (open) {
            setScope('all')
            setSelectedRoomIds([])
        }
    }, [open])

    const isAllRoomChecked = laboratoryRooms.length > 0 && selectedRoomIds.length === laboratoryRooms.length

    const toggleRoom = (id: number, checked: boolean) => {
        setSelectedRoomIds((prev) => (checked ? [...prev, id] : prev.filter((roomId) => roomId !== id)))
    }

    const toggleAllRoom = (checked: boolean) => {
        setSelectedRoomIds(checked ? laboratoryRooms.map((room) => room.id) : [])
    }

    const isSubmitDisabled = isLoading || (scope === 'selected' && selectedRoomIds.length === 0)

    const submit = async () => {
        setIsLoading(true)
        try {
            await onExport(scope === 'all' ? [] : selectedRoomIds)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Download Data Alat</DialogTitle>
                    <DialogDescription>
                        Pilih data alat yang ingin diunduh ke dalam file Excel (.xlsx).
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <RadioGroup value={scope} onValueChange={(value) => setScope(value as ExportScope)}>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="all" id="export-scope-all" />
                            <Label htmlFor="export-scope-all" className="font-normal">
                                Semua laboratorium
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="selected" id="export-scope-selected" />
                            <Label htmlFor="export-scope-selected" className="font-normal">
                                Pilih laboratorium tertentu
                            </Label>
                        </div>
                    </RadioGroup>

                    {scope === 'selected' && (
                        <div className="flex flex-col gap-2 rounded-md border p-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Ruangan Laboratorium</span>
                                <span className="text-muted-foreground text-xs">
                                    {selectedRoomIds.length} dipilih
                                </span>
                            </div>

                            {laboratoryRooms.length === 0 ? (
                                <p className="text-muted-foreground py-2 text-sm">
                                    Data laboratorium belum tersedia.
                                </p>
                            ) : (
                                <>
                                    <label className="flex items-center gap-2 text-sm">
                                        <Checkbox
                                            checked={isAllRoomChecked}
                                            onCheckedChange={(checked) => toggleAllRoom(checked === true)}
                                        />
                                        <span className="font-medium">Pilih semua</span>
                                    </label>
                                    <ScrollArea className="h-52 pr-3">
                                        <div className="flex flex-col gap-2">
                                            {laboratoryRooms.map((room) => (
                                                <label
                                                    key={room.id}
                                                    className="flex items-start gap-2 text-sm"
                                                >
                                                    <Checkbox
                                                        className="mt-0.5"
                                                        checked={selectedRoomIds.includes(room.id)}
                                                        onCheckedChange={(checked) =>
                                                            toggleRoom(room.id, checked === true)
                                                        }
                                                    />
                                                    <span>{room.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Tutup
                        </Button>
                    </DialogClose>
                    <Button type="button" disabled={isSubmitDisabled} onClick={submit}>
                        {isLoading ? 'Mengunduh...' : 'Download'}
                        {!isLoading && <Download />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default LaboratoryEquipmentExportDialog

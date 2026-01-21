import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/presentation/components/ui/dialog'
import { Button } from '@/presentation/components/ui/button'
import { Receipt } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/presentation/components/ui/table'
import { BookingView } from '@/application/booking/BookingView'

interface BookingPriceDialogProps {
    booking: BookingView
}

const BookingPriceDialog: React.FC<BookingPriceDialogProps> = ({ booking }) => {
    const equipments = booking.bookingEquipments || []
    const materials = booking.bookingMaterials || []
    const hasRoom = !!booking.laboratoryRoomName && (booking.roomPrice ?? 0) > 0
    const hasEquipment = equipments.length > 0 && (booking.equipmentTotalPrice ?? 0) > 0
    const hasMaterial = materials.length > 0 && (booking.materialTotalPrice ?? 0) > 0

    if (!booking.totalPrice || booking.totalPrice === 0) {
        return null
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className='w-full sm:w-fit'>
                    <Receipt className="h-4 w-4 mr-2" />
                    Rincian Harga
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Rincian Harga Peminjaman</DialogTitle>
                    <DialogDescription>
                        Detail harga ruangan, alat, dan bahan yang dipinjam.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex flex-col gap-6 my-4">
                    {/* Room Price */}
                    {hasRoom && (
                        <div>
                            <h4 className="font-semibold mb-2">Harga Ruangan</h4>
                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader className='bg-primary hover:bg-primary/80 group'>
                                        <TableRow>
                                            <TableHead className='text-white group-hover:text-secondary'>Ruangan</TableHead>
                                            <TableHead className='text-white group-hover:text-secondary text-right'>Harga</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{booking.laboratoryRoomName}</TableCell>
                                            <TableCell className="text-right">{booking.formatPrice(booking.roomPrice)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell className="font-semibold">Subtotal Ruangan</TableCell>
                                            <TableCell className="text-right font-semibold">{booking.formatPrice(booking.roomPrice)}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </div>
                    )}

                    {/* Equipment Prices */}
                    {hasEquipment && (
                        <div>
                            <h4 className="font-semibold mb-2">Harga Alat</h4>
                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader className='bg-primary hover:bg-primary/80 group'>
                                        <TableRow>
                                            <TableHead className='text-white group-hover:text-secondary'>No</TableHead>
                                            <TableHead className='text-white group-hover:text-secondary'>Nama Alat</TableHead>
                                            <TableHead className='text-white group-hover:text-secondary'>Jumlah</TableHead>
                                            <TableHead className='text-white group-hover:text-secondary'>Harga Satuan</TableHead>
                                            <TableHead className='text-white group-hover:text-secondary text-right'>Subtotal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {equipments.filter(eq => eq.price > 0).map((eq, idx) => (
                                            <TableRow key={eq.id}>
                                                <TableCell>{idx + 1}</TableCell>
                                                <TableCell>{eq.equipmentName}</TableCell>
                                                <TableCell>{eq.quantity} {eq.unit}</TableCell>
                                                <TableCell>{eq.formatPrice()}</TableCell>
                                                <TableCell className="text-right">{eq.formatSubtotal()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-right font-semibold">Subtotal Alat</TableCell>
                                            <TableCell className="text-right font-semibold">{booking.formatPrice(booking.equipmentTotalPrice)}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </div>
                    )}

                    {/* Material Prices */}
                    {hasMaterial && (
                        <div>
                            <h4 className="font-semibold mb-2">Harga Bahan</h4>
                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader className='bg-primary hover:bg-primary/80 group'>
                                        <TableRow>
                                            <TableHead className='text-white group-hover:text-secondary'>No</TableHead>
                                            <TableHead className='text-white group-hover:text-secondary'>Nama Bahan</TableHead>
                                            <TableHead className='text-white group-hover:text-secondary'>Jumlah</TableHead>
                                            <TableHead className='text-white group-hover:text-secondary'>Harga Satuan</TableHead>
                                            <TableHead className='text-white group-hover:text-secondary text-right'>Subtotal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {materials.filter(mt => mt.price > 0).map((mt, idx) => (
                                            <TableRow key={mt.id}>
                                                <TableCell>{idx + 1}</TableCell>
                                                <TableCell>{mt.materialName}</TableCell>
                                                <TableCell>{mt.quantity} {mt.unit}</TableCell>
                                                <TableCell>{mt.formatPrice()}</TableCell>
                                                <TableCell className="text-right">{mt.formatSubtotal()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-right font-semibold">Subtotal Bahan</TableCell>
                                            <TableCell className="text-right font-semibold">{booking.formatPrice(booking.materialTotalPrice)}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </div>
                    )}

                    {/* Total */}
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-bold">Total Harga</span>
                            <span className="font-bold text-primary">{booking.formatPrice(booking.totalPrice)}</span>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Tutup</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BookingPriceDialog

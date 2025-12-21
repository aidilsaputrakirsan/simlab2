import { Button } from "@/presentation/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog"
import { BookingView } from '@/application/booking/BookingView'
import React from 'react'
import Item from "@/presentation/components/Item"
import { Eye } from "lucide-react"

interface BookingDetailDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    booking: BookingView | undefined
}

const BookingDetailDialog: React.FC<BookingDetailDialogProps> = ({ booking, open, onOpenChange }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl grid-rows-[auto_minmax(0,1fr)_auto] max-h-[90dvh] p-0">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>Informasi Peminjaman</DialogTitle>
                    <DialogDescription>

                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col px-6 gap-5 overflow-y-scroll scrollbar-hidden">
                    {booking && (
                        <>
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-5">
                                    {booking.requestor && (
                                        <>
                                            <Item title='Nama Pemohon' value={booking.requestor.name} />
                                            <Item title='Email Pemohon' value={booking.requestor.email} />
                                            {booking.requestor.studyProgram && (
                                                <Item title='Program Studi' value={booking.requestor.studyProgram} />
                                            )}
                                            {booking.requestor.institution && (
                                                <Item title='Asal Institusi' value={booking.requestor.institution} />
                                            )}
                                        </>
                                    )}
                                    <Item title='Nomor Hp (Whatsapp)' value={booking.phoneNumber} />
                                    <Item title='Keperluan' value={booking.purpose} />
                                    <Item title='Judul Kegiatan' value={booking.activityName} />
                                    <Item title='Dosen Pembimbing' value={booking.supervisor} />
                                    <Item title='Email Dosen Pembimbing' value={booking.supervisorEmail} />
                                    <div className="flex flex-col md:col-span-2 gap-1">
                                        <label className="font-semibold">Surat Pengantar / Berkas Pendukung</label>
                                        {booking.supportingFile ? (
                                            <a href={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/${booking.supportingFile}`} className='w-full' target='_blank'>
                                                <Button className='w-full'>Open File <Eye/></Button>
                                            </a>
                                        ) : (
                                            <Button variant={'secondary'}>N/A</Button>
                                        )}
                                    </div>
                                    <Item title='Jenis Peminjaman' value={booking.getFormattedBookingType?.() ?? booking.bookingType} />
                                    <div className="flex flex-col gap-1 md:col-span-2">
                                        <label className="font-semibold">Jadwal Peminjaman</label>
                                        <div className="bg-gradient-to-r from-primary/70 to-primary text-white p-3 rounded-xl text-center">
                                            <div className="text-xs opacity-90 mb-2 uppercase tracking-wide">Jadwal Peminjaman</div>
                                            <div className="text-lg font-semibold mb-1">{booking.getEventDateRange()}</div>
                                            <div className="text-base flex items-center justify-center gap-1">
                                               
                                            </div>
                                            <div className="text-lg font-semibold mb-1">{booking.getEventTimeRange()}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <DialogFooter className="p-6">
                    <DialogClose asChild>
                        <Button type="button" variant='secondary'>
                            Close
                        </Button>
                    </DialogClose>
                    {/* <Button type="button" variant={confirmVariant} onClick={submit}>
                        {isLoading ? 'Submitting...' : 'Continue'}
                    </Button> */}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BookingDetailDialog

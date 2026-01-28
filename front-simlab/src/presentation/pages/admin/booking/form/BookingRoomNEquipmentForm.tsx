import React, { useState } from 'react'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import { Button } from '@/presentation/components/ui/button'
import Table from '@/presentation/components/Table'
// import { useLaboratoryEquipment } from '@/application/laboratory-equipment/hooks/useLaboratoryEquipment'
import { LaboratoryEquipmentColumn } from '../column/LaboratoryEquipmentColumn'
import { LaboratoryMaterialColumn } from '../column/LaboratoryMaterialColumn'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useBookingEquipmentMaterialForm } from '../hooks/useBookingEquipmentMaterialForm'
import { useLaboratoryEquipmentDataTable } from '../../laboratory-equipment/hooks/useLaboratoryEquipmentDataTable'
import { useLaboratoryMaterialDataTable } from '../../laboratory-material/hooks/useLaboratoryMaterialDataTable'
import { useDepedencies } from '@/presentation/contexts/useDepedencies'
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog'
import { Alert, AlertDescription, AlertTitle } from '@/presentation/components/ui/alert'
import { Info } from 'lucide-react'

// Helper function to format price to IDR
const formatPriceToIDR = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        minimumFractionDigits: 0 
    }).format(amount);
};

const getPriceLabel = (priceType: 'student' | 'lecturer' | 'external'): string => {
    switch (priceType) {
        case 'student':
            return 'Mahasiswa';
        case 'lecturer':
            return 'Dosen/Internal';
        case 'external':
            return 'Pihak Luar';
        default:
            return '';
    }
};

const BookingRoomNEquipmentForm: React.FC = () => {
    const { id } = useParams()
    const navigate = useNavigate();
    const bookingId = id ? Number(id) : undefined
    const { bookingService } = useDepedencies()

    const {
        formData,
        handleChangeItem,
        handleRemoveItem,
        handleSelectItem,
        getSubmitData,
        getApplicablePrice,
        priceType,
        equipmentTotal,
        materialTotal,
        grandTotal,
    } = useBookingEquipmentMaterialForm()

    const { errors, processErrors } = useValidationErrors()

    const {
        laboratoryEquipments,
        isLoading: isEquipmentLoading,
        ...equipmentTable
    } = useLaboratoryEquipmentDataTable({ filter_laboratory_room: 0 })

    const {
        laboratoryMaterials,
        isLoading: isMaterialLoading,
        ...materialTable
    } = useLaboratoryMaterialDataTable()

    const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false)
    const handleSubmit = async () => {
        if (!bookingId) return
        try {
            const res = await bookingService.storeBookingEquipmentMaterial(bookingId, getSubmitData())
            toast.success(res.message)
            navigate('/panel/peminjaman')
        } catch (e: any) {
            toast.error(e?.message || 'Gagal submit')
            processErrors(e.errors)
            setIsConfirmationOpen(false)
        }
    }

    // Helpers to collect group errors
    const hasEquipmentErrors = Object.keys(errors).some(k => k.startsWith('laboratoryEquipments'))
    const hasMaterialErrors = Object.keys(errors).some(k => k.startsWith('laboratoryMaterials'))

    return (
        <div className='flex flex-col gap-6'>
            {/* Equipment Section */}
            <Card>
                <CardHeader><CardTitle>Ajukan Peminjaman Alat Laboratorium</CardTitle></CardHeader>
                <CardContent>
                    <div className='grid lg:grid-cols-2 xl:grid-cols-3 gap-5'>
                        <div className='xl:col-span-2 overflow-x-auto'>
                            <div className='font-semibold text-sm mb-2'>List Alat Laboratorium</div>
                            <Table
                                data={laboratoryEquipments}
                                columns={LaboratoryEquipmentColumn({ handleSelectItem, selectedIds: formData.laboratoryEquipments.map(e => e.id) })}
                                loading={isEquipmentLoading}
                                searchTerm={equipmentTable.searchTerm}
                                handleSearch={equipmentTable.handleSearch}
                                perPage={equipmentTable.perPage}
                                handlePerPageChange={equipmentTable.handlePerPageChange}
                                totalPages={equipmentTable.totalPages}
                                totalItems={equipmentTable.totalItems}
                                currentPage={equipmentTable.currentPage}
                                handlePageChange={equipmentTable.handlePageChange}
                            />
                        </div>
                        <div>
                            <div className='font-semibold text-sm mb-2'>Daftar Alat yang dibutuhkan <span className='text-red-500'>*</span></div>
                            {errors['laboratoryEquipments'] && (
                                <p className='mb-2 text-xs italic text-red-500'>{errors['laboratoryEquipments']}</p>
                            )}
                            {!errors['laboratoryEquipments'] && hasEquipmentErrors && (
                                <p className='mb-2 text-xs italic text-red-500'>Periksa kembali input alat yang dipilih.</p>
                            )}
                            <div className='flex flex-col gap-3'>
                                {formData.laboratoryEquipments.length === 0 && <p className='text-sm text-muted-foreground'>Belum ada alat yang dipilih. Klik tombol Pilih pada tabel.</p>}
                                {formData.laboratoryEquipments.map((eq, index) => {
                                    const itemPrice = getApplicablePrice(eq)
                                    const subtotal = itemPrice * (eq.quantity ?? 0)
                                    return (
                                        <div key={eq.id} className='flex flex-col gap-1 border rounded-md px-5 py-3 bg-background'>
                                            <div className='flex flex-col md:flex-row items-center gap-5'>
                                                <p className='md:max-w-40 w-full text-sm font-medium'>{eq.name}</p>
                                                <div className='flex gap-2 w-full items-center'>
                                                    <Input type='number' min={0} value={eq.quantity || ''} placeholder='Jumlah' onChange={(e) => handleChangeItem('laboratory_equipment', eq.id, Number(e.target.value))} />
                                                    <span className='text-sm font-medium w-fit text-nowrap'>{eq.unit}</span>
                                                </div>
                                                <Button type='button' variant='destructive' size='sm' className='w-full md:w-fit' onClick={() => handleRemoveItem('laboratory_equipment', eq.id)}>Hapus</Button>
                                            </div>
                                            {/* Price info */}
                                            {itemPrice > 0 && (
                                                <div className='flex justify-between items-center text-xs text-muted-foreground mt-1'>
                                                    <span>Harga: {formatPriceToIDR(itemPrice)}/{eq.unit}</span>
                                                    {(eq.quantity ?? 0) > 0 && (
                                                        <span className='font-semibold text-primary'>Subtotal: {formatPriceToIDR(subtotal)}</span>
                                                    )}
                                                </div>
                                            )}
                                            {hasEquipmentErrors && (
                                                <p className='text-xs italic text-red-500'>{errors[`laboratoryEquipments.${index}.quantity`]}</p>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                            
                            {/* Equipment Subtotal */}
                            {equipmentTotal > 0 && (
                                <div className='mt-3 p-3 bg-muted/30 rounded-md'>
                                    <div className='flex justify-between items-center text-sm'>
                                        <span className='font-medium'>Subtotal Alat</span>
                                        <span className='font-semibold text-primary'>{formatPriceToIDR(equipmentTotal)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Material Section */}
            <Card>
                <CardHeader><CardTitle>Ajukan Peminjaman Bahan Laboratorium</CardTitle></CardHeader>
                <CardContent>
                    <div className='grid lg:grid-cols-2 xl:grid-cols-3 gap-5'>
                        <div className='xl:col-span-2 w-full overflow-x-auto'>
                            <div className='font-semibold text-sm mb-2'>List Bahan Laboratorium</div>
                            <Table
                                data={laboratoryMaterials}
                                columns={LaboratoryMaterialColumn({ handleSelectItem, selectedIds: formData.laboratoryMaterials.map(m => m.id) })}
                                loading={isMaterialLoading}
                                searchTerm={materialTable.searchTerm}
                                handleSearch={materialTable.handleSearch}
                                perPage={materialTable.perPage}
                                handlePerPageChange={materialTable.handlePerPageChange}
                                totalPages={materialTable.totalPages}
                                totalItems={materialTable.totalItems}
                                currentPage={materialTable.currentPage}
                                handlePageChange={materialTable.handlePageChange}
                            />
                        </div>
                        <div>
                            <div className='font-semibold text-sm mb-2'>Daftar Bahan yang dibutuhkan <span className='text-red-500'>*</span></div>
                            {errors['laboratoryMaterials'] && (
                                <p className='mb-2 text-xs italic text-red-500'>{errors['laboratoryMaterials']}</p>
                            )}
                            {!errors['laboratoryMaterials'] && hasMaterialErrors && (
                                <p className='mb-2 text-xs italic text-red-500'>Periksa kembali input bahan yang dipilih.</p>
                            )}
                            <div className='flex flex-col gap-3'>
                                {formData.laboratoryMaterials.length === 0 && <p className='text-sm text-muted-foreground'>Belum ada bahan yang dipilih. Klik tombol Pilih pada tabel.</p>}
                                {formData.laboratoryMaterials.map((mt, index) => {
                                    const itemPrice = getApplicablePrice(mt)
                                    const subtotal = itemPrice * (mt.quantity ?? 0)
                                    return (
                                        <div key={mt.id} className='flex flex-col gap-1 border rounded-md px-5 py-3 bg-background'>
                                            <div className='flex flex-col md:flex-row items-center gap-5'>
                                                <p className='md:max-w-40 w-full text-sm font-medium'>{mt.name}</p>
                                                <div className='flex gap-2 w-full items-center'>
                                                    <Input type='number' min={0} value={mt.quantity || ''} placeholder='Jumlah' onChange={(e) => handleChangeItem('laboratory_material', mt.id, Number(e.target.value))} />
                                                    <span className='text-sm font-medium w-fit text-nowrap'>{mt.unit}</span>
                                                </div>
                                                <Button type='button' variant='destructive' className='w-full md:w-fit' size='sm' onClick={() => handleRemoveItem('laboratory_material', mt.id)}>Hapus</Button>
                                            </div>
                                            {/* Price info */}
                                            {itemPrice > 0 && (
                                                <div className='flex justify-between items-center text-xs text-muted-foreground mt-1'>
                                                    <span>Harga: {formatPriceToIDR(itemPrice)}/{mt.unit}</span>
                                                    {(mt.quantity ?? 0) > 0 && (
                                                        <span className='font-semibold text-primary'>Subtotal: {formatPriceToIDR(subtotal)}</span>
                                                    )}
                                                </div>
                                            )}
                                            {hasMaterialErrors && (
                                                <p className='text-xs italic text-red-500'>{errors[`laboratoryMaterials.${index}.quantity`]}</p>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                            
                            {/* Material Subtotal */}
                            {materialTotal > 0 && (
                                <div className='mt-3 p-3 bg-muted/30 rounded-md'>
                                    <div className='flex justify-between items-center text-sm'>
                                        <span className='font-medium'>Subtotal Bahan</span>
                                        <span className='font-semibold text-primary'>{formatPriceToIDR(materialTotal)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Grand Total Display */}
            {grandTotal > 0 && (
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Estimasi Total Harga ({getPriceLabel(priceType)})</AlertTitle>
                    <AlertDescription className="text-primary font-bold text-lg">
                        {formatPriceToIDR(grandTotal)}
                    </AlertDescription>
                </Alert>
            )}

            <div className='flex justify-end'>
                <Button
                    type='button'
                    onClick={() => setIsConfirmationOpen(true)}
                >Simpan</Button>
                <ConfirmationDialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen} onConfirm={handleSubmit} />
            </div>
        </div>
    )
}

export default BookingRoomNEquipmentForm

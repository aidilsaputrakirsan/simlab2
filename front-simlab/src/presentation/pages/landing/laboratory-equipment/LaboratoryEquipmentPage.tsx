import { useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { LaboratoryEquipmentView } from '@/application/laboratory-equipment/LaboratoryEquipmentView'
import Pagination from '../components/Pagination'
import LaboratoryEquipmentDetailDialog from '../../admin/laboratory-equipment/components/LaboratoryEquipmentDetailDialog'
import { useLaboratoryEquipmentDataTable } from '../../admin/laboratory-equipment/hooks/useLaboratoryEquipmentDataTable'

const LaboratoryEquipmentPage = () => {
    const {
        laboratoryEquipments,
        isLoading,
        // TableHandler
        perPage,
        handlePageChange,
        totalPages,
        currentPage,
    } = useLaboratoryEquipmentDataTable({ filter_laboratory_room: 0, perPage: 8 })

    const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({})
    const [selectedEquipment, setSelectedEquipment] = useState<LaboratoryEquipmentView | undefined>(undefined)
    const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false)

    const handleImageError = (equipmentId: number) => {
        setImageErrors(prev => ({ ...prev, [equipmentId]: true }))
    }

    const handleEquipmentClick = (equipment: LaboratoryEquipmentView) => {
        setSelectedEquipment(equipment)
        setDetailDialogOpen(true)
    }

    return (
        <>
            <div className='min-h-screen' style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <Header className='fixed top-0 left-0 w-full z-50' />
                <div className='flex flex-col gap-5'>
                    <div className='mt-[82px] flex items-center py-10 relative min-h-[400px] px-10 xl:px-32 gap-20 bg-cover bg-[url("https://i0.wp.com/mahasiswaupdate.com/wp-content/uploads/2024/04/akreditasi-jurusan-itk.webp?fit=980%2C551&ssl=1")]'>
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black opacity-30 z-0"></div>

                        <div className="relative z-10 flex flex-col col-span-2 md:col-span-1 md:py-24 gap-10 justify-center mx-auto">
                            <div className='flex flex-col gap-2 text-center'>
                                <h1 className='text-white text-6xl font-bold leading-tight text-shadow-2xs'>Peralatan Laboratorium</h1>
                            </div>
                        </div>
                    </div>

                    <div className='px-10 xl:px-32 flex flex-col gap-10 py-14'>
                        {isLoading ? (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 w-full'>
                                {[...Array(perPage)].map((_, idx) => (
                                    <div key={idx} className="animate-pulse min-h-32 w-full bg-gray-200 rounded-lg text-secondary font-medium shadow-xl flex flex-col items-center gap-3">
                                        <div className='relative w-full rounded-t-lg'>
                                            <div className="absolute inset-0 bg-black opacity-10 z-0 rounded-t-lg"></div>
                                            <div className='object-cover rounded-t-lg w-full aspect-[4/3]'></div>
                                        </div>
                                        <div className='flex flex-col gap-2 p-5 w-full'>
                                            <span className='h-2 w-3/4 bg-gray-400 rounded-lg'></span>
                                            <span className='h-2 w-full bg-gray-400 rounded-lg'></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : laboratoryEquipments.length === 0 ? (
                            <div className='col-span-3 flex flex-col items-center justify-center text-center p-10 border-gray-300 rounded-lg'>
                                <span className='font-semibold text-lg text-black'>Belum ada peralatan</span>
                                <span className='text-sm text-gray-600'>Konten akan muncul ketika peralatan tersedia.</span>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 w-full'>
                                {laboratoryEquipments.map((equipment, idx) => {
                                    const hasValidPhoto = equipment.photo && equipment.photo.trim() !== ''
                                    const imageError = imageErrors[equipment.id]

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => handleEquipmentClick(equipment)}
                                            className="cursor-pointer min-h-32 w-full bg-white rounded-lg text-secondary font-medium shadow-xl flex flex-col items-center hover:scale-105 transition-all"
                                        >
                                            <div className='relative w-full rounded-t-lg'>
                                                <div className="absolute inset-0 bg-black opacity-10 z-0 rounded-t-lg"></div>
                                                {!imageError && hasValidPhoto ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/${equipment.photo}`}
                                                        className='aspect-[4/3] object-cover rounded-t-lg w-full'
                                                        alt={equipment.equipmentName}
                                                        onError={() => handleImageError(equipment.id)}
                                                    />
                                                ) : (
                                                    <img
                                                        src={'/error-image.png'}
                                                        className='aspect-[4/3] object-cover rounded-t-lg w-full'
                                                        alt="Error loading image"
                                                    />
                                                )}
                                            </div>
                                            <div className='flex flex-col gap-2 p-5 w-full'>
                                                <span className='font-semibold text-lg line-clamp-2 text-black'>
                                                    {equipment.equipmentName}
                                                </span>
                                                <span className='text-secondary line-clamp-2 text-sm text-ellipsis overflow-hidden'>
                                                    {equipment.laboratoryRoom?.name || 'No Room'}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {laboratoryEquipments.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                handlePageChange={handlePageChange}
                                totalPages={totalPages}
                                className=''
                            />
                        )}
                    </div>

                    <Footer />
                </div>
            </div>

            {/* Detail Dialog */}
            <LaboratoryEquipmentDetailDialog
                laboratoryEquipment={selectedEquipment}
                open={detailDialogOpen}
                onOpenChange={setDetailDialogOpen}
            />
        </>
    )
}

export default LaboratoryEquipmentPage
import { useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { LaboratoryMaterialView } from '@/application/laboratory-material/LaboratoryMaterialView'
import Pagination from '../components/Pagination'
import LaboratoryMaterialDetailDialog from '../../admin/laboratory-material/components/LaboratoryMaterialDetailDialog'
import { useLaboratoryMaterialDataTable } from '../../admin/laboratory-material/hooks/useLaboratoryMaterialDataTable'

const LaboratoryMaterialPage = () => {
    const {
        laboratoryMaterials,
        isLoading,
        perPage,
        handlePageChange,
        totalPages,
        currentPage,
    } = useLaboratoryMaterialDataTable({ perPage: 12 })

    const [selectedMaterial, setSelectedMaterial] = useState<LaboratoryMaterialView | undefined>(undefined)
    const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false)

    const handleMaterialClick = (material: LaboratoryMaterialView) => {
        setSelectedMaterial(material)
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
                                <h1 className='text-white text-6xl font-bold leading-tight text-shadow-2xs'>Bahan Laboratorium</h1>
                            </div>
                        </div>
                    </div>

                    <div className='px-10 xl:px-32 flex flex-col gap-10 py-14'>
                        {isLoading ? (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 w-full'>
                                {[...Array(perPage)].map((_, idx) => (
                                    <div key={idx} className="animate-pulse min-h-32 w-full bg-gray-200 rounded-lg text-secondary font-medium shadow-xl flex flex-col items-center gap-3 p-5">
                                        <div className='flex flex-col gap-2 w-full'>
                                            <span className='h-4 w-3/4 bg-gray-400 rounded-lg'></span>
                                            <span className='h-3 w-full bg-gray-300 rounded-lg'></span>
                                            <span className='h-3 w-full bg-gray-300 rounded-lg'></span>
                                            <span className='h-3 w-2/3 bg-gray-300 rounded-lg'></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : laboratoryMaterials.length === 0 ? (
                            <div className='col-span-3 flex flex-col items-center justify-center text-center p-10 border-gray-300 rounded-lg'>
                                <span className='font-semibold text-lg text-black'>Belum ada bahan</span>
                                <span className='text-sm text-gray-600'>Konten akan muncul ketika bahan tersedia.</span>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 w-full'>
                                {laboratoryMaterials.map((material, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleMaterialClick(material)}
                                        className="cursor-pointer min-h-32 w-full bg-white rounded-lg text-secondary font-medium shadow-xl flex flex-col p-5 hover:scale-105 transition-all gap-3"
                                    >
                                        <div className='flex flex-col gap-1'>
                                            <span className='font-semibold text-lg line-clamp-2 text-black'>
                                                {material.materialName}
                                            </span>
                                            <span className='text-xs text-gray-500'>
                                                {material.code}
                                            </span>
                                        </div>
                                        <div className='flex flex-col gap-1 text-sm'>
                                            <span className='text-secondary'>
                                                <span className='font-medium'>Merek:</span> {material.brand}
                                            </span>
                                            <span className='text-secondary'>
                                                <span className='font-medium'>Stok:</span> {material.stock} {material.unit}
                                            </span>
                                            <span className='text-secondary line-clamp-2'>
                                                <span className='font-medium'>Deskripsi:</span> {material.description}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {laboratoryMaterials.length > 0 && (
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
            <LaboratoryMaterialDetailDialog
                laboratoryMaterial={selectedMaterial}
                open={detailDialogOpen}
                onOpenChange={setDetailDialogOpen}
            />
        </>
    )
}

export default LaboratoryMaterialPage
import { LaboratoryEquipmentView } from '@/application/laboratory-equipment/LaboratoryEquipmentView'
import { useDepedencies } from '@/presentation/contexts/useDepedencies'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

const LaboratoryEquipment = () => {

    const { laboratoryEquipmentService } = useDepedencies()
    const [laboratoryEquipment, setLaboratoryEquipment] = useState<LaboratoryEquipmentView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({})

    const handleImageError = (equipmentId: number) => {
        setImageErrors(prev => ({ ...prev, [equipmentId]: true }))
    }

    useEffect(() => {
        const fetchLaboratoryEquipment = async () => {
            setIsLoading(true)
            try {
                const response = await laboratoryEquipmentService.getLaboratoryEquipmentData({
                    page: 1,
                    per_page: 6,
                    search: ''
                });
                setLaboratoryEquipment(response.data.slice(0, 6));
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching laboratory equipment:', error);
                setIsLoading(false)
            }
        };

        fetchLaboratoryEquipment();
    }, [laboratoryEquipmentService]);

    return (
        <div className='min-h-[400px] px-10 xl:px-32 flex flex-col gap-20 py-20 bg-secondary'>
            <div className='flex flex-col gap-1 w-fit mx-auto'>
                <span className='text-4xl font-semibold text-white'>Alat Laboratorium</span>
                <div className='w-full h-2 bg-white rounded-lg'></div>
            </div>
            {isLoading ? (
                <div className="flex flex-wrap justify-center rounded-lg gap-10">
                    {[...Array(6)].map((_, idx) => (
                        <div key={idx} className="animate-pulse min-h-32 w-full md:basis-1/3 lg:basis-1/4 bg-gray-200 rounded-lg text-warning text-center font-medium shadow-xl flex flex-col items-center">
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
            ) : laboratoryEquipment.length === 0 ? (
                <div className='col-span-3 flex flex-col items-center justify-center text-center p-10 border-gray-300 rounded-lg'>
                    <span className='font-semibold text-lg text-white'>Belum ada peralatan</span>
                    <span className='text-sm text-gray-300'>Konten akan muncul ketika peralatan tersedia.</span>
                </div>
            ) : (
                <div className="flex flex-wrap justify-center rounded-lg gap-10">
                    {laboratoryEquipment.map((equipment, idx) => {
                        const hasValidPhoto = equipment.photo && equipment.photo.trim() !== ''
                        const imageError = imageErrors[equipment.id]
                        
                        return (
                            <div key={idx} className="min-h-32 w-full md:basis-1/3 lg:basis-1/4 bg-white rounded-lg text-warning text-center font-medium shadow-xl flex flex-col items-center hover:scale-105 transition-all">
                                <div className='relative w-full rounded-t-lg'>
                                    <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
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
                                <div className='flex flex-col gap-2 p-5'>
                                    <span className='font-semibold text-lg line-clamp-2 text-primary'>
                                        {equipment.equipmentName}
                                    </span>
                                    <span className='text-warning line-clamp-3 text-sm text-ellipsis overflow-hidden'>
                                        {equipment.laboratoryRoom?.name || 'No Room'}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
            <NavLink to={'/alat-laboratorium'} className="mx-auto bg-white rounded-lg px-5 py-2 text-secondary font-semibold hover:bg-warning hover:text-secondary transition-colors duration-300 shadow-lg w-fit">
                Selengkapnya
            </NavLink>
        </div>
    )
}

export default LaboratoryEquipment
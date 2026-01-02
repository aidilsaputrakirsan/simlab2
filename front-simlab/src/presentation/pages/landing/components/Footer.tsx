import React from 'react'

const Footer = () => {
    return (
        <div className='min-h-[420px] bg-[#e8ad38] px-10 xl:px-32 flex flex-col md:flex-row justify-between py-20 gap-10 md:gap-0 md:py-0'>
            <img src="https://itk.ac.id/assets/image/Logo_ITK_White.webp" className='w-64 object-contain h-auto' />
            <div className='flex flex-col gap-10 text-white py-0 md:py-20'>
                <span className='font-semibold text-3xl'>Kontak</span>
                <div className=' text-sm flex flex-col gap-2'>
                    <div className='flex gap-2'>
                        <span className='font-semibold'>Email: </span>
                        labterpadu@itk.ac.id
                    </div>
                    <div className='flex gap-2'>
                        <span className='font-semibold'>Alamat: </span>
                        Soekarno-Hatta Km.15, Karang Joang, Balikpapan 76127.
                    </div>
                    <div className='flex gap-2'>
                        <span className='font-semibold'>Telepon: </span>
                        0542-8530800
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-10 text-white py-0 md:py-20">
                <span className='font-semibold text-3xl'>Alamat</span>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.0141114578028!2d116.85934571475377!3d-1.15041039916087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df149298f826ab5%3A0x8489d5309f45c0db!2sKalimantan%20Institute%20of%20Technology!5e0!3m2!1sen!2sid!4v1618368109530!5m2!1sen!2sid" width="100%" height="200px" loading="lazy"></iframe>
            </div>
        </div>
    )
}

export default Footer
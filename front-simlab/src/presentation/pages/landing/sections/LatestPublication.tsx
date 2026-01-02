import { PublicationView } from '@/application/publication/PublicationView';
import { useDepedencies } from '@/presentation/contexts/useDepedencies'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';

const LatestPublication = () => {
    const { publicationService } = useDepedencies()
    const [latestNews, setLatestNews] = useState<PublicationView[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    useEffect(() => {
        const fetchLatestNews = async () => {
            setIsLoading(true)
            try {
                const response = await publicationService.getPublications({
                    page: 1,
                    per_page: 6
                });
                setLatestNews(response.data.slice(0, 6));
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching latest news:', error);
            }
        };

        fetchLatestNews();
    }, [publicationService]);

    return (
        <div className='min-h-[400px] px-10 xl:px-32 flex flex-col gap-10 py-20'>
            <div className='flex flex-col gap-1 w-fit mx-auto'>
                <span className='text-4xl font-semibold'>Berita Terkini</span>
                <div className='w-full h-2 bg-warning rounded-lg'></div>
            </div>
            {isLoading ? (
                <div className='flex flex-wrap justify-center rounded-lg gap-10'>
                    {
                        [...Array(6)].map((_, idx) => (
                            <div key={idx} className="animate-pulse min-h-32 w-full md:basis-1/3 lg:basis-1/4 bg-gray-200 rounded-lg text-secondary font-medium shadow-xl flex flex-col items-center gap-3">
                                <div className='relative w-full rounded-t-lg'>
                                    <div className="absolute inset-0 bg-black opacity-10 z-0 rounded-t-lg"></div>
                                    <div className='object-cover rounded-t-lg w-full aspect-[4/2]'></div>
                                </div>
                                <div className='flex flex-col gap-2 p-5 w-full'>
                                    <span className='h-2 w-1/2 bg-gray-400 rounded-lg'></span>
                                    <span className='h-2 w-full bg-gray-400 rounded-lg'></span>
                                    <span className='h-2 w-full bg-gray-400 rounded-lg'></span>
                                    <span className='h-2 w-full bg-gray-400 rounded-lg'></span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            ) : latestNews.length === 0 ? (
                <div className='col-span-3 flex flex-col items-center justify-center text-center p-10 border-gray-300 rounded-lg'>
                    <span className='font-semibold text-lg text-black'>Belum ada berita</span>
                    <span className='text-sm text-gray-600'>Konten akan muncul ketika publikasi tersedia.</span>
                </div>
            ) : (
                <div className='flex flex-wrap justify-center rounded-lg gap-10'>
                    {
                        latestNews.map((publication, idx) => (
                            <NavLink to={`/berita/${publication.slug}`} key={idx} className="min-h-32 w-full md:basis-1/3 lg:basis-1/4 bg-white rounded-lg text-secondary font-medium shadow-xl flex flex-col items-center gap-3 hover:scale-105 transition-all">
                                <div className='relative w-full rounded-t-lg'>
                                    <div className="absolute inset-0 bg-black opacity-10 z-0 rounded-t-lg"></div>
                                    <img src={publication.imageUrl()} className='aspect-[4/3] object-cover rounded-t-lg w-full' alt="" />
                                </div>
                                <div className='flex flex-col gap-2 p-5'>
                                    <span className='text-xs'>{publication.createdAt.formatForHeaderSubtitle()}</span>
                                    <span className='font-semibold text-lg line-clamp-2 text-black'>
                                        {publication.title}
                                    </span>
                                    <span className='line-clamp-3 text-sm text-ellipsis overflow-hidden'>{publication.shortDescription}</span>
                                </div>
                            </NavLink>
                        ))
                    }
                </div>
            )}
            <NavLink to={'/berita'} className="mx-auto bg-secondary rounded-lg px-5 py-2 text-warning font-semibold hover:bg-warning hover:text-white transition-colors duration-300 shadow-lg w-fit">
                Selengkapnya
            </NavLink>
        </div>
    )
}

export default LatestPublication
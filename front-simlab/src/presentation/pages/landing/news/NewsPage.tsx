import { useEffect, useRef, useState } from 'react'
import Header from '../components/Header';
import { usePublicationDataTable } from '../../admin/publication/hooks/usePublicationDataTable';
import { NavLink } from 'react-router-dom';
import Footer from '../components/Footer';
import Pagination from '../components/Pagination';

const NewsPage = () => {
    const contentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });

        if (!contentRef.current) return;
    }, []);

    const {
        publications,
        isLoading,
        // searchTerm,

        // handleSearch,
        handlePageChange,

        // totalItems,
        totalPages,
        currentPage,
    } = usePublicationDataTable();
    const [latestNews, setLatestNews] = useState<typeof publications>([]);
    const initializedLatestRef = useRef(false);

    useEffect(() => {
        if (!initializedLatestRef.current && publications.length > 0) {
            setLatestNews(publications.slice(0, 3));
            initializedLatestRef.current = true;
        }
    }, [publications]);


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
                                <h1 className='text-white text-6xl font-bold leading-tight text-shadow-2xs'>Berita</h1>
                            </div>
                        </div>

                    </div>
                    <div className='px-10 xl:px-32 grid grid-cols-1 lg:grid-cols-8 gap-20 py-14'>
                        <div className='flex flex-col gap-5 w-full lg:col-span-6'>

                            {isLoading ? (
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto  gap-10 w-full'>
                                    {
                                        [...Array(6)].map((_, idx) => (
                                            <div key={idx} className="animate-pulse min-h-32 w-full bg-gray-200 rounded-lg text-secondary font-medium shadow-xl flex flex-col items-center gap-3">
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

                            ) : publications.length === 0 ? (
                                <div className='col-span-3 flex flex-col items-center justify-center text-center p-10 border-gray-300 rounded-lg'>
                                    <span className='font-semibold text-lg text-black'>Belum ada berita</span>
                                    <span className='text-sm text-gray-600'>Konten akan muncul ketika publikasi tersedia.</span>
                                </div>
                            ) : (
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto  gap-10 w-full'>
                                    {
                                        publications.map((publication, idx) => (
                                            <NavLink to={`/berita/${publication.slug}`} key={idx} className="min-h-32 w-full md:basis-1/3 lg:basis-1/4 bg-white rounded-lg text-secondary font-medium shadow-xl flex flex-col items-center gap-3">
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

                            {/* Pagination Controls */}
                            {publications.length > 0 && (
                                <Pagination
                                    currentPage={currentPage}
                                    handlePageChange={handlePageChange}
                                    totalPages={totalPages}
                                    className='lg:col-span-6'
                                />
                            )}
                        </div>
                        <div className='flex flex-col gap-5 lg:col-span-2'>
                            <div className='p-5 bg-[#e8ad38] rounded-lg'>
                                <span className='text-white font-bold text-xl'>Berita Terkini</span>
                            </div>
                            <div className='flex flex-col gap-5'>
                                {latestNews.length === 0 ? (
                                    <div className='text-secondary'>Belum ada berita terbaru.</div>
                                ) : (
                                    latestNews.map((pub) => (
                                        <NavLink to={`/berita/${pub.slug}`} key={pub.id} className='text-secondary flex flex-col lg:grid lg:grid-cols-3 gap-2 shadow p-3 rounded-xl'>
                                            <img src={pub.imageUrl()} className='w-full h-full object-cover rounded-lg' alt={pub.title} />
                                            <div className='col-span-2'>
                                                <span className='text-xs'>{pub.createdAt.formatForHeaderSubtitle()}</span>
                                                <span className='font-semibold text-lg line-clamp-2 text-black'>
                                                    {pub.title}
                                                </span>
                                                <span className='line-clamp-2 text-sm text-ellipsis overflow-hidden'>{pub.shortDescription}</span>
                                            </div>
                                        </NavLink>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default NewsPage
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import { PublicationView } from '@/application/publication/PublicationView';
import Footer from '../components/Footer';
import LoadingPage from '@/presentation/components/LoadingPage';
import { NavLink } from 'react-router-dom';

const NewsContent = () => {
    const { publicationService } = useDepedencies();
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const [publication, setPublication] = useState<PublicationView | null>(null);
    const [latestNews, setLatestNews] = useState<PublicationView[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, []);

    useEffect(() => {
        const fetchPublication = async () => {
            if (!slug) {
                navigate('/404');
                return;
            }

            try {
                setIsLoading(true);
                const response = await publicationService.getPublicationData(slug);
                setPublication(response.data || null);
            } catch (error) {
                console.error('Error fetching publication:', error);
                navigate('/404');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPublication();
    }, [slug, navigate, publicationService]);

    useEffect(() => {
        const fetchLatestNews = async () => {
            try {
                const response = await publicationService.getPublications({
                    page: 1,
                    per_page: 3
                });
                setLatestNews(response.data.slice(0, 3));
            } catch (error) {
                console.error('Error fetching latest news:', error);
            }
        };

        fetchLatestNews();
    }, [publicationService]);

    if (isLoading) {
        return <LoadingPage />;
    }

    if (!publication) {
        return (
            <>
                <Header className='fixed top-0 left-0 w-full z-50' />
                <div className='mt-[82px] min-h-screen flex items-center justify-center'>
                    <div className='text-center'>
                        <h1 className='text-4xl font-bold text-gray-800 mb-4'>Publikasi Tidak Ditemukan</h1>
                        <NavLink to='/berita' className='text-[#e8ad38] hover:underline'>
                            Kembali ke daftar berita
                        </NavLink>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <div className='min-h-screen' style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <Header className='fixed top-0 left-0 w-full z-50' />
                <div className='flex flex-col gap-5'>
                    {/* Hero Section */}
                    <div
                        className='mt-[82px] flex items-center py-10 relative min-h-[300px] px-10 xl:px-32 gap-20 bg-cover bg-center'
                        style={{
                            backgroundImage: `url('${publication.imageUrl()}')`,
                        }}
                    >
                        {/* Overlay */}
                        <div className='absolute inset-0 bg-black opacity-40 z-0'></div>

                        <div className='relative z-10 flex flex-col gap-5 justify-center max-w-2xl'>
                            <h1 className='text-white text-4xl lg:text-5xl font-bold leading-tight'>
                                {publication.title}
                            </h1>
                            <p className='text-gray-100 text-sm lg:text-base'>
                                {publication.createdAt.formatForHeaderSubtitle()}
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className='px-10 xl:px-32 grid grid-cols-1 lg:grid-cols-8 gap-20 py-14'>
                        {/* Main Content */}
                        <div className='lg:col-span-6'>
                            {/* Meta Info */}
                            <div className='flex flex-col gap-4 mb-8 pb-8 border-b border-gray-200'>
                                <div className='flex items-center gap-4 flex-wrap'>
                                    <span className='text-sm text-gray-600'>
                                        Kategori: <span className='font-semibold text-gray-900'>{publication.publicationCategoryName}</span>
                                    </span>
                                    <span className='text-sm text-gray-600'>
                                        Penulis: <span className='font-semibold text-gray-900'>{publication.writerName}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Main Content with Tailwind Prose */}
                            <div className='relative prose prose-sm max-w-none break-words overflow-hidden lg:prose-lg w-full prose-a:text-[#e8ad38] prose-a:hover:underline prose-img:rounded-lg prose-img:shadow-md prose-headings:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:marker:text-[#e8ad38]'>
                                <div dangerouslySetInnerHTML={{ __html: publication.description }} />
                            </div>
                        </div>

                        {/* Sidebar - Latest News */}
                        <div className='flex flex-col gap-5 lg:col-span-2'>
                            <div className='p-5 bg-[#e8ad38] rounded-lg'>
                                <span className='text-white font-bold text-xl'>Berita Terkini</span>
                            </div>
                            <div className='flex flex-col gap-5'>
                                {latestNews.length === 0 ? (
                                    <div className='text-secondary'>Belum ada berita terbaru.</div>
                                ) : (
                                    latestNews.map((pub) => (
                                        <NavLink
                                            to={`/berita/${pub.slug}`}
                                            key={pub.id}
                                            className='text-secondary flex flex-col lg:grid lg:grid-cols-3 gap-2 shadow p-3 rounded-xl'
                                        >
                                            <img
                                                src={pub.imageUrl()}
                                                className='w-full h-full object-cover rounded-lg'
                                                alt={pub.title}
                                            />
                                            <div className='col-span-2'>
                                                <span className='text-xs text-gray-500'>{pub.createdAt.formatForHeaderSubtitle()}</span>
                                                <span className='font-semibold text-sm line-clamp-2 text-black'>
                                                    {pub.title}
                                                </span>
                                                <span className='line-clamp-2 text-xs text-ellipsis overflow-hidden'>{pub.shortDescription}</span>
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
    );
};

export default NewsContent
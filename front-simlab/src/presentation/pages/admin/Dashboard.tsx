import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import { useRef } from "react"
import Header from '@/presentation/components/Header';
import { Skeleton } from '@/presentation/components/ui/skeleton';
import ItkLogo from '../../assets/itk_logo.png'

const Dashboard = () => {
    const sectionRef = useRef<HTMLDivElement | null>(null)

    useGSAP(() => {
        if (!sectionRef.current) return

        const tl = gsap.timeline()
        tl.fromTo(sectionRef.current,
            {
                opacity: 0,
                y: 100
            },
            {
                opacity: 1,
                y: 0,
                duration: 1
            },
        )
    }, [])

    return (
        <>
            <Header title='Dashboard'/>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center" ref={sectionRef}>
                <img src={ItkLogo} className='h-[60vh] w-auto' alt="ITK Logo" />
                {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Skeleton className="aspect-video rounded-xl" />
                    <Skeleton className="aspect-video rounded-xl" />
                    <Skeleton className="aspect-video rounded-xl" />
                </div>
                <Skeleton className="min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}
            </div>
        </>
    )
}

export default Dashboard

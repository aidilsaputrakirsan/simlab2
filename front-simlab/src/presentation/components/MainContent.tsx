import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import React, { useRef } from 'react'

interface MainContentProps {
    children: React.ReactNode
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
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
        <div className="flex flex-col gap-4 p-4 pt-0" ref={sectionRef}>
            { children }
        </div>
    )
}

export default MainContent
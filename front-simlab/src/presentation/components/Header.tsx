import React, { useCallback, useState } from 'react'
import { Separator } from './ui/separator'
import { SidebarTrigger } from './ui/sidebar'
import { useTheme } from '../contexts/ThemeContext'
import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'

interface HeaderProps {
    title: string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const { setTheme, theme } = useTheme()
    const [currentTheme, setCurrentTheme] = useState<"light" | 'dark' | 'system'>(theme)

    const handleToogleTheme = () => {
        setTheme(currentTheme === 'dark' ? 'light' : 'dark')
        setCurrentTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }

    return (
        <header className="flex justify-between bg-primary shadow-lg text-white h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 mb-5 border-b px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                <h1 className='font-semibold'>{title}</h1>
            </div>
            <Button variant={'ghost'} size={'icon'} onClick={handleToogleTheme}>{theme === 'light' ? <Sun /> : <Moon />}</Button>
        </header>
    )
}

export default Header

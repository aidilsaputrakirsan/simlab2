import React from 'react'
import { Separator } from './ui/separator'
import { SidebarTrigger } from './ui/sidebar'

interface HeaderProps {
    title: string
}

const Header:React.FC<HeaderProps> = ({title}) => {
    return (
        <header className="flex bg-primary text-white h-16 shadow-lg shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 mb-5">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                {/* <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    Building Your Application
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb> */}
                <h1 className='font-semibold'>{title}</h1>
            </div>
        </header>
    )
}

export default Header

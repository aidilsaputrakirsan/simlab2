// import React, { useState, useEffect, useRef } from 'react';
// import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
// import Icon from '@mdi/react';
// import { mdiAccountOutline, mdiKeyOutline, mdiKeyVariant, mdiMenu, mdiViewDashboardOutline } from '@mdi/js';
// import { useAuth } from '../../application/hooks/useAuth';
// import DropdownMenu from '../components/DropdownMenu';
// import Swal from 'sweetalert2';

// type DropdownItem = {
//   path: string;
//   title: string;
// }

// type NavItem = {
//   title: string;
//   icon: React.ReactNode;
//   path: string;
//   children?: DropdownItem[];
//   is_end?: boolean;
// }

// const AdminLayout: React.FC = () => {
//   const location = useLocation();
//   const { user, logout } = useAuth();
//   const [expandedMenu, setExpandedMenu] = useState(false);
//   const [profileMenuOpen, setProfileMenuOpen] = useState(false);
//   const currentPath = useRef(location.pathname)

//   // Redirect if not authenticated
//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   const handleLogout = async () => {
//     const result = await Swal.fire({
//       title: 'Apakah anda yakin?',
//       text: "Jika yakin anda akan diarahkan ke halaman login",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, delete it!'
//     })

//     if (result.isConfirmed) {
//       await logout()

//       return <Navigate to="/login" state={{ from: location }} replace />;
//     }
//   }

//   // Navigation items
//   const navItems: NavItem[] = [
//     {
//       title: 'Dashboard',
//       icon: <Icon path={mdiViewDashboardOutline} size={.9} />,
//       path: '/panel',
//       is_end: true
//     },
//     {
//       title: 'Data Master',
//       icon: <Icon path={mdiKeyOutline} size={.9} />,
//       path: '',
//       children: [
//         { title: "Tahun Akademik", path: '/panel/tahun-akademik' },
//         { title: 'Jenis Pengujian', path: '/panel/jenis-pengujian' },
//         { title: 'Jurusan', path: '/panel/jurusan' },
//         { title: 'Prodi', path: '/panel/prodi' },
//         { title: 'Praktikum', path: '/panel/praktikum' },
//         { title: 'Ruangan Laboratorium', path: '/panel/ruangan-laboratorium' },
//         { title: 'Alat Laboratorium', path: '/panel/alat-laboratorium' },
//         { title: 'Bahan Laboratorium', path: '/panel/bahan-laboratorium' },
//       ]
//     },
//     {
//       title: 'Management User',
//       icon: <Icon path={mdiAccountOutline} size={.9} />,
//       path: '',
//       children: [
//         { title: "Admin", path: '/panel/admin' },
//         { title: "Pengguna Akademik", path: '/panel/pengguna-akademik' },
//         { title: "Laboran", path: '/panel/laboran' },
//         { title: 'Mahasiswa', path: '/panel/mahasiswa' },
//         { title: 'Pihak Luar', path: '/panel/pihak-luar' },
//       ]
//     },
//     { title: 'Reports', icon: <Icon path={mdiKeyVariant} size={.9} />, path: '/reports' },
//     { title: 'Notifications', icon: <p>icon</p>, path: '/notifications' },
//     { title: 'Settings', icon: <p>icon</p>, path: '/settings' },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="sticky top-0 flex-col w-full bg-white border-gray-200 z-[98] lg:border-b shadow">
//         <div className='text-white bg-[#1F3BB3] shadow-lg'>
//           <div className="flex items-center justify-between py-5 bg-green content-container">
//             <span className='text-xl font-bold'>SIMLAB</span>
//             <div className='flex'>
//               <button className='flex cursor-pointer lg:hidden' onClick={() => setExpandedMenu((prev) => !prev)}>
//                 <Icon path={mdiMenu} size={.9} />
//               </button>
//               {user && (
//                 <div className='relative'>
//                   <button className="items-center hidden text-gray-700 lg:flex dropdown-toggle dark:text-gray-400"
//                     onMouseEnter={() => setProfileMenuOpen(true)}
//                     onMouseLeave={() => setProfileMenuOpen(false)}>
//                     <span className="block mr-1 font-medium text-white">{String(user.name)}</span>
//                   </button>
//                   <div
//                     className={`absolute right-0 z-10 min-w-48 mt-1 text-gray-700 bg-white border border-gray-200 rounded-md shadow-lg transition-all duration-300 ${profileMenuOpen ? 'opacity-100' : 'opacity-0 -translate-y-10'}`}
//                     onMouseEnter={() => setProfileMenuOpen(true)}
//                     onMouseLeave={() => setProfileMenuOpen(false)}
//                   >
//                     <button className='block w-full px-4 py-2 text-left transition-colors whitespace-nowrap hover:bg-gray-100'>
//                       Profile Management
//                     </button>
//                     <button className='block w-full px-4 py-2 text-left transition-colors whitespace-nowrap hover:bg-gray-100' onClick={handleLogout}>
//                       Logout
//                     </button>
//                   </div>
//                 </div>

//               )}
//             </div>
//           </div>
//         </div>
//         <div className='shadow-lg'>
//           <div className={`lg:justify-between py-3 content-container transition-all  ${expandedMenu ? 'flex flex-wrap gap-5' : 'hidden lg:flex items-center'}`}>
//             {navItems.map((item, i) => (
//               <div key={i} className='text-sm'>
//                 {item.children ? (
//                   <DropdownMenu key={Math.random()} title={item.title} icon={item.icon} items={item.children}
//                   />
//                 ) : (
//                   <NavLink
//                     end={item.is_end}
//                     to={item.path}
//                     className={({ isActive }) => `
//                     flex items-center justify-center group-hover:justify-start gap-4 rounded-lg cursor-pointer transition-colors
//                     ${isActive ? ' text-blue-600' : ''}
//                   `}
//                   >
//                     {item.icon}
//                     <span className={` transition-opacity whitespace-nowrap`}>
//                       {item.title}
//                     </span>
//                   </NavLink>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </header>
//       {/* Main Content */}
//       <div className='flex justify-center content-container'>
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/presentation/components/ui/sidebar"
import { Navigate, Outlet } from "react-router-dom"
import { NavUser } from "../components/nav-user"
import { NavMain } from "../components/nav-main"
import { Key, LayoutDashboard, SquareTerminal } from "lucide-react"
import { Toaster } from "../components/ui/sonner"
import { useAuth } from "@/application/hooks/useAuth"
import { ThemeProvider } from "@/application/context/ThemeContext"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/panel",
      icon: LayoutDashboard,
      is_end: true,
    },
    {
      title: "Data Master",
      url: "#",
      icon: Key,
      items: [
        {
          title: "Tahun Akademik",
          url: "/panel/tahun-akademik",
        },
        {
          title: "Jenis Pengujian",
          url: "/panel/jenis-pengujian",
        },
        {
          title: "Jurusan",
          url: "/panel/jurusan",
        },
        {
          title: "Prodi",
          url: "/panel/Prodi",
        },
        {
          title: "Praktikum",
          url: "/panel/Praktikum",
        },
        {
          title: "Ruangan Laboratorium",
          url: "/panel/ruangan-laboratorium",
        },
        {
          title: "Alat Laboratorium",
          url: "/panel/alat-laboratorium",
        },
        {
          title: "Bahan Laboratorium",
          url: "/panel/bahan-laboratorium",
        },
      ],
    },
    {
      title: "Manajemen User",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Admin",
          url: "/panel/admin",
        },
        {
          title: "Koorprodi",
          url: "/panel/koorprodi",
        },
        {
          title: "Kepala Lab. Unit",
          url: "/panel/kepala-lab-unit",
        },
        {
          title: "Dosen",
          url: "/panel/dosen",
        },
        {
          title: "Laboran",
          url: "/panel/laboran",
        },
        {
          title: "Mahasiswa",
          url: "/panel/mahasiswa",
        },
        {
          title: "Pihak Luar",
          url: "/panel/pihak-luar",
        },
      ],
    },
  ],
}

export default function AdminLayout() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="theme-setting">
      <SidebarProvider>
        <Sidebar collapsible="icon" variant="inset">
          <SidebarHeader>
            <NavUser user={user} logout={logout} />
          </SidebarHeader>
          <SidebarContent>
            <NavMain items={data.navMain} />
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="overflow-hidden">
          <Outlet />
          <Toaster position="top-right" richColors expand={true} closeButton />
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

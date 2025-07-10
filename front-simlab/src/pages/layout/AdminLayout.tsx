import React, { useState, useEffect } from 'react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '@mdi/react';
import { mdiKeyVariant, mdiMenu, mdiViewDashboard } from '@mdi/js';

type DropdownItem = {
  path: string;
  title: string;
}

type NavItem = {
  title: string;
  icon: React.ReactNode;
  path: string;
  children?: DropdownItem[];
  is_end?: boolean;
}

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Replace activeDropdown with expandedMenus object
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  // Redirect if not authenticated
  if (!user) {
    // return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Navigation items
  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      icon: <Icon path={mdiViewDashboard} size={1} />,
      path: '/panel',
      is_end: true
    },
    {
      title: 'Data Master',
      icon: <Icon path={mdiKeyVariant} size={1} />,
      path: '',
      children: [
        { title: "Tahun Akademik", path: '/panel/tahun-akademik' },
        { title: 'Sample 2', path: '/dasdasd' }
      ]
    },
    { title: 'Reports', icon: <Icon path={mdiKeyVariant} size={1} />, path: '/reports' },
    { title: 'Notifications', icon: <p>icon</p>, path: '/notifications' },
    { title: 'Settings', icon: <p>icon</p>, path: '/settings' },
  ];

  // Set active dropdown based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    navItems.forEach(item => {
      if (item.children) {
        const isChildActive = item.children.some(child =>
          currentPath === child.path || currentPath.startsWith(child.path + '/')
        );
        if (isChildActive) {
          // Update expandedMenus instead of activeDropdown
          setExpandedMenus(prev => ({
            ...prev,
            [item.title]: true
          }));
        }
      }
    });
  }, [location.pathname]);

  // Implement the toggleSubmenu function
  const toggleSubmenu = (title: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 md:flex">
      {/* Sidebar */}
      <div className={`fixed w-[300px] h-min-screen z-[49] bg-white shadow-lg transition-all duration-300 group ${isSidebarOpen ? '-translate-x-full  md:translate-x-0 md:relative' : '-translate-x-full'
        }`}>
        {/* Sidebar Header */}
        <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center group-hover:justify-between'} h-16 px-4 border-b`}>
          <span className={`text-xl font-semibold text-gray-800 transition-opacity ${!isSidebarOpen ? 'hidden group-hover:block' : 'block'
            }`}>
            SIMLAB
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 max-h-[calc(100vh-4rem)]">
          {navItems.map((item, i) => (
            <div key={item.path} className="mb-1">
              {item.children ? (
                <div
                  key={i}
                  onClick={() => toggleSubmenu(item.title)}
                  className={`flex items-center ${!isSidebarOpen ? 'justify-center group-hover:justify-start group-hover:px-4' : 'px-4'} gap-4 py-3 rounded-lg cursor-pointer transition-colors ${expandedMenus[item.title]
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    {item.icon}
                    <span className={`font-medium transition-opacity whitespace-nowrap ${!isSidebarOpen ? 'hidden group-hover:block' : 'block'
                      }`}>
                      {item.title}
                    </span>
                  </div>
                  <span className={`transition-transform ${expandedMenus[item.title] ? 'rotate-90' : ''
                    } ${!isSidebarOpen ? 'hidden group-hover:block' : 'block'}`}>
                    {/* Dropdown icon can be replaced */}
                    &gt;
                  </span>
                </div>
              ) : (
                <NavLink
                  end={item.is_end}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center ${!isSidebarOpen ? 'justify-center group-hover:justify-start group-hover:px-4 py-3' : 'px-4'} gap-4 py-3 rounded-lg cursor-pointer transition-colors
                    ${isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}
                  `}
                >
                  {item.icon}
                  <span className={`font-medium transition-opacity whitespace-nowrap ${!isSidebarOpen ? 'hidden group-hover:block' : 'block'
                    }`}>
                    {item.title}
                  </span>
                </NavLink>
              )}

              {/* Dropdown submenu */}
              {item.children && expandedMenus[item.title] && (
                <ul className={`space-y-1 ml-6 mt-1 transition-all ${!isSidebarOpen ? 'hidden group-hover:block' : 'block'
                  }`}>
                  {item.children.map((subMenu) => (
                    <li key={subMenu.path} className="overflow-hidden">
                      <NavLink
                        to={subMenu.path}
                        className={({ isActive }) => `
                          block px-4 py-2 rounded-md transition-colors whitespace-nowrap
                          ${isActive ? 'text-blue-600 bg-blue-50' : 'hover:bg-gray-50'}
                        `}
                      >
                        {subMenu.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className='flex-1 w-full'>
        <header className="sticky top-0 flex w-full bg-white border-gray-200 z-[98] lg:border-b">
          <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
            <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
              <button
                onClick={toggleSidebar}
                className="p-2 transition-colors rounded-lg"
                aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                <Icon path={mdiMenu} size={1} />
              </button>
              {/* <button className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z" fill="currentColor"></path>
                </svg>
              </button> */}
            </div>
            <div className="items-center justify-between hidden w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none">
              <div className="relative">
                <button className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400">
                  <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
                    <img alt="User" src="/images/user/owner.jpg" />
                  </span>
                  <span className="block mr-1 font-medium text-theme-sm">Musharof</span>
                  {/* <svg className="transition-transform duration-200 stroke-gray-500 dark:stroke-gray-400 " width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.3125 8.65625L9 13.3437L13.6875 8.65625" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg> */}
                </button>
              </div>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <div className="overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
import React, { useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface Item {
  title: string,
  path: string
}

interface DropdownProps {
  title: string;
  icon: React.ReactNode;
  items: Item[];
}

const DropdownMenu: React.FC<DropdownProps> = ({ title, items, icon }) => {
  const location = useLocation();
  const currentPath = useRef(location.pathname)
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      {/* Dropdown trigger */}
      <div 
        className={`flex items-center justify-center gap-4 rounded-lg cursor-pointer ${items?.some(child => child.path == currentPath.current)
          ? 'text-blue-600'
          : ''
          }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {icon}
        <span className={`transition-opacity whitespace-nowrap`}>
          {title}
        </span>
      </div>
      
      {/* Dropdown menu */}
        <div 
          className={`absolute z-10 min-w-48 mt-1 text-gray-700 bg-white border border-gray-200 rounded-md shadow-lg transition-all duration-300 ${isOpen ? 'opacity-100' : 'invisible opacity-0 -translate-y-10'}`}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {items.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => `
                block px-4 py-2 transition-colors whitespace-nowrap
                ${isActive ? 'text-blue-600 bg-blue-50' : 'hover:bg-gray-50'}
              `}
            >
              {item.title}
            </NavLink>
          ))}
        </div>
    </div>
  );
};

export default DropdownMenu

// Demo component with multiple dropdowns
// const dropdown = () => {
//   const dropdowns = [
//     {
//       title: "Products",
//       items: ["Product 1", "Product 2", "Product 3"]
//     },
//     {
//       title: "Services",
//       items: ["Service 1", "Service 2", "Service 3", "Service 4"]
//     },
//     {
//       title: "Resources",
//       items: ["Documentation", "Tutorials", "Support", "FAQ"]
//     }
//   ];
  
//   return (
//     <div className="min-h-screen p-8 bg-gray-50">
//       <h1 className="mb-6 text-2xl font-bold text-gray-800">Hover Dropdown Menu</h1>
//       <div className="flex space-x-4">
//         {dropdowns.map((dropdown, index) => (
//           <HoverDropdown 
//             key={index} 
//             title={dropdown.title} 
//             items={dropdown.items} 
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default dropdown;
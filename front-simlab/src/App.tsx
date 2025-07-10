import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import TahunAkademik from './pages/admin/tahun-akademik/TakunAkademik';
import { Login } from './pages/auth/login';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './pages/layout/AdminLayout';
import Dashboard from './pages/admin/panel/Dashboard';
// import { 
//   ChevronLeft, 
//   ChevronRight, 
//   LayoutDashboard, 
//   Users, 
//   Settings, 
//   FileText, 
//   Bell 
// } from 'lucide-react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <>Landing page disini</>
  },
  {
    path: '/login',
    element: <AuthProvider><Login/></AuthProvider>
  },
  {
    path: '/panel',
    element: <AuthProvider><AdminLayout/></AuthProvider>,
    children: [
      {
        path: '',
        element: <Dashboard/>
      },
      {
        path: 'tahun-akademik',
        element: <TahunAkademik/>
      }
    ]
  },
  // {
  //   path: '*',
  //   element: <Not
  // }
])

const App = () => {
  return <RouterProvider router={router} />
};

export default App;
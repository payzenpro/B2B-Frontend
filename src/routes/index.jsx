
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import RoleBasedLayout from './layouts/RoleBasedLayout';
import ProtectedRoute from './components/ProtectedRoute';
//import AdminLayout from './components/layouts/AdminLayout';
//import VendorLayout from './components/layouts/VendorLayout';
// CustomerLayout from './components/layouts/CustomerLayout';

// Import dashboard pages
import Dashboard from './pages/admin/Dashboard'; 


const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/auth', element: <Auth /> },

  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RoleBasedLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard /> },
     
    ],
  },

  
  { path: '*', element: <Navigate to="/auth" replace /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}




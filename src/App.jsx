

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import 'antd/dist/reset.css';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import RoleBasedLayout from './components/layouts/RoleBasedLayout';
import ProtectedRoute from './components/ProtectedRoute';


// Import dashboard pages
// import Dashboard from './admin/Dashboard';
// import VendorDashboard from './vendor/VendorDashboard';
// import CustomerDashboard from './customer/CustomerDashboard';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/auth', element: <Auth /> },
  { path: '/cart', element: <Cart />},

  // Superadmin routes
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute requiredRole="superadmin">
        <RoleBasedLayout />
      </ProtectedRoute>
    ),
  
  },

  // Vendor routes
  {
    path: '/vendor/dashboard',
    element: (
      <ProtectedRoute requiredRole="vendor">
        <RoleBasedLayout />
      </ProtectedRoute>
    ),
   
  },

  // Customer routes
  {
    path: '/customer/dashboard',
    element: (
      <ProtectedRoute requiredRole="customer">
        <RoleBasedLayout />
      </ProtectedRoute>
    ),
    
  },

  { path: '*', element: <Navigate to="/auth" replace /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

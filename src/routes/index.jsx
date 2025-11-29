
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import BuyNow from "./pages/BuyNow";


import RoleBasedLayout from './layouts/RoleBasedLayout';
import ProtectedRoute from './components/ProtectedRoute';



import Dashboard from './components/Dashboard';
 import CustomerDashboard from './components/CustomerDashboard';
import VendorDashboard from './pages/vendor/VendorDashboard.jsx';




const router = createBrowserRouter([
  { path: '/', element: <Home /> },
   { path: '/auth', element: <Auth /> },
   { path: '/cart', element: <Cart />},
   {path: '/buy-now', element: <BuyNow />},

    
  


  {
    path: '/Dashboard',
    element: (
      <ProtectedRoute>
        <RoleBasedLayout />
      </ProtectedRoute>
    ),

  
   children: [
      { index: true, element: <Dashboard /> }
     

     
   ]
  },
   {
    path: '/vendor',
    element: (
      <ProtectedRoute>
        <RoleBasedLayout />
      </ProtectedRoute>
    ),

  children: [
     { index: true, element: <VendorDashboard /> } 
     
   ]
  },
    {
    path: '/Customer',
    element: (
      <ProtectedRoute>
        <RoleBasedLayout />
      </ProtectedRoute>
    ),

  children: [
     { index: true, element: <CustomerDashboard /> } 
     
   ]
  },

  
 
  { path: '*', element: <Navigate to="/auth" replace /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}




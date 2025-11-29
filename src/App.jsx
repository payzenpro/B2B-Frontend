
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import 'antd/dist/reset.css';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Cart from './pages/Cart';

import RoleBasedLayout from './components/layouts/RoleBasedLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetails from './pages/ProductDetails';




import { adminRoutes } from './routes/adminRoutes';
import { vendorRoutes } from './routes/vendorRoutes';
import { customerRoutes } from './routes/customerRoutes';


import CustomerLogin from "./pages/CustomerLogin.jsx";
import VendorLogin from "./pages/VendorLogin.jsx";
import SuperadminLogin from "./pages/SuperadminLogin.jsx";

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/auth', element: <Auth /> },
  { path: '/cart', element: <Cart />},
  {path:  '/product/:id',  element: <ProductDetails />},
  { path: '/login/customer', element: <CustomerLogin />},
  { path: '/login/vendor', element: <VendorLogin />} ,
  { path: '/login/superadmin', element: <SuperadminLogin />} ,

  adminRoutes, vendorRoutes, customerRoutes,  

  

  // { path: '*', element: <Navigate to="/auth" replace /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

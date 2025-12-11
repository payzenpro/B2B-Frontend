import ProtectedRoute from "../components/ProtectedRoute.jsx";
import CustomerOrders from "../components/orders/CustomerOrders.jsx";

import CustomerDashboard from "../pages/customer/CustomerDashboard.jsx";
import CustomerOrderDetailsView from '../pages/customer/CustomerOrderDetailsView.jsx';


import CustomerProfile from "../pages/customer/CustomerProfile.jsx";
import CustomerAddress from "../pages/customer/CustomerAddress.jsx";
import CustomerWishlist from "../pages/customer/CustomerWishlist.jsx";
import CustomerCart from "../pages/customer/CustomerCart.jsx";
import RoleBasedLayout from "../components/layouts/RoleBasedLayout.jsx";



 export const customerRoutes = {
  path: "/customer/dashboard",
  element: (
    <ProtectedRoute requiredRole="customer">
      <RoleBasedLayout />
    </ProtectedRoute>
  ),
  children: [
      { index: true, element: <CustomerDashboard /> },  
    
    { path: "cart", element: <CustomerCart /> },
    { path: "orders", element: <CustomerOrders /> },
           
     {  path: "orders/:orderId", element: <CustomerOrderDetailsView /> },
    { path: "wishlist", element: <CustomerWishlist /> },
    
    { path: "profile", element: <CustomerProfile /> },
    { path: "address", element: <CustomerAddress /> },
  ]
};

import ProtectedRoute from "../components/ProtectedRoute.jsx";
import CustomerLayout from "../components/layouts/CustomerLayout.jsx";
import CustomerProducts from "../components/products/CustomerProducts.jsx";
import CustomerOrders from "../components/orders/CustomerOrders.jsx";

import CustomerDashboard from "../pages/customer/CustomerDashboard.jsx";


import CustomerProfile from "../pages/customer/CustomerProfile.jsx";
import CustomerCart from "../pages/customer/CustomerCart.jsx";
import CustomerOrderDetails from "../pages/customer/CustomerOrderDetails.jsx";

function CustomerWishlist() { return <div style={{ padding: '20px' }}><h2>Wishlist</h2></div>; }
function CustomerAddresses() { return <div style={{ padding: '20px' }}><h2>My Addresses</h2></div>; }

export const customerRoutes = {
  path: "customer",
  element: <ProtectedRoute requiredRole="customer"><CustomerLayout /></ProtectedRoute>,
  children: [
    { path: "dashboard", element: <CustomerDashboard /> },
    { path: "products", element: <CustomerProducts /> },
    { path: "cart", element: <CustomerCart /> },
    { path: "orders", element: <CustomerOrders /> },
    { path: "wishlist", element: <CustomerWishlist /> },
    { path: "addresses", element: <CustomerAddresses /> },
    { path: "profile", element: <CustomerProfile /> },
       {
      path: "orders/:id",
      element: <CustomerOrderDetails />,
    },
  ]
};

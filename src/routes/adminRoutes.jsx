import ProtectedRoute from "../components/ProtectedRoute.jsx";
import AdminLayout from "../components/layouts/AdminLayout.jsx";
import Products from "../components/products/products.jsx";
import Orders from "../components/orders/orders.jsx";

import Dashboard from "../admin/Dashboard.jsx";
import Users from "../pages/Users.jsx";


import FlashSales from "../pages/admin/FlashSales.jsx";
 
import Stores from "../pages/admin/Stores.jsx";
import AddStores from "../pages/admin/AddStores.jsx";
import POS from "../pages/admin/POS.jsx";
import AdminVendorList from "../pages/admin/AdminVendorList.jsx";
import RefundList from "../pages/admin/RefundList.jsx";
import BannerList from "../pages/admin/BannerList.jsx";
import AdminVendorDashboard from "../pages/admin/AdminVendorDashboard.jsx";
import AdminCustomerList from "../pages/admin/AdminCustomerList.jsx";
import AdminCustomerDashboard from "../pages/admin/AdminCustomerDashboard.jsx";
import AdminVendorDashboardView from "../pages/admin/AdminVendorDashboardView.jsx";
import AdminCustomerDashboardView from "../pages/admin/AdminCustomerDashboardView.jsx";
import Attributes from "../pages/admin/Attributes.jsx";
import Categories from "../pages/admin/Categories.jsx";
import Coupons from "../pages/admin/Coupons.jsx";


export const adminRoutes = {
  element: <AdminLayout />,
  children: [
    { path: "dashboard", element: <ProtectedRoute requiredRole="superadmin"><Dashboard /></ProtectedRoute> },
    { path: "pos", element: <ProtectedRoute requiredRole="superadmin"><POS /></ProtectedRoute> },
    { path: "users", element: <ProtectedRoute requiredRole="superadmin"><Users /></ProtectedRoute> },
    { path: "orders", element: <ProtectedRoute requiredRole="superadmin"><Orders /></ProtectedRoute> },
    { path: "refunds", element: <ProtectedRoute requiredRole="superadmin"><RefundList /></ProtectedRoute> },
    { path: "flash-sales", element: <ProtectedRoute requiredRole="superadmin"><FlashSales /></ProtectedRoute> },
  
    { path: "banners", element: <ProtectedRoute requiredRole="superadmin"><BannerList /></ProtectedRoute> }, 
    { path: "coupons", element: <ProtectedRoute requiredRole="superadmin"><Coupons /></ProtectedRoute> },
    { path: "categories", element: <ProtectedRoute requiredRole="superadmin"><Categories /></ProtectedRoute> },
    { path: "attributes", element: <ProtectedRoute requiredRole="superadmin"><Attributes /></ProtectedRoute> },
    { path: "products", element: <ProtectedRoute requiredRole="superadmin"><Products /></ProtectedRoute> },
    { path: "stores", element: <ProtectedRoute requiredRole="superadmin"><Stores /></ProtectedRoute> },
    { path: "stores/new", element: <ProtectedRoute requiredRole="superadmin"><AddStores /></ProtectedRoute> },
    { path: "vendor-list", element: <ProtectedRoute requiredRole="superadmin"><AdminVendorList /></ProtectedRoute> },
    { path: "vendor-list/:vendorId/dashboard", element: <ProtectedRoute requiredRole="superadmin"><AdminVendorDashboard /></ProtectedRoute> },
    { path: "customer-list", element: <ProtectedRoute requiredRole="superadmin"><AdminCustomerList /></ProtectedRoute> },
    { path: "customer-list/:customerId/dashboard", element: <ProtectedRoute requiredRole="superadmin"><AdminCustomerDashboard /></ProtectedRoute> },
    { path: "vendor-dashboard/:vendorId", element: <ProtectedRoute requiredRole="superadmin"><AdminVendorDashboardView /></ProtectedRoute> },
    { path: "customer-dashboard/:customerId", element: <ProtectedRoute requiredRole="superadmin"><AdminCustomerDashboardView /></ProtectedRoute> },
      
  ]
};

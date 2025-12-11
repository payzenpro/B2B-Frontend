import ProtectedRoute from "../components/ProtectedRoute.jsx";
import Products from "../components/products/products.jsx";
import Orders from "../components/orders/orders.jsx";

import Users from "../pages/Users.jsx";


// import FlashSales from "../pages/admin/FlashSales.jsx";
 
import Stores from "../pages/admin/Stores.jsx";
// import AddStores from "../pages/admin/AddStores.jsx";
import AdminVendorList from "../pages/admin/AdminVendorList.jsx";
import RefundList from "../pages/admin/RefundList.jsx";
import BannerList from "../pages/admin/BannerList.jsx";
import AdminCustomerList from "../pages/admin/AdminCustomerList.jsx";
import AdminVendorDashboardView from "../pages/admin/AdminVendorDashboardView.jsx";
import AdminCustomerDashboardView from "../pages/admin/AdminCustomerDashboardView.jsx";
import Categories from "../pages/admin/Categories.jsx";
import Coupons from "../pages/admin/Coupons.jsx";
import RoleBasedLayout from "../components/layouts/RoleBasedLayout.jsx";
import Dashboard from "../pages/admin/Dashboard.jsx";

export const adminRoutes = {
  path: "/dashboard",
  element: (
    <ProtectedRoute requiredRole="superadmin">
      <RoleBasedLayout/>
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <Dashboard /> },         
               
    { path: "users", element: <Users /> },            
    { path: "orders", element: <Orders /> },         
    { path: "refunds", element: <RefundList /> },
    // { path: "flash-sales", element: <FlashSales /> },
    { path: "banners", element: <BannerList /> },
    { path: "coupons", element: <Coupons /> },
    { path: "categories", element: <Categories /> },
    
    { path: "products", element: <Products /> },
    { path: "stores", element: <Stores /> },
    // { path: "stores/new", element: <AddStores /> },
    { path: "vendor-list", element: <AdminVendorList /> },
    { path: "customer-list", element: <AdminCustomerList /> },
  
    { path: "vendor-list/:vendorId/dashboard",element: <AdminVendorDashboardView />},
    { path: "customer-list/:customerId/dashboard", element: <AdminCustomerDashboardView /> },

  ]
};

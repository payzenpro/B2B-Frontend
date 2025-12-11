import ProtectedRoute from "../components/ProtectedRoute.jsx";


import VendorProducts from "../components/products/VendorProducts.jsx";
import VendorOrders from "../components/orders/VendorOrders.jsx";

import VendorOrderRefunds from "../pages/vendor/VendorOrderRefunds.jsx";

import VendorCoupons from "../pages/vendor/VendorCoupons.jsx";
import VendorBanners from "../pages/vendor/VendorBanners.jsx";
import VendorPushNotifications from "../pages/vendor/VendorPushNotifications.jsx";
import VendorCategories from "../pages/vendor/VendorCategories.jsx";
// import VendorAttributes from "../pages/vendor/VendorAttributes.jsx";


// import VendorAddStores from "../pages/vendor/VendorAddStores.jsx";
import VendorStoresList from "../pages/vendor/VendorStoresList.jsx";
import VendorMyShop from "../pages/vendor/VendorMyShop.jsx";
import VendorReviews from "../pages/vendor/VendorReviews.jsx";
import VendorChat from "../pages/vendor/VendorChat.jsx";
import VendorCustomerList from "../pages/vendor/VendorCustomerList.jsx";
import VendorDashboard from "../pages/vendor/VendorDashboard.jsx";
import RoleBasedLayout from "../components/layouts/RoleBasedLayout.jsx";

  
 export const vendorRoutes = {
  path: "/vendor/dashboard",
  element: (
    <ProtectedRoute requiredRole="vendor">
      <RoleBasedLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <VendorDashboard /> },

    { path: "orders", element: <VendorOrders /> },
   
 
    { path: "refunds", element: <VendorOrderRefunds /> },
    { path: "coupons", element: <VendorCoupons /> },
    { path: "banners", element: <VendorBanners /> },
    { path: "notifications", element: <VendorPushNotifications /> },
    { path: "categories", element: <VendorCategories /> },
    // { path: "attributes", element: <VendorAttributes /> },
    { path: "products", element: <VendorProducts /> },
    { path: "shop", element: <VendorMyShop /> },
    { path: "reviews", element: <VendorReviews /> },
    { path: "chat", element: <VendorChat /> },
    { path: "customer-list", element: <VendorCustomerList /> },
     { path: "stores", element: <VendorStoresList /> },   
    // { path: "stores/add", element: <VendorAddStores /> }, 
  ],
};

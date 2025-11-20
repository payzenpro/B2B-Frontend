import ProtectedRoute from "../components/ProtectedRoute.jsx";
import VendorLayout from "../components/layouts/VendorLayout.jsx";
import VendorProducts from "../components/products/VendorProducts.jsx";
import VendorOrders from "../components/orders/VendorOrders.jsx";

import VendorDashboard from "../vendor/VendorDashboard.jsx";
// import VendorItems from "../vendor/VendorItems.jsx";

import VendorPOS from "../pages/vendor/VendorPOS.jsx";
import VendorOrderRefunds from "../pages/vendor/VendorOrderRefunds.jsx";
import VendorFlashSales from "../pages/vendor/VendorFlashSales.jsx";
import VendorCampaigns from "../pages/vendor/VendorCampaigns.jsx";
import VendorCoupons from "../pages/vendor/VendorCoupons.jsx";
import VendorBanners from "../pages/vendor/VendorBanners.jsx";
import VendorPushNotifications from "../pages/vendor/VendorPushNotifications.jsx";
import VendorCategories from "../pages/vendor/VendorCategories.jsx";
import VendorAttributes from "../pages/vendor/VendorAttributes.jsx";


import VendorAddStores from "../pages/vendor/VendorAddStores.jsx";
import VendorStoresList from "../pages/vendor/VendorStoresList.jsx";
import VendorMyShop from "../pages/vendor/VendorMyShop.jsx";
import VendorReviews from "../pages/vendor/VendorReviews.jsx";
import VendorChat from "../pages/vendor/VendorChat.jsx";
import VendorCustomerList from "../pages/vendor/VendorCustomerList.jsx";
export const vendorRoutes = {
  path: "vendor",
  element: <ProtectedRoute requiredRole="vendor"><VendorLayout /></ProtectedRoute>,



  
  children: [
    { path: "dashboard", element: <VendorDashboard /> },
   
    { path: "orders", element: <VendorOrders /> },
    { path: "pos", element: <VendorPOS /> },
    { path: "order-refunds", element: <VendorOrderRefunds /> },
    { path: "flash-sales", element: <VendorFlashSales /> },
    { path: "campaigns", element: <VendorCampaigns /> },
    { path: "coupons", element: <VendorCoupons /> },
    { path: "banners", element: <VendorBanners /> },
    { path: "notifications", element: <VendorPushNotifications /> },
    { path: "categories", element: <VendorCategories /> },
    { path: "attributes", element: <VendorAttributes /> },
    { path: "products", element: <VendorProducts /> },
    
    { path: "add-stores", element: <VendorAddStores /> },
    { path: "stores-list", element: <VendorStoresList /> },
    { path: "shop", element: <VendorMyShop /> },
    { path: "reviews", element: <VendorReviews /> },
    { path: "chat", element: <VendorChat /> },

       { path: "customer-list", element: <VendorCustomerList /> },
  ],
};

const API_BASE_URL = 'http://localhost:4000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ==================== PRODUCTS ====================
export const getProduct = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/product`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error fetching products:', errorData.message || response.statusText);
      return [];
    }
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Network error:', error);
    return [];
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(productData),
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/product/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(productData),
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/product/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ==================== ORDERS ====================
export const getOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/order`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch orders');
    }
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    return [];
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/order/${id}`, {
      headers: getAuthHeader()
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(orderData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/order/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status })
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteOrder = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/order/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ==================== VENDORS ====================
export const getVendors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendor`, {
      headers: getAuthHeader()
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

// ==================== CUSTOMERS ====================
export const getCustomers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      headers: getAuthHeader()
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const createCustomer = async (customerData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(customerData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateCustomer = async (id, customerData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(customerData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, { 
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ==================== BANNERS ====================
export const getBanners = async () => {
  try {
    const headers = getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/banners`, { headers }); 

    if (response.status === 401) {
      console.error('Unauthorized - Token invalid or expired');
      localStorage.clear();
      window.location.href = '/login';
      return [];
    }

    if (!response.ok) {
      console.error('API Error:', response.status);
      return [];
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Network error:', error);
    return [];
  }
};

export const createBanner = async (bannerData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/banners`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(bannerData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateBanner = async (id, bannerData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/banners/${id}`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(bannerData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteBanner = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/banners/${id}`, { 
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ==================== COUPONS ====================
export const getCoupons = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons`, {
      headers: getAuthHeader()
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const createCoupon = async (couponData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(couponData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateCoupon = async (id, couponData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons/${id}`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(couponData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteCoupon = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons/${id}`, { 
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ==================== REFUNDS ====================
export const getRefunds = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/refunds`, {
      headers: getAuthHeader()
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const createRefund = async (refundData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/refunds`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(refundData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const approveRefund = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/refunds/${id}/approve`, { 
      method: 'PUT',
      headers: getAuthHeader()
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const rejectRefund = async (id, reason = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/refunds/${id}/reject`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ reason })
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteRefund = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/refunds/${id}`, { 
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ==================== CATEGORIES ====================
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const getCategoriesById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      headers: getAuthHeader()
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const createCategories = async (categoriesData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(categoriesData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateCategories = async (id, categoriesData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(categoriesData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteCategories = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ==================== ATTRIBUTES ====================
export const getAttributes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/attributes`, { 
      headers: getAuthHeader()
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const getAttributeById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/attributes/${id}`, { 
      headers: getAuthHeader()
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const createAttribute = async (attributeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/attributes`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(attributeData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateAttribute = async (id, attributeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/attributes/${id}`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(attributeData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteAttribute = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/attributes/${id}`, { 
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ==================== STORES ====================
export const getStores = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stores`, { 
      headers: getAuthHeader()
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const getStoreById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stores/${id}`, { 
      headers: getAuthHeader()
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const createStore = async (storeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stores`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(storeData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateStore = async (id, storeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stores/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(storeData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteStore = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stores/${id}`, { 
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ==================== FLASHSALES ====================
export const getFlashsales = async () => {
  try {
     const response = await fetch(`${API_BASE_URL}/flashsales`, { headers: getAuthHeader() });
    if (!response.ok) throw new Error('Fetch failed');
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const getFlashsaleById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/flashsales/${id}`, { 
      headers: getAuthHeader()
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const createFlashsale = async (flashsaleData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/flashsales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(flashsaleData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateFlashsale = async (id, flashsaleData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/flashsales/${id}`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(flashsaleData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteFlashsale = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/flashsales/${id}`, { 
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ==================== DASHBOARD ====================
export const getDashboard = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      headers: getAuthHeader()
    });
    if (!response.ok) return {};
    const data = await response.json();
    return data.success ? data.data : data || {};
  } catch (error) {
    console.error('Error:', error);
    return {};
  }
};

// ==================== VENDOR SECTION ====================
export const getVendorProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/vendor/profile`, {
    headers: getAuthHeader(),
  });
  return await response.json();
};

export const updateVendorProfile = async (vendorData) => {
  const response = await fetch(`${API_BASE_URL}/vendor/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(vendorData),
  });
  return await response.json();
};

export const getVendorOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/vendor/orders`, {
    headers: getAuthHeader(),
  });
  return await response.json();
};

export const getVendorProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/vendor/products`, {
    headers: getAuthHeader(),
  });
  return await response.json();
};

export const getVendorBanners = async () => {
  const response = await fetch(`${API_BASE_URL}/vendor/banners`, {
    headers: getAuthHeader(),
  });
  return await response.json();
};


// ==================== PUSH NOTIFICATIONS ====================
export const getPushNotifications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/pushNotifications`, {
      headers: getAuthHeader()
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const createPushNotification = async (notificationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pushNotifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(notificationData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updatePushNotification = async (id, notificationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pushNotifications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(notificationData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deletePushNotification = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pushNotifications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ==================== VENDOR FLASHSALES ====================
export const getVendorFlashsale = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendor/flashsales`, {
      headers: getAuthHeader()
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const createVendorFlashsale = async (flashsaleData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendor/flashsales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(flashsaleData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateVendorFlashsale = async (id, flashsaleData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendor/flashsales/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(flashsaleData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteVendorFlashsale = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendor/flashsales/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};


// ==================== VENDOR STORES ====================

export const getVendorStores = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendor/stores`, {
      headers: getAuthHeader()
    });
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }
      return [];
    }
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching vendor stores:', error);
    return [];
  }
};

export const createVendorStore = async (storeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendor/stores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(storeData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateVendorStore = async (id, storeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendor/stores/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(storeData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteVendorStore = async (id) => {
  const response = await fetch(`${API_BASE_URL}/vendor/stores/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });

  return await response.json();
};


export const getCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: getAuthHeader()
    });
    if (!response.ok) return { items: [] };
    const data = await response.json();
    return data.success ? data.data : { items: [] };
  } catch (error) {
    console.error('Error:', error);
    return { items: [] };
  }
};

export const addToCart = async (itemData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(itemData)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/item`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ itemId, quantity })
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const removeFromCart = async (itemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/item/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};



import CONFIG from '../config/api';

const api = {
  async getAppData() {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.GET_APP_DATA}`);
      if (!response.ok) throw new Error('Failed to fetch app data');
      const data = await response.json();
      return data.value || data;
    } catch (error) {
      console.error('Error fetching app data:', error);
      throw error;
    }
  },

  async getProducts() {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.GET_PRODUCTS}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      // API returns { value: [...], Count: number }
      return data.value || data.products || data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getCategories() {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.GET_CATEGORIES}`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      // API returns { value: [...], Count: number }
      return data.value || data.categories || data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async createOrder(orderData) {
    const orderId = new Date().getTime();
    
    // Build payload matching the API's expected format
    const payload = {
      order_id: orderId,
      user_id: orderData.customerInfo?.email || orderData.userId,
      products: (orderData.items || []).map(item => ({
        prod_id: item.Product_Id || item.id || item.product_id,
        prod_price: item.Product_Price || item.price || item.product_price,
      })),
    };

    // If user is not authenticated, include user details in payload
    if (!orderData.isAuthenticated) {
      payload.user_name = orderData.customerInfo?.name;
      payload.user_email = orderData.customerInfo?.email;
    }

    console.log('[createOrder] Payload:', payload);

    const order = {
      ...orderData,
      Order_Id: String(orderId),
      Order_Date: new Date().toISOString(),
      Order_Status: 'Confirmed',
    };

    try {
      await fetch(`${CONFIG.BASE_URL}${CONFIG.CREATE_ORDER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'no-cors',
        redirect: 'follow',
      });
      
      // mode: 'no-cors' returns opaque response, so we can't read it
      // Save order locally and treat as success
      this._saveOrderLocally(order);
      
      return { success: true, orderId: String(orderId), order };
    } catch (error) {
      console.error('Error creating order (using local fallback):', error);
      
      // Save order locally for demo purposes
      this._saveOrderLocally(order);
      
      return { success: true, orderId: String(orderId), order };
    }
  },

  _saveOrderLocally(order) {
    const orders = JSON.parse(localStorage.getItem('telecom_orders') || '[]');
    orders.push(order);
    localStorage.setItem('telecom_orders', JSON.stringify(orders));
  },

  async getUserOrders(userId) {
    let apiOrders = [];
    
    try {
      const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.GET_USER_ORDER}${encodeURIComponent(userId)}`);
      if (response.ok) {
        const data = await response.json();
        apiOrders = data.value || data.orders || data || [];
      }
    } catch (error) {
      console.error('Error fetching user orders from API:', error);
    }
    
    // Also get locally stored orders
    const localOrders = JSON.parse(localStorage.getItem('telecom_orders') || '[]')
      .filter(order => order.userId === userId || order.User_Id === userId);
    
    // Combine and return all orders
    return [...apiOrders, ...localOrders];
  },

  async getUserOffers(userId) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.GET_USER_OFFERS}${encodeURIComponent(userId)}`);
      if (!response.ok) throw new Error('Failed to fetch user offers');
      const data = await response.json();
      // API returns { value: [...], Count: number }
      return data.value || data.offers || data || [];
    } catch (error) {
      console.error('Error fetching user offers:', error);
      return [];
    }
  },

  async validateUser(credentials) {
    try {
      // Build URL with query string parameters (GET request to avoid CORS preflight)
      const params = new URLSearchParams({
        email: credentials.email,
        password: credentials.password
      });
      const url = `${CONFIG.BASE_URL}${CONFIG.VALIDATE_USER}?${params.toString()}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Check if API returned valid response
      // API returns: {status: 200, user_name: "...", user_id: "..."}
      if (data.value || data.user || data.success || data.valid || data.status === 200 || data.user_id) {
        const user = data.value?.[0] || data.user || data;
        return {
          success: true,
          user: {
            id: user.User_Id || user.user_id || user.id || credentials.email,
            name: user.User_Name || user.user_name || user.name || credentials.email.split('@')[0],
            email: user.User_Email || user.user_email || user.email || credentials.email,
            phone: user.User_Phone || user.user_phone || user.phone || '',
          }
        };
      }
      
      // If API validation fails, check local storage for registered users
      const registeredUsers = JSON.parse(localStorage.getItem('telecom_registered_users') || '[]');
      const localUser = registeredUsers.find(u => 
        u.email === credentials.email && u.password === credentials.password
      );
      
      if (localUser) {
        return {
          success: true,
          user: {
            id: localUser.id,
            name: localUser.name,
            email: localUser.email,
            phone: localUser.phone,
          }
        };
      }
      
      return { success: false, message: 'Invalid email or password' };
    } catch (error) {
      console.error('Error validating user:', error);
      
      // Fallback to local storage check
      const registeredUsers = JSON.parse(localStorage.getItem('telecom_registered_users') || '[]');
      const localUser = registeredUsers.find(u => 
        u.email === credentials.email && u.password === credentials.password
      );
      
      if (localUser) {
        return {
          success: true,
          user: {
            id: localUser.id,
            name: localUser.name,
            email: localUser.email,
            phone: localUser.phone,
          }
        };
      }
      
      return { success: false, message: 'Invalid email or password' };
    }
  },

  async registerUser(userData) {
    try {
      // Try the API first — payload matches API's expected format
      const raw = JSON.stringify({
        email: userData.email,
        password: userData.password,
        user_name: userData.name,
      });

      const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.REGISTER_USER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: raw,
        redirect: 'follow',
      });
      
      const data = await response.json();
      
      // Check if API registration was successful (status 200)
      if (data.status === 200 || data.success || data.user || data.User_Id) {
        const user = data.user || data;
        return {
          success: true,
          user: {
            id: user.User_Id || user.user_id || user.id || `user_${Date.now()}`,
            name: user.User_Name || user.user_name || user.name || userData.name,
            email: user.User_Email || user.user_email || user.email || userData.email,
            phone: user.User_Phone || user.user_phone || user.phone || userData.phone,
          }
        };
      }
      
      // Status 301 = server exception
      if (data.status === 301) {
        return { success: false, message: CONFIG.exceptionError };
      }
      
      // Other status = email already exists
      return { success: false, message: 'Email already registered. Please use a different email.' };
      
    } catch (error) {
      console.error('Error registering user (API):', error);
      
      // Fallback to local storage for demo purposes
      const registeredUsers = JSON.parse(localStorage.getItem('telecom_registered_users') || '[]');
      
      // Check if email already exists
      if (registeredUsers.some(u => u.email === userData.email)) {
        return { success: false, message: 'Email already registered' };
      }
      
      const newUser = {
        id: `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
      };
      
      registeredUsers.push(newUser);
      localStorage.setItem('telecom_registered_users', JSON.stringify(registeredUsers));
      
      return {
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
        }
      };
    }
  },

  async search(term) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.SEARCH}${encodeURIComponent(term)}`);
      if (!response.ok) throw new Error('Failed to search');
      const data = await response.json();
      // API returns { value: [...], Count: number }
      return data.value || data.products || data || [];
    } catch (error) {
      console.error('Error searching:', error);
      return [];
    }
  },
};

export default api;

/**
 * Tealium Data Layer Utility
 * Handles utag_data object and tracking events
 */

// Initialize the data layer
window.utag_data = window.utag_data || {};

/**
 * Base data layer variables (present on every page)
 */
const getBaseData = () => ({
  site_name: 'NexTel',
  site_region: 'US',
  site_currency: 'USD',
  site_environment: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
  page_url: window.location.href,
  page_path: window.location.pathname,
  page_referrer: document.referrer || '',
  page_title: document.title,
  timestamp: new Date().toISOString(),
});

/**
 * Get user data from localStorage/auth state
 */
const getUserData = (user = null) => {
  const isLoggedIn = !!user;
  return {
    user_logged_in: isLoggedIn ? 'true' : 'false',
    user_id: user?.id || '',
    user_email: user?.email || '',
    user_name: user?.name || '',
    user_type: isLoggedIn ? 'registered' : 'guest',
  };
};

/**
 * Format product data for data layer
 */
const formatProduct = (product, index = 0) => ({
  product_id: product.Product_Id || product.id || '',
  product_name: product.Product_Name || product.name || '',
  product_price: String(product.Product_Price || product.price || '0'),
  product_category: product.Category_Name || product.category || '',
  product_category_id: product.Category_Id || product.category_id || '',
  product_image: product.Product_Thumbnail_Image || product.image || '',
  product_position: String(index + 1),
  product_label: product.Product_Label || '',
});

/**
 * Format cart items for data layer
 */
const formatCartItems = (cartItems = []) => {
  const products = cartItems.map((item, index) => formatProduct(item, index));
  
  return {
    cart_product_id: products.map(p => p.product_id),
    cart_product_name: products.map(p => p.product_name),
    cart_product_price: products.map(p => p.product_price),
    cart_product_quantity: cartItems.map(item => String(item.quantity || 1)),
    cart_product_category: products.map(p => p.product_category),
    cart_total_items: String(cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)),
    cart_total_value: String(cartItems.reduce((sum, item) => {
      const price = parseFloat(item.Product_Price || item.price || 0);
      const qty = item.quantity || 1;
      return sum + (price * qty);
    }, 0).toFixed(2)),
  };
};

/**
 * Data Layer Manager
 */
const DataLayer = {
  /**
   * Set the data layer and trigger a page view
   * @param {Object} pageData - Page specific data
   * @param {Object} user - Current user object
   */
  setPageView(pageData, user = null) {
    const data = {
      ...getBaseData(),
      ...getUserData(user),
      tealium_event: 'page_view',
      ...pageData,
    };

    // Update global utag_data
    window.utag_data = data;

    // Log for debugging (remove in production)
    console.log('[DataLayer] Page View:', data);

    // Trigger Tealium view event if utag is loaded
    if (window.utag && typeof window.utag.view === 'function') {
      window.utag.view(data);
    }

    return data;
  },

  /**
   * Track a link/interaction event
   * @param {Object} eventData - Event specific data
   * @param {Object} user - Current user object
   */
  trackEvent(eventData, user = null) {
    const data = {
      ...getBaseData(),
      ...getUserData(user),
      ...eventData,
    };

    // Log for debugging (remove in production)
    console.log('[DataLayer] Link Event:', data);

    // Trigger Tealium link event if utag is loaded
    if (window.utag && typeof window.utag.link === 'function') {
      window.utag.link(data);
    }

    return data;
  },

  // ============================================
  // PAGE VIEW EVENTS
  // ============================================

  /**
   * Home page view
   */
  viewHomePage(user = null) {
    return this.setPageView({
      page_name: 'home',
      page_type: 'home',
      page_category: 'home',
      site_section: 'home',
    }, user);
  },

  /**
   * Product listing page view
   */
  viewProductsPage(params = {}, user = null) {
    return this.setPageView({
      page_name: 'products',
      page_type: 'product_listing',
      page_category: 'products',
      site_section: 'shop',
      search_term: params.search || '',
      filter_category: params.category || '',
      sort_by: params.sort || 'featured',
      results_count: String(params.resultsCount || 0),
    }, user);
  },

  /**
   * Product detail page view
   */
  viewProductDetail(product, user = null) {
    const productData = formatProduct(product);
    return this.setPageView({
      page_name: `product:${productData.product_name}`,
      page_type: 'product_detail',
      page_category: 'product',
      site_section: 'shop',
      ...productData,
    }, user);
  },

  /**
   * Category page view
   */
  viewCategoryPage(category, productsCount = 0, user = null) {
    return this.setPageView({
      page_name: `category:${category}`,
      page_type: 'category',
      page_category: category,
      site_section: 'shop',
      category_name: category,
      results_count: String(productsCount),
    }, user);
  },

  /**
   * Cart page view
   */
  viewCartPage(cartItems = [], user = null) {
    const cartData = formatCartItems(cartItems);
    return this.setPageView({
      page_name: 'cart',
      page_type: 'cart',
      page_category: 'checkout',
      site_section: 'checkout',
      ...cartData,
    }, user);
  },

  /**
   * Checkout page view
   */
  viewCheckoutPage(cartItems = [], step = 1, user = null) {
    const cartData = formatCartItems(cartItems);
    return this.setPageView({
      page_name: `checkout:step${step}`,
      page_type: 'checkout',
      page_category: 'checkout',
      site_section: 'checkout',
      checkout_step: String(step),
      ...cartData,
    }, user);
  },

  /**
   * Order confirmation page view
   */
  viewOrderConfirmation(order, user = null) {
    return this.setPageView({
      page_name: 'order_confirmation',
      page_type: 'purchase',
      page_category: 'checkout',
      site_section: 'checkout',
      order_id: order.Order_Id || order.orderId || '',
      order_total: String(order.total || '0'),
      order_status: order.Order_Status || 'confirmed',
    }, user);
  },

  /**
   * Login page view
   */
  viewLoginPage() {
    return this.setPageView({
      page_name: 'login',
      page_type: 'login',
      page_category: 'account',
      site_section: 'account',
    });
  },

  /**
   * Register page view
   */
  viewRegisterPage() {
    return this.setPageView({
      page_name: 'register',
      page_type: 'registration',
      page_category: 'account',
      site_section: 'account',
    });
  },

  /**
   * Dashboard page view
   */
  viewDashboardPage(tab = 'overview', user = null) {
    return this.setPageView({
      page_name: `dashboard:${tab}`,
      page_type: 'account_dashboard',
      page_category: 'account',
      site_section: 'account',
      dashboard_tab: tab,
    }, user);
  },

  /**
   * Plans page view
   */
  viewPlansPage(user = null) {
    return this.setPageView({
      page_name: 'plans',
      page_type: 'plans_listing',
      page_category: 'plans',
      site_section: 'plans',
    }, user);
  },

  /**
   * Search results page view
   */
  viewSearchResults(term, resultsCount = 0, user = null) {
    return this.setPageView({
      page_name: 'search_results',
      page_type: 'search',
      page_category: 'search',
      site_section: 'search',
      search_term: term,
      search_results_count: String(resultsCount),
    }, user);
  },

  // ============================================
  // LINK/INTERACTION EVENTS
  // ============================================

  /**
   * Add to cart event
   */
  trackAddToCart(product, quantity = 1, user = null) {
    const productData = formatProduct(product);
    return this.trackEvent({
      tealium_event: 'cart_add',
      event_category: 'ecommerce',
      event_action: 'add_to_cart',
      event_label: productData.product_name,
      ...productData,
      product_quantity: String(quantity),
    }, user);
  },

  /**
   * Remove from cart event
   */
  trackRemoveFromCart(product, quantity = 1, user = null) {
    const productData = formatProduct(product);
    return this.trackEvent({
      tealium_event: 'cart_remove',
      event_category: 'ecommerce',
      event_action: 'remove_from_cart',
      event_label: productData.product_name,
      ...productData,
      product_quantity: String(quantity),
    }, user);
  },

  /**
   * Update cart quantity event
   */
  trackUpdateCartQuantity(product, newQuantity, user = null) {
    const productData = formatProduct(product);
    return this.trackEvent({
      tealium_event: 'cart_update',
      event_category: 'ecommerce',
      event_action: 'update_cart_quantity',
      event_label: productData.product_name,
      ...productData,
      product_quantity: String(newQuantity),
    }, user);
  },

  /**
   * Product click event (from listing)
   */
  trackProductClick(product, listName = 'product_listing', user = null) {
    const productData = formatProduct(product);
    return this.trackEvent({
      tealium_event: 'product_click',
      event_category: 'ecommerce',
      event_action: 'product_click',
      event_label: productData.product_name,
      ...productData,
      product_list: listName,
    }, user);
  },

  /**
   * Product impression event
   */
  trackProductImpressions(products, listName = 'product_listing', user = null) {
    const productIds = products.map(p => p.Product_Id || p.id || '');
    const productNames = products.map(p => p.Product_Name || p.name || '');
    const productPrices = products.map(p => String(p.Product_Price || p.price || '0'));
    
    return this.trackEvent({
      tealium_event: 'product_impression',
      event_category: 'ecommerce',
      event_action: 'product_impression',
      product_list: listName,
      impression_product_id: productIds,
      impression_product_name: productNames,
      impression_product_price: productPrices,
      impression_count: String(products.length),
    }, user);
  },

  /**
   * Begin checkout event
   */
  trackBeginCheckout(cartItems = [], user = null) {
    const cartData = formatCartItems(cartItems);
    return this.trackEvent({
      tealium_event: 'checkout_start',
      event_category: 'ecommerce',
      event_action: 'begin_checkout',
      ...cartData,
    }, user);
  },

  /**
   * Checkout step event
   */
  trackCheckoutStep(step, stepName, cartItems = [], user = null) {
    const cartData = formatCartItems(cartItems);
    return this.trackEvent({
      tealium_event: 'checkout_step',
      event_category: 'ecommerce',
      event_action: `checkout_step_${step}`,
      event_label: stepName,
      checkout_step: String(step),
      checkout_step_name: stepName,
      ...cartData,
    }, user);
  },

  /**
   * Purchase complete event
   */
  trackPurchase(order, cartItems = [], user = null) {
    const cartData = formatCartItems(cartItems);
    return this.trackEvent({
      tealium_event: 'purchase',
      event_category: 'ecommerce',
      event_action: 'purchase',
      order_id: order.Order_Id || order.orderId || '',
      order_total: String(order.total || cartData.cart_total_value),
      order_status: order.Order_Status || 'confirmed',
      ...cartData,
    }, user);
  },

  /**
   * Login success event
   */
  trackLoginSuccess(user, method = 'email') {
    return this.trackEvent({
      tealium_event: 'login',
      event_category: 'account',
      event_action: 'login_success',
      event_label: method,
      login_method: method,
    }, user);
  },

  /**
   * Login failure event
   */
  trackLoginFailure(reason = 'invalid_credentials') {
    return this.trackEvent({
      tealium_event: 'login_error',
      event_category: 'account',
      event_action: 'login_failure',
      event_label: reason,
      error_message: reason,
    });
  },

  /**
   * Registration success event
   */
  trackRegistrationSuccess(user, method = 'email') {
    return this.trackEvent({
      tealium_event: 'registration',
      event_category: 'account',
      event_action: 'registration_success',
      event_label: method,
      registration_method: method,
    }, user);
  },

  /**
   * Registration failure event
   */
  trackRegistrationFailure(reason = 'validation_error') {
    return this.trackEvent({
      tealium_event: 'registration_error',
      event_category: 'account',
      event_action: 'registration_failure',
      event_label: reason,
      error_message: reason,
    });
  },

  /**
   * Logout event
   */
  trackLogout(user) {
    return this.trackEvent({
      tealium_event: 'logout',
      event_category: 'account',
      event_action: 'logout',
    }, user);
  },

  /**
   * Search event
   */
  trackSearch(term, resultsCount = 0, user = null) {
    return this.trackEvent({
      tealium_event: 'search',
      event_category: 'search',
      event_action: 'search',
      event_label: term,
      search_term: term,
      search_results_count: String(resultsCount),
    }, user);
  },

  /**
   * Filter applied event
   */
  trackFilterApplied(filterType, filterValue, user = null) {
    return this.trackEvent({
      tealium_event: 'filter',
      event_category: 'engagement',
      event_action: 'filter_applied',
      event_label: `${filterType}:${filterValue}`,
      filter_type: filterType,
      filter_value: filterValue,
    }, user);
  },

  /**
   * Sort applied event
   */
  trackSortApplied(sortValue, user = null) {
    return this.trackEvent({
      tealium_event: 'sort',
      event_category: 'engagement',
      event_action: 'sort_applied',
      event_label: sortValue,
      sort_value: sortValue,
    }, user);
  },

  /**
   * CTA click event
   */
  trackCtaClick(ctaName, ctaLocation, destinationUrl = '', user = null) {
    return this.trackEvent({
      tealium_event: 'cta_click',
      event_category: 'engagement',
      event_action: 'cta_click',
      event_label: ctaName,
      cta_name: ctaName,
      cta_location: ctaLocation,
      cta_destination: destinationUrl,
    }, user);
  },

  /**
   * Navigation click event
   */
  trackNavClick(navItem, navLocation = 'header', user = null) {
    return this.trackEvent({
      tealium_event: 'navigation',
      event_category: 'navigation',
      event_action: 'nav_click',
      event_label: navItem,
      nav_item: navItem,
      nav_location: navLocation,
    }, user);
  },

  /**
   * Error event
   */
  trackError(errorType, errorMessage, errorLocation = '', user = null) {
    return this.trackEvent({
      tealium_event: 'error',
      event_category: 'error',
      event_action: errorType,
      event_label: errorMessage,
      error_type: errorType,
      error_message: errorMessage,
      error_location: errorLocation,
    }, user);
  },

  /**
   * Plan selection event
   */
  trackPlanSelected(plan, user = null) {
    return this.trackEvent({
      tealium_event: 'plan_select',
      event_category: 'plans',
      event_action: 'plan_selected',
      event_label: plan.name || plan.Plan_Name || '',
      plan_name: plan.name || plan.Plan_Name || '',
      plan_price: String(plan.price || plan.Plan_Price || '0'),
      plan_type: plan.type || plan.Plan_Type || '',
    }, user);
  },
};

export default DataLayer;


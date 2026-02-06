import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DataLayer from '../utils/dataLayer';

/**
 * Custom hook for Tealium data layer integration
 * Automatically tracks page views and provides event tracking methods
 */
const useDataLayer = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Get current user for tracking
  const getCurrentUser = useCallback(() => user, [user]);

  // Page view tracking methods
  const trackPageView = useCallback((pageData) => {
    DataLayer.setPageView(pageData, user);
  }, [user]);

  const trackHomePage = useCallback(() => {
    DataLayer.viewHomePage(user);
  }, [user]);

  const trackProductsPage = useCallback((params = {}) => {
    DataLayer.viewProductsPage(params, user);
  }, [user]);

  const trackProductDetail = useCallback((product) => {
    DataLayer.viewProductDetail(product, user);
  }, [user]);

  const trackCategoryPage = useCallback((category, productsCount) => {
    DataLayer.viewCategoryPage(category, productsCount, user);
  }, [user]);

  const trackCartPage = useCallback((cartItems) => {
    DataLayer.viewCartPage(cartItems, user);
  }, [user]);

  const trackCheckoutPage = useCallback((cartItems, step) => {
    DataLayer.viewCheckoutPage(cartItems, step, user);
  }, [user]);

  const trackOrderConfirmation = useCallback((order) => {
    DataLayer.viewOrderConfirmation(order, user);
  }, [user]);

  const trackLoginPage = useCallback(() => {
    DataLayer.viewLoginPage();
  }, []);

  const trackRegisterPage = useCallback(() => {
    DataLayer.viewRegisterPage();
  }, []);

  const trackDashboardPage = useCallback((tab) => {
    DataLayer.viewDashboardPage(tab, user);
  }, [user]);

  const trackPlansPage = useCallback(() => {
    DataLayer.viewPlansPage(user);
  }, [user]);

  const trackSearchResults = useCallback((term, resultsCount) => {
    DataLayer.viewSearchResults(term, resultsCount, user);
  }, [user]);

  // Event tracking methods
  const trackAddToCart = useCallback((product, quantity = 1) => {
    DataLayer.trackAddToCart(product, quantity, user);
  }, [user]);

  const trackRemoveFromCart = useCallback((product, quantity = 1) => {
    DataLayer.trackRemoveFromCart(product, quantity, user);
  }, [user]);

  const trackUpdateCartQuantity = useCallback((product, newQuantity) => {
    DataLayer.trackUpdateCartQuantity(product, newQuantity, user);
  }, [user]);

  const trackProductClick = useCallback((product, listName) => {
    DataLayer.trackProductClick(product, listName, user);
  }, [user]);

  const trackProductImpressions = useCallback((products, listName) => {
    DataLayer.trackProductImpressions(products, listName, user);
  }, [user]);

  const trackBeginCheckout = useCallback((cartItems) => {
    DataLayer.trackBeginCheckout(cartItems, user);
  }, [user]);

  const trackCheckoutStep = useCallback((step, stepName, cartItems) => {
    DataLayer.trackCheckoutStep(step, stepName, cartItems, user);
  }, [user]);

  const trackPurchase = useCallback((order, cartItems) => {
    DataLayer.trackPurchase(order, cartItems, user);
  }, [user]);

  const trackLoginSuccess = useCallback((loggedInUser, method = 'email') => {
    DataLayer.trackLoginSuccess(loggedInUser, method);
  }, []);

  const trackLoginFailure = useCallback((reason) => {
    DataLayer.trackLoginFailure(reason);
  }, []);

  const trackRegistrationSuccess = useCallback((registeredUser, method = 'email') => {
    DataLayer.trackRegistrationSuccess(registeredUser, method);
  }, []);

  const trackRegistrationFailure = useCallback((reason) => {
    DataLayer.trackRegistrationFailure(reason);
  }, []);

  const trackLogout = useCallback(() => {
    DataLayer.trackLogout(user);
  }, [user]);

  const trackSearch = useCallback((term, resultsCount) => {
    DataLayer.trackSearch(term, resultsCount, user);
  }, [user]);

  const trackFilterApplied = useCallback((filterType, filterValue) => {
    DataLayer.trackFilterApplied(filterType, filterValue, user);
  }, [user]);

  const trackSortApplied = useCallback((sortValue) => {
    DataLayer.trackSortApplied(sortValue, user);
  }, [user]);

  const trackCtaClick = useCallback((ctaName, ctaLocation, destinationUrl) => {
    DataLayer.trackCtaClick(ctaName, ctaLocation, destinationUrl, user);
  }, [user]);

  const trackNavClick = useCallback((navItem, navLocation) => {
    DataLayer.trackNavClick(navItem, navLocation, user);
  }, [user]);

  const trackError = useCallback((errorType, errorMessage, errorLocation) => {
    DataLayer.trackError(errorType, errorMessage, errorLocation, user);
  }, [user]);

  const trackPlanSelected = useCallback((plan) => {
    DataLayer.trackPlanSelected(plan, user);
  }, [user]);

  // Generic event tracker
  const trackEvent = useCallback((eventData) => {
    DataLayer.trackEvent(eventData, user);
  }, [user]);

  return {
    // Current state
    location,
    user: getCurrentUser(),
    
    // Page view methods
    trackPageView,
    trackHomePage,
    trackProductsPage,
    trackProductDetail,
    trackCategoryPage,
    trackCartPage,
    trackCheckoutPage,
    trackOrderConfirmation,
    trackLoginPage,
    trackRegisterPage,
    trackDashboardPage,
    trackPlansPage,
    trackSearchResults,
    
    // Event tracking methods
    trackAddToCart,
    trackRemoveFromCart,
    trackUpdateCartQuantity,
    trackProductClick,
    trackProductImpressions,
    trackBeginCheckout,
    trackCheckoutStep,
    trackPurchase,
    trackLoginSuccess,
    trackLoginFailure,
    trackRegistrationSuccess,
    trackRegistrationFailure,
    trackLogout,
    trackSearch,
    trackFilterApplied,
    trackSortApplied,
    trackCtaClick,
    trackNavClick,
    trackError,
    trackPlanSelected,
    trackEvent,
  };
};

export default useDataLayer;


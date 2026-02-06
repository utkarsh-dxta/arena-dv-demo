const CONFIG = {
  BASE_URL: "https://arena-telecom-apis.netlify.app/.netlify/functions",
  GET_APP_DATA: "/getAppData",
  GET_PRODUCTS: "/getProducts",
  GET_CATEGORIES: "/getCategories",
  CREATE_ORDER: "/createOrder",
  GET_USER_ORDER: "/getUserOrders?userid=",
  GET_USER_OFFERS: "/getUserOffers?userid=",
  VALIDATE_USER: "/validateUser",
  REGISTER_USER: "/insertUser",
  appDataFallback: true,
  offerDataFallback: true,
  exceptionError: "Error, please try again later.",
  SEARCH: "/getSearchResults?term="
};

export default CONFIG;


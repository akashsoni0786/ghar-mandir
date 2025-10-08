interface FetchCalls {
  POST: {
    [key: string]: string;
  };
  GET: {
    [key: string]: string;
  };
  SHARE_LINKS: {
    [key: string]: string;
  };
}

export const urlFetchCalls: FetchCalls = {
  POST: {
    pooja_city: "order/city",
    order_checkout: "order/checkout",
    users_login: "users/login",
    events_eventsLogs: "events/eventsLogs",
    categoryPage_details: "categoryPage/details",
    categoryPage_getBanners: "categoryPage/getBanners",
    order_addToCart: "order/addToCart",
    order_getUserCart: "order/getUserCart",
    order_placeOrder: "order/placeOrder",
    order_removeFromCart: "order/removeFromCart",
    order_editCartItem: "order/editCartItem",
    users_updateProfile: "users/updateProfile",
    image_upload: "image/upload",
    users_generateKundli: "users/generateKundli",
    users_verifyOtp: "users/verifyOtp",
    contact_contactUs: "contact/contactUs",
    bookings_getBookingsById: "bookings/getBookingsById",
    bookings_updateMembers: "bookings/updateMembers",
    chadhaava_crossSell: "chadhaava/crossSell",
    meta_metaPixel: "meta/metaPixel",
    userIpDetails: "userIpDetails",
    update_ppOrderID: "update/ppOrderID",
    order_addMultipleToCart: "order/addMultipleToCart",
    order_cartCheckout: "order/cartCheckout",
    subscription_getUserSubscription: "/subscription/getUserSubscription",
    subscription_startSubscription: "subscription/startSubscription",
    subscription_subscriptionPayment: "subscription/subscriptionPayment",
    bookings_updateUserFeedback: "bookings/updateUserFeedback",
    leads_addLead: "leads/addLead",
    orders_videoSeen:"orders/videoSeen"
  },
  GET: {
    getPoojaById: "pooja/getPoojaById/",
    devoteeExperience: "reviews/devoteeExperience",
    order_getOrderById: "order/getOrderById/",
    chadhaava_getchadhaavaById: "chadhaava/getchadhaavaById/",
    users_getUserProfile: "users/getUserProfile",
    add_getDevineExperience: "add/getDevineExperience",
    bookins_getAllBookings: "bookings/getAllBookings",
    categoryPage_getHomepageVideo: "categoryPage/getHomepageVideo",
  },
  SHARE_LINKS: {
    privacy_policy: "https://gharmandir.in/privacy-policy/",
    instagram: "https://www.instagram.com/gharmandir.in/",
    facebook: "https://www.facebook.com/p/Ghar-Mandir-61550580561787/",
    twitter: "",
    whatsapp:
      "https://api.whatsapp.com/send/?phone=919461594942&text=Namaste&type=phone_number&app_absent=0",
    youtube: "https://www.youtube.com/@GharMandir",
  },
};

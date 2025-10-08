"use client";
import MobileFooter from "../Common/MobileFooter";
import { ChevronIconLeft, GharmandirRed_NameLogo } from "@/assets/svgs";
import { useRouter } from "next/navigation";
import { environment } from "@/environment/environment";
import PackageView from "./PackageView";
import Address from "./Address";
import { useEffect, useRef, useState } from "react";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import { urlFetchCalls } from "@/constants/url";
import {
  generateId,
  generatePurchaseEvents,
  getCurrencyName,
  getSign,
  needForMemberAndPitruNames,
  needOfNormalNames,
  needOfPitruNames,
  transformToBeginCheckoutEvent,
  transformToViewCartEvent,
  validateAll,
} from "@/constants/commonfunctions";
import { updateOrderData } from "@/store/slices/orderSlice";
import {
  packageAddress,
  resetCart,
  updateTotalAmount,
} from "@/store/slices/checkoutSlice";
import { transactionIdUpdate } from "@/store/slices/commonSlice";
import { pushToDataLayerWithoutEvent } from "@/lib/gtm";
import EmptyCartPage from "../NoDataComponents/EmptyCart";
import LoadingSpinner from "../Common/Loadings/LoadingSpinner";
import { getLocalStorage, getLocalStorageUtm } from "@/services/storage";
import {
  button_event,
  createSessionManager,
  pageview_event,
  save_event,
} from "@/constants/eventlogfunctions";
import useTrans from "@/customHooks/useTrans";
import { login } from "@/store/slices/authSlice";
import MobileFooterWithButtonComponent from "../Common/MobileFooterWithButtonComponent";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
  convertOldToNewFormat,
  transformCartData,
} from "@/constants/jscommonfunction";
import PaymentLoader from "../Common/Loadings/PaymentLoader";
import "../../styles/Checkout.css";
import CheckoutSkeleton from "@/skeletons/checkout/CheckoutSkeleton";
const {
  POST: {
    order_placeOrder,
    order_getUserCart,
    update_ppOrderID,
    order_cartCheckout,
  },
  GET: { order_getOrderById, users_getUserProfile },
} = urlFetchCalls;

const CheckoutPage = (props: DIProps) => {
  const { redux, request, dispatch, toast } = props;
  const currency = getSign();
  const currency_name = getCurrencyName();
  const t = useTrans(redux?.common?.language);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [packageData, setPackageData] = useState<any>({
    totalCartAmount: 0,
    loading: true,
    cartId: [],
    member_package_list: [],
    pitruNamesCount: 0,
  });
  const [cartArray, setCartArray] = useState<any>([]);
  const [cartData, setCartData] = useState<any>(undefined);
  const [addressData, setAddressData] = useState<any>({
    phone_no: redux?.auth?.mobile ?? "",
    username:
      redux?.auth?.username == ""
        ? redux?.checkout?.address?.members?.[0] ?? ""
        : redux?.auth?.username ?? "",
    phone_code: currency_name == "USD" ? "+1" : "+91",
    members: {},
    pitruNames: {},
    gotra: redux?.checkout?.address?.gotra ?? "",
    gotra_not_know: redux?.checkout?.address?.gotra_not_know ?? false,
    address: {
      street_address: redux?.checkout?.address?.address?.street_address ?? "",
      city: redux?.checkout?.address?.address?.city ?? "",
      state: redux?.checkout?.address?.address?.state ?? "",
      country: redux?.checkout?.address?.address?.country ?? "",
      pincode: redux?.checkout?.address?.address?.pincode ?? "",
    },
    prayer: "",
    email: "",
  });

  const [showAddress, setShowAddress] = useState(true);
  const [errors, setErrors] = useState<any>({
    phone_no: "",
    members: {},
    pitruNames: {},
    address: {
      street_address: "",
      city: "",
      state: "",
      pincode: "",
    },
    prayer: "",
    username: "",
    email: "",
  });
  const [hasMounted, setHasMounted] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");
  const [paypalLoader, setPaypalLoader] = useState(false);
  const hasRun = useRef(false);
  // PayPal config
  const initOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_SECRET_CLIENT_ID || "",
    currency: "USD",
  };

  // Common functions
  const getTransactionId = (order_id: any) => {
    if (request) {
      request
        .GET(order_getOrderById + order_id)
        .then((res: any) => {
          if (res.success) {
            if (dispatch)
              dispatch(transactionIdUpdate({ transactionId: res ?? {} }));
            const eventbtn = pageview_event("Payment Confirmed", {
              additional: res,
            });
            save_event(redux?.auth?.authToken, "Payment Confirmed", [eventbtn]);
            if (!redux?.auth?.authToken || redux?.auth?.authToken == "") {
              const login_data = JSON.parse(
                localStorage.getItem("temp_login") ?? ""
              );
              dispatch?.(login(login_data));
              const isNewUser = sessionStorage.getItem("new_user") === "true";
              pushToDataLayerWithoutEvent({
                event: isNewUser ? "user_register" : "user_login",
                user_id: login_data?.authToken,
                name: login_data.username || "",
                mobile: login_data.mobile,
                utm_source: getLocalStorageUtm("utm_source") ?? "",
                utm_medium: getLocalStorageUtm("utm_medium") ?? "",
                utm_campaign: getLocalStorageUtm("utm_campaign") ?? "",
                utm_content: getLocalStorageUtm("utm_content") ?? "",
                utm_term: getLocalStorageUtm("utm_term") ?? "",
              });
              localStorage.removeItem("temp_login");
              sessionStorage.removeItem("new_user");
            }
          }
        })
        .finally(() => {
          pushToDataLayerWithoutEvent(
            generatePurchaseEvents(
              cartArray,
              redux,
              packageData.totalCartAmount
            )
          );
          setLoading(false);
          router.push(`/payment-confirmed`);
          // setPaypalLoader(false);
        });
    }
  };

  const modifyCartData = (res) => {
    setCartArray(res?.data);
    pushToDataLayerWithoutEvent(transformToViewCartEvent(res?.data));
    // pushToDataLayerWithoutEvent({
    //   ...transformToBeginCheckoutEvent(res?.data),
    //   mobile: addressData.phone_no,
    // });

    const obj = {
      Puja: res?.data?.filter((val: any) => val.type == "PUJA"),
      Chadhava: res?.data?.filter((val: any) => val.type == "CHADHAVAA"),
    };

    const arr = ["individual", "couple", "4", "6", "6+"];
    const memberObj = { 0: 1, 1: 2, 2: 4, 3: 6, 4: 6 };
    let max_mem_count = -1;
    let max_pitru_count = -1;
    res?.data?.forEach((val: any) => {
      let found = false;
      let member = -1;
      const name_arr = (val?.package?.name ?? "")?.split(" ");
      (name_arr ?? []).forEach((n_ar) => {
        n_ar = n_ar.toLowerCase();
        if (arr.includes(n_ar) && !found) {
          found = true;
          member = arr.indexOf(n_ar);
        }
      });
      if (found) max_mem_count = Math.max(max_mem_count, memberObj[member]);
    });

    res?.data?.forEach((val: any) => {
      let found = false;
      let member = -1;
      const name_arr = (val?.package?.name ?? "")?.split(" ");
      (name_arr ?? []).forEach((n_ar) => {
        n_ar = n_ar.toLowerCase();
        if (arr.includes(n_ar) && !found && val?.pitruNameIncluded) {
          found = true;
          member = arr.indexOf(n_ar);
        }
      });
      if (found) max_pitru_count = Math.max(max_pitru_count, memberObj[member]);
    });

    const pitruChadhavaOrPuja = needOfPitruNames(obj);
    const normalRes = needOfNormalNames(obj);
    const member_count = normalRes == 2 ? max_mem_count : 0;
    const pitruCount = pitruChadhavaOrPuja == 2 ? max_pitru_count : 0;

    setPackageData({
      totalCartAmount: res?.data?.reduce(
        (acc, cur) => acc + cur.totalAmount,
        0
      ),
      loading: false,
      cartId: res?.data?.map((i: any) => i?.cartId) ?? [],
      member: member_count,
      pitruNamesCount: pitruCount,
    });

    setCartData(obj);
    setAddressData((prev) => ({
      ...prev,
      members:
        obj.Puja?.length > 0 && member_count > 1
          ? { [generateId()]: "" }
          : obj.Puja?.length == 0
          ? addressData.members
          : {},
      pitruNames:
        pitruChadhavaOrPuja == 2 && max_pitru_count > 1
          ? { [generateId()]: "" }
          : {},
    }));
  };

  const getCartData = (userId = undefined) => {
    if (
      request &&
      (userId || (redux.auth.authToken && redux.auth.authToken != ""))
    ) {
      request
        .POST(order_getUserCart, { userId: redux?.auth?.authToken ?? "" })
        .then((res: any) => {
          if (res?.data) {
            modifyCartData(res);
          } else setCartData([]);
        });
    } else {
      const res = convertOldToNewFormat(redux?.checkout?.cart_data);
      modifyCartData({ data: res });
    }
  };

  const getUserData = () => {
    if (request && redux?.auth?.authToken && redux?.auth?.authToken != "") {
      request
        .GET(users_getUserProfile + "?userId=" + redux?.auth?.authToken)
        .then((res: any) => {
          if (res?.user) {
            setAddressData({
              username:
                redux?.auth?.username == ""
                  ? redux?.checkout?.address?.members?.[0] ?? ""
                  : redux?.auth?.username ?? "",
              phone_no: redux?.auth?.mobile || "",
              email: res?.user?.email || "",
              phone_code:
                res?.user?.phone_code ??
                (currency_name == "USD" ? "+1" : "+91"),
              members: {},
              pitruNames: {},
              gotra: res?.user?.gotra ?? redux?.checkout?.address?.gotra ?? "",
              address: {
                street_address:
                  res?.user?.address?.streetAddress ??
                  redux?.checkout?.address?.address?.street_address ??
                  "",
                city:
                  res?.user?.address?.townCity ??
                  redux?.checkout?.address?.address?.city ??
                  "",
                state:
                  res?.user?.address?.stateRegion ??
                  redux?.checkout?.address?.address?.state ??
                  "",
                country: redux?.checkout?.address?.address?.country ?? "",
                pincode:
                  res?.user?.address?.postalCode ??
                  redux?.checkout?.address?.address?.pincode ??
                  "",
              },
              prayer: "",
            });
          }
        });
    }
  };
  // Payment methods
  const createOrderParams = (user_details: any) => {
    const ir_obj: any = {};
    if (localStorage)
      Object.keys(localStorage)?.forEach((key) => {
        if (key.includes("IR_")) {
          ir_obj[key] = localStorage.getItem(key);
        }
      });
    const ir_cookie_obj: any = {};
    if (document.cookie) {
      document.cookie.split(";").forEach((cookie) => {
        const [key, value] = cookie.trim().split("=");
        if (key.includes("IR_")) {
          ir_cookie_obj[key] = decodeURIComponent(value);
        }
      });
    }
    const session = createSessionManager({ inactivityTimeout: 15 * 60 * 1000 });
    return {
      ...user_details,
      ...(redux?.auth?.authToken && redux?.auth?.authToken != ""
        ? { userId: parseInt(redux?.auth?.authToken) }
        : {}),
      userName: addressData.username ?? redux?.auth?.username,
      mobileNumber: addressData.phone_no ?? redux?.auth?.mobile,
      countryCode: addressData?.phone_code,
      email: addressData?.email ?? "",
      ...(packageData?.chadhaavaId
        ? { chadhaavaId: packageData?.chadhaavaId }
        : { poojaId: packageData?.poojaId }),
      type: packageData?.chadhaavaId ? "Chadhava" : "Puja",
      utm: {
        utm_source: getLocalStorage("utm_source") ?? "",
        utm_medium: getLocalStorage("utm_medium") ?? "",
        utm_campaign: getLocalStorage("utm_campaign") ?? "",
        utm_content: getLocalStorage("utm_content") ?? "",
        utm_term: getLocalStorage("utm_term") ?? "",
        ...ir_obj,
        ...ir_cookie_obj,
      },
      currenturl: window.location.href,
      sessionId: session.getSessionId(),
      paymentMode: currency_name == "USD" ? "paypal" : "razorpay",
    };
  };
  // PayPal specific functions
  const createPaypalOrder = async (
    data: any,
    actions: any
  ): Promise<string> => {
    try {
      // Prepare and validate data
      const isLogedin = redux?.auth?.authToken && redux?.auth?.authToken != "";
      const formData = structuredClone(addressData);
      const members = Object.values(formData?.members || {});
      const pitruNames = Object.values(formData?.pitruNames || {});
      const userData = { ...formData, members, pitruNames };
      const cartData = structuredClone(packageData);
      delete cartData.loading;

      // Validate payment amount
      const amount = parseFloat(packageData.totalCartAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Invalid payment amount");
      }
      const amountString = amount.toFixed(2);

      // Prepare user details
      const user_details = {
        ...(isLogedin
          ? cartData
          : { cart: transformCartData(redux.checkout.cart_data) }),
        address: userData.address,
        members: userData.members,
        pitruNames: userData.pitruNames,
        gotra: userData.gotra,
        gotra_not_know: userData.gotra_not_know,
      };

      // Update Redux store
      dispatch?.(packageAddress({ address: user_details }));

      // Prepare order parameters
      const param = createOrderParams(user_details);

      // Track analytics event for authenticated users
      if (isLogedin) {
        const eventbtn = button_event(
          "Pay Now",
          "Checkout : added to cart",
          "Checkout",
          { additional: param }
        );
        save_event(redux.auth.authToken, "Checkout", [eventbtn]);
      }

      // Determine endpoint based on authentication
      const endpoint = isLogedin ? order_placeOrder : order_cartCheckout;

      // Make API request
      let res = await request?.POST(endpoint, {
        ...param,
        totalCartAmount: amount,
      });
      if (res?.data) res = res?.data;
      // Validate response
      sessionStorage.setItem("new_user", res?.user_registered);
      if (!res?.paypalOrderId) {
        throw new Error("Backend did not return a PayPal Order ID");
      }

      // Update application state
      setGeneratedOrderId(res.orderId);
      dispatch?.(
        updateOrderData({
          order_data: { ...param, order_id: res.orderId },
        })
      );
      dispatch?.(updateTotalAmount({ total_amount: res.totalCartAmount }));
      if (res.userId) {
        const temp_login_data = JSON.stringify({
          authToken: res.userId,
          mobile: addressData.phone_no,
          username: addressData.username,
          countryCode: addressData.phone_code,
        });
        localStorage.setItem("temp_login", temp_login_data);
        localStorage.setItem("temp_uid", res.userId);
        // dispatch?.(
        //   login({
        //     authToken: res.userId,
        //     mobile: addressData.phone_no,
        //     username: addressData.username,
        //     countryCode: addressData.phone_code,
        //   })
        // );
        // pushToDataLayerWithoutEvent({
        //   event: (res?.user_registered)? "user_register": "user_login",
        //   user_id: res.userId,
        //   name: addressData.username || "",
        //   mobile: addressData.phone_no,
        //   utm_source: getLocalStorageUtm("utm_source") ?? "",
        //   utm_medium: getLocalStorageUtm("utm_medium") ?? "",
        //   utm_campaign: getLocalStorageUtm("utm_campaign") ?? "",
        //   utm_content: getLocalStorageUtm("utm_content") ?? "",
        //   utm_term: getLocalStorageUtm("utm_term") ?? "",
        // });
        // dispatch?.(resetCart({ cart_data: {} }));
      }
      // Create PayPal order
      const orderId = await actions.order.create({
        purchase_units: [
          {
            reference_id: res.paypalOrderId,
            amount: {
              value: amountString,
              currency_code: "USD",
            },
          },
        ],
      });

      return orderId;
    } catch (error) {
      // Handle errors
      getCartData();
      getUserData();
      console.error("PayPal Order Creation Failed:", error);

      // Show appropriate error messages
      const errorMessage = error.message.includes("Invalid payment amount")
        ? "Invalid payment amount. Please check your cart."
        : error.message.includes("PayPal Order ID")
        ? "Payment system error. Please try again."
        : "Payment processing failed. Please try again.";
      toast?.show(errorMessage, "error");

      return actions.reject();
    } finally {
      setLoading(false);
    }
  };

  const onPaypalApprove = (data: any, actions: any) => {
    return actions.order.capture().then((details: any) => {
      if (details?.status == "COMPLETED") {
        setPaypalTransactionId({
          orderId: generatedOrderId,
          userId:
            redux.auth.authToken && redux.auth.authToken != ""
              ? redux.auth.authToken
              : Number(localStorage.getItem("temp_uid")) ?? "N/A",
          paypalSubOrderId: data?.orderID,
        });
      }
    });
  };

  const setPaypalTransactionId = (param: any) => {
    setPaypalLoader(true);
    if (request) {
      request
        .POST(update_ppOrderID, param)
        .then((res: any) => {
          if (res.success) {
            setCartData(undefined);
            setTimeout(() => {
              getTransactionId(generatedOrderId);
              dispatch?.(resetCart({ cart_data: {} }));
            }, 30000);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // Razorpay specific functions
  const handleRazorpayPayment = async () => {
    try {
      // Prepare user and cart data
      const isLoggedin = redux?.auth?.authToken && redux?.auth?.authToken != "";
      const formData = structuredClone(addressData);
      const members = Object.values(formData?.members || {});
      const pitruNames = Object.values(formData?.pitruNames || {});
      const userData = { ...formData, members, pitruNames };
      const cartData = structuredClone(packageData);
      delete cartData["loading"];

      const user_details = {
        address: userData.address,
        members: userData.members,

        gotra: userData.gotra,
        gotra_not_know: userData.gotra_not_know,
        totalCartAmount: packageData.totalCartAmount,
        ...(isLoggedin
          ? cartData
          : { cart: transformCartData(redux.checkout.cart_data) }),
        pitruNames: pitruNames,
      };

      // Update address in redux
      dispatch?.(packageAddress({ address: user_details }));

      setLoading(true);
      const param = createOrderParams(user_details);
      // Handle authenticated user event tracking
      if (isLoggedin) {
        const eventbtn = button_event(
          "Pay Now",
          "Checkout : added to cart",
          "Checkout",
          { additional: param }
        );
        save_event(isLoggedin, "Checkout", [eventbtn]);
      }

      // Determine endpoint based on authentication
      const endpoint = isLoggedin ? order_placeOrder : order_cartCheckout;

      // Make API request
      let res = await request?.POST(endpoint, {
        ...param,
        totalCartAmount: parseFloat(packageData.totalCartAmount),
      });
      if (res?.data) res = res.data;
      sessionStorage.setItem("new_user", res?.user_registered);
      // Handle successful response
      if (res.razorpayOrderId && res.totalCartAmount) {
        dispatch?.(
          updateOrderData({
            order_data: { ...param, order_id: res.orderId },
          })
        );
        dispatch?.(updateTotalAmount({ total_amount: res.totalCartAmount }));

        // Handle login state
        if (isLoggedin) {
          const check = localStorage.getItem("setlogin") === "true";
          if (!check) {
            dispatch?.(
              login({
                authToken: parseInt(redux?.auth?.authToken),
                mobile: redux.auth.mobile,
                username: addressData.username ?? redux.auth.username,
                countryCode: addressData.phone_code ?? redux.auth.countryCode,
              })
            );
            pushToDataLayerWithoutEvent({
              event: res?.user_registered ? "user_register" : "user_login",
              user_id: res.userId,
              name: addressData.username || "",
              mobile: redux.auth.mobile,
              utm_source: getLocalStorageUtm("utm_source") ?? "",
              utm_medium: getLocalStorageUtm("utm_medium") ?? "",
              utm_campaign: getLocalStorageUtm("utm_campaign") ?? "",
              utm_content: getLocalStorageUtm("utm_content") ?? "",
              utm_term: getLocalStorageUtm("utm_term") ?? "",
            });
          }
          localStorage.removeItem("setlogin");
        } else if (res.userId) {
          const temp_login_data = JSON.stringify({
            authToken: res.userId,
            mobile: addressData.phone_no,
            username: addressData.username,
            countryCode: addressData.phone_code,
          });
          localStorage.setItem("temp_login", temp_login_data);
          localStorage.setItem("temp_uid", res.userId);
          // dispatch?.(
          //   login({
          //     authToken: res.userId,
          //     mobile: addressData.phone_no,
          //     username: addressData.username,
          //     countryCode: addressData.phone_code,
          //   })
          // );
          // pushToDataLayerWithoutEvent({
          //   event: (res?.user_registered)? "user_register": "user_login",
          //   user_id: res.userId,
          //   name: addressData.username || "",
          //   mobile: addressData.phone_no,
          //   utm_source: getLocalStorageUtm("utm_source") ?? "",
          //   utm_medium: getLocalStorageUtm("utm_medium") ?? "",
          //   utm_campaign: getLocalStorageUtm("utm_campaign") ?? "",
          //   utm_content: getLocalStorageUtm("utm_content") ?? "",
          //   utm_term: getLocalStorageUtm("utm_term") ?? "",
          // });
          // dispatch?.(resetCart({ cart_data: {} }));
        }

        // Initiate Razorpay payment
        handleRazorpayScreen(res.razorpayOrderId, res.totalCartAmount, {
          ...user_details,
          orderId: res.orderId,
        });
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleRazorpayScreen = async (
    order_id: string,
    amount: number,
    userdata: any
  ) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast?.show("Failed to load Razorpay", "error");
      pushToDataLayerWithoutEvent({
        event: "Order_Payment_Load_Failed_Web",
        order_id,
        amount,
        user_name: addressData.username,
        phone_number: addressData.phone_no,
        ...userdata,
      });
      setLoading(false);
      return;
    }

    const Razorpay = (window as any).Razorpay;
    if (!Razorpay) {
      toast?.show("Razorpay not found", "error");
      setLoading(false);
      return;
    }

    const razorpayKey = environment?.razorpay_key;
    if (!razorpayKey) {
      toast?.show(
        "Razorpay key is missing. Check environment variables.",
        "error"
      );
      setLoading(false);
      return;
    }

    const user_name = redux?.auth.username;
    const phone_number = addressData.phone_no ?? redux?.auth?.mobile ?? "";
    const email = redux?.auth?.email ?? "No email found";

    const options = {
      key: razorpayKey,
      amount: amount,
      currency: "INR",
      name: "Ghar Mandir",
      description: "Payment to Ghar Mandir",
      image: GharmandirRed_NameLogo,
      order_id: order_id,
      prefill: {
        name: user_name,
        email: email,
        contact: phone_number,
      },
      theme: {
        color: "#AF1e2e",
      },
      handler: function (response: any) {
        setCartData(undefined);
        setPaypalLoader(true);
        setTimeout(() => {
          getTransactionId(userdata?.orderId);
          dispatch?.(resetCart({ cart_data: {} }));
        }, 2000);
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
          toast?.show("Payment cancelled", "error");
          pushToDataLayerWithoutEvent({
            event: "Order_Payment_Cancelled_Web",
            order_id,
            amount,
            user_name,
            phone_number,
            ...userdata,
          });
          getCartData();
          getUserData();
        },
      },
      payment_method: {
        netbanking: true,
        card: true,
        upi: true,
        wallet: true,
      },
    };

    const paymentObject = new Razorpay(options);
    paymentObject.on("payment.failed", function (response: any) {
      console.error("Payment failed:", response);
      getCartData();
      getUserData();
      setLoading(false);
      toast?.show(`Payment failed: ${response.error.description}`, "error");
      pushToDataLayerWithoutEvent({
        event: "Order_Payment_Failed_Web",
        order_id,
        amount,
        user_name,
        phone_number,
        ...userdata,
      });
    });
    paymentObject.open();
  };

  const handleRazorPayPaymentNow = async () => {
    try {
      const error = validateAll(addressData, setErrors, showAddress, t);
      setErrors(error[1]);
      if (!error[0]) {
        setLoading(false);
        toast?.show(t("PLZ_FILL_REQ_FIELD"), "error");
        return;
      }
      pushToDataLayerWithoutEvent({
        ...transformToBeginCheckoutEvent(cartArray),
        mobile: addressData.phone_no,
      });
      await handleRazorpayPayment();
    } catch (error) {
      console.error("Payment initiation error:", error);
    }
  };
  const handlePayPalPaymentNow = async (data: any, actions: any) => {
    try {
      const error = validateAll(addressData, setErrors, showAddress, t);
      setErrors(error[1]);

      if (!error[0]) {
        setLoading(false);
        toast?.show(t("PLZ_FILL_REQ_FIELD"), "error");
        return;
      }

      return await createPaypalOrder(data, actions);
    } catch (error) {
      console.error("Payment initiation error:", error);
      return actions.reject();
    }
  };
  // Common effects
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || hasRun.current) return;
    hasRun.current = true;
    if (redux.auth.authToken && redux.auth.authToken != "") {
      getCartData();
      getUserData();
    } else getCartData();
  }, [hasMounted, redux.checkout]);

  useEffect(() => {
    if (!redux.auth.authToken || redux.auth.authToken == "") {
      const res = convertOldToNewFormat(redux?.checkout?.cart_data);
      modifyCartData({ data: res });
    }
  }, [redux.checkout]);

  useEffect(() => {
    let show = currency_name == "INR" ? false : true;
    (cartArray ?? [])?.map((item: any) => {
      if (!show) {
        if (item?.prasad && item?.prasad?.length) {
          item?.prasad.map((prsd: any) => {
            if (prsd?.count && prsd?.count > 0) {
              show = true;
            }
          });
        }
        // if (item.type == "PUJA") show = true;
        if (item.prasadIncluded) show = true;
      }
    });
    setShowAddress(currency_name == "INR" ? show : false);
  }, [cartArray]);

  const totalAmountFunction = () => {
    if (cartData) {
      const pitruChadhavaOrPuja = needOfPitruNames(cartData);
      const normalChadhavaOrPuja = needOfNormalNames(cartData);
      let totalValue =
        cartData?.Puja?.length > 0
          ? cartData?.Puja?.reduce((acc, cur) => acc + cur.totalAmount, 0)
          : 0;
      totalValue +=
        cartData?.Chadhava?.length > 0
          ? cartData?.Chadhava?.reduce((acc, cur) => acc + cur.totalAmount, 0)
          : 0;
      totalValue +=
        normalChadhavaOrPuja == 2
          ? 0
          : Object.keys(addressData.members)?.length *
            (currency_name == "INR" ? 50 : 5);
      totalValue +=
        pitruChadhavaOrPuja != 1
          ? 0
          : Object.keys(addressData.pitruNames)?.length *
            (currency_name == "INR" ? 50 : 5);
      return totalValue;
    }
    return "Loading";
  };

  useEffect(() => {
    const totalValue = totalAmountFunction();
    setPackageData((prev) => ({
      ...prev,
      totalCartAmount: totalValue,
    }));
  }, [cartData, addressData]);

  const renderPaymentButton = () => {
    return (
      <MobileFooter
        showWhatsapp={false}
        hideOnScroll={false}
        button_name={t("PAY_NOW")}
        left_section={
          packageData.loading ? (
            <div>
              <LoadingSpinner showWord={true} />
            </div>
          ) : (
            <div className="checkout-footerbox">
              <p className="checkout-footerbox-title">{t("TOTAL_PRICE")}</p>
              <span
                className="checkout-footerbox-price"
                translate="no"
                key={packageData?.totalCartAmount}
              >
                {currency}
                {packageData?.totalCartAmount}/-
              </span>
            </div>
          )
        }
        onClick={() => {
          handleRazorPayPaymentNow();
        }}
        loading={loading || packageData.loading}
      />
    );
  };

  return (
    <div className="container">
      {paypalLoader ? (
        <PaymentLoader />
      ) : (
        <>
          {!cartData ? (
            <CheckoutSkeleton />
          ) : packageData.totalCartAmount == 0 || cartArray?.length == 0 ? (
            <EmptyCartPage />
          ) : (
            <div className="checkout">
              <div className="container checkout-header">
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    router.push("../");
                  }}
                >
                  <ChevronIconLeft className="checkout-header--back-btn" />
                </span>
                <p className="checkout-header--name">{t("CHECKOUT")}</p>
              </div>

              <PackageView
                getData={(e) => {
                  setPackageData(e);
                }}
                cartData={cartData}
                setCartData={(e: any) => {
                  setCartData(e);
                  setCartArray([...e.Puja, ...e.Chadhava]);
                }}
                reload_cart={() => getCartData()}
              />
              <Address
                showAddress={showAddress}
                userData={addressData}
                setUserdata={setAddressData}
                setErrors={setErrors}
                errors={errors}
                packageData={packageData}
                cartData={cartData}
                cartArray={cartArray}
              />
              <div style={{ marginBottom: "100px" }}></div>
              {/* <div style={{ marginBottom: "100px" }}>
                <RecommendedChadhavaListing
                  addedToCart={getCartData}
                  dataAfterRemove={cartArray}
                />
              </div> */}

              {currency_name === "USD" ? (
                <MobileFooterWithButtonComponent
                  left_section={
                    packageData.loading ? (
                      <div>
                        <LoadingSpinner showWord={true} />
                      </div>
                    ) : (
                      <div className="checkout-footerbox">
                        <p className="checkout-footerbox-title">Total Price</p>
                        <span
                          className="checkout-footerbox-price"
                          translate="no"
                          key={packageData?.totalCartAmount}
                        >
                          {currency}
                          {packageData?.totalCartAmount}/-
                        </span>
                      </div>
                    )
                  }
                  right_section={
                    <PayPalScriptProvider options={initOptions}>
                      <PayPalButtons
                        style={{
                          layout: "vertical",
                          color: "gold",
                          shape: "pill",
                          label: "paypal",
                        }}
                        createOrder={handlePayPalPaymentNow}
                        onApprove={onPaypalApprove}
                        fundingSource="paypal"
                      />
                    </PayPalScriptProvider>
                  }
                />
              ) : (
                renderPaymentButton()
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DI(CheckoutPage);

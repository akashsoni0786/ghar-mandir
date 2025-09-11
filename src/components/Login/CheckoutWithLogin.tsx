import { WhatsappColoredIcon } from "@/assets/svgs";
import { useEffect, useState } from "react";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import { urlFetchCalls } from "@/constants/url";
import useTrans from "@/customHooks/useTrans";
import {
  getCurrencyName,
  getSign,
  validateGotra,
  validateName,
} from "@/constants/commonfunctions";
import Popup from "../Common/Popup";
import TextField from "../Common/TextField";
import { DarkBgButtonFw } from "../Common/Buttons";
import "./Login.css";
import PaymentConfirmationBox from "../Checkout/PaymentConfirmBox";
import { environment } from "@/environment/environment";
import { pushToDataLayerWithoutEvent } from "@/lib/gtm";
import PaymentLoader from "../Common/Loadings/PaymentLoader";

interface Props extends DIProps {
  setLoginCheck?: (e: boolean) => void;
  showPopup: boolean;
  otherData: any;
}

const {
  POST: { subscription_startSubscription, subscription_subscriptionPayment },
} = urlFetchCalls;

const CheckoutWithLogin = ({
  setLoginCheck,
  request,
  showPopup,
  toast,
  redux,
  otherData,
}: Props) => {
  const sign = getSign();
  const t = useTrans(redux?.common?.language);
  const currency_name = getCurrencyName();
  const [paymentLoad, setPaymentLoad] = useState(false);
  const [formData, setFormData] = useState({
    mobile:
      redux.auth.mobile && redux.auth.mobile != "" ? redux.auth.mobile : "",
    phone_code: currency_name == "USD" ? "+1" : "+91",
    name:
      redux.auth.username && redux.auth.username != ""
        ? redux.auth.username
        : "",
    gotra: "",
    gotra_not_know: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    mobile: "",
    name: "",
    gotra: "",
  });
  const [confirmationData, setConfirmationData] = useState(undefined);

  const validateMobile = (mobile: string) => {
    if (!mobile) return t("MOBILE_REQUIRED");
    if (!/^\d{10}$/.test(mobile)) return t("INVALID_MOBILE");
    return "";
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validate and clear error when user types
    if (typeof value === "string") {
      setErrors((prev) => ({
        ...prev,
        [field]:
          field === "gotra"
            ? validateGotra(value)
            : field === "name"
            ? validateName(value, t)
            : validateMobile(value),
      }));
    }
  };
  const handleLogin = (user_details: any) => {
    const isLoggedIn = redux?.auth?.authToken && redux?.auth?.authToken != "";
    const mobileError = validateMobile(formData.mobile);
    const nameError = validateName(formData.name, t); // Name is always required
    const gotraError = !formData.gotra_not_know
      ? validateGotra(formData.gotra)
      : "";

    setErrors({
      mobile: mobileError,
      name: nameError,
      gotra: gotraError,
    });

    if (!mobileError && !nameError && !gotraError) {
      setLoading(true);
      const param = {
        userId: isLoggedIn ? redux?.auth?.authToken : null,
        mobileNumber: user_details?.mobile,
        countryCode: user_details?.phone_code,
        userName: user_details?.name,
        gotra: user_details?.gotra,
        gotra_not_know: user_details?.gotra_not_know,
        // poojaId: "", // optional
        chadhaavaId: otherData.chadhaavaId, // optional
        subscriptionId: otherData.subscriptionId, //
        razorPayPlanId: otherData.razorPayPlanId, // Razorpay dashboard plan_id
      };

      if (request) {
        request
          .POST(subscription_startSubscription, param, true)
          .then((res: any) => {
            if (res.success) {
              const user_data = {
                Name: user_details?.name,
                "Mobile No.": user_details?.mobile,
                Gotra: user_details?.gotra_not_know
                  ? "Not known"
                  : user_details?.gotra,
                "Order Id": "no found",
                Status: "Successfull",
                "Transaction Id": "Not generated",
                Date: new Date().toLocaleString(),
                "Total amount": sign + String(otherData.price) + "/-",
                razorpay_key: res.razorpay.key,
                ...otherData,
              };
              handleRazorpayScreen(
                res.razorpay.subscription_id,
                otherData.price,
                { ...user_data, userId: res.userId }
              );
            } else {
              toast?.show(res?.message || t("Login error"), "error");
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else {
      toast?.show(t("PLEASE_FILL_ALL_FIELDS"), "error");
    }
  };
  const handleCheckPayment = (param, userdata) => {
    if (request) {
      request.POST(subscription_subscriptionPayment, param).then((res) => {
        if (res.success) {
          setConfirmationData({
            ...userdata,
            "Subscription Id": res?.subscriptionId,
          });
          toast?.show(
            res?.message || "Order has been placed successfully",
            "success"
          );
          setPaymentLoad(false);
        } else {
          setTimeout(() => {
            handleCheckPayment(param, userdata);
          }, 10000);
        }
      });
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
        user_name: userdata.Name,
        phone_number: userdata["Mobile No."],
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

    const user_name = userdata.Name;
    const phone_number = userdata["Mobile No."] ?? "";
    const email = "your@exampe.com";
    const options = {
      key: razorpayKey,
      amount: amount,
      currency: "INR",
      name: "Ghar Mandir",
      description: "Payment to Ghar Mandir",
      subscription_id: order_id,
      prefill: {
        name: user_name,
        email: email,
        contact: phone_number,
      },
      theme: {
        color: "#af1e2e",
      },
      handler: function (response: any) {
        setPaymentLoad(true);
        setTimeout(() => {
          handleCheckPayment(
            {
              subscriptionId: order_id,
              userId: userdata.userId,
              razorpay_payment_id: response?.razorpay_payment_id,
            },
            userdata
          );
        }, 10000);
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
          toast?.show("Payment cancelled", "error");
          pushToDataLayerWithoutEvent({
            event: "Order_Payment_Cancelled_Web",
            order_id,
            amount,
            user_name: userdata.Name,
            phone_number: userdata["Mobile No."],
            ...userdata,
          });
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
      setLoading(false);
      toast?.show(`Payment failed: ${response.error.description}`, "error");
      pushToDataLayerWithoutEvent({
        event: "Order_Payment_Failed_Web",
        order_id,
        amount,
        user_name: userdata.Name,
        phone_number: userdata["Mobile No."],
        ...userdata,
      });
    });
    paymentObject.open();
  };
  useEffect(() => {
    if (!showPopup) setConfirmationData(undefined);
  }, [showPopup]);
  return (
    showPopup && (
      <Popup
        position={"center"}
        isEscape={true}
        onClose={() => {
          if (setLoginCheck) setLoginCheck(false);
        }}
      >
        {paymentLoad ? (
          <PaymentLoader />
        ) : confirmationData ? (
          <PaymentConfirmationBox
            alldata={confirmationData}
            onClose={() => {
              if (setLoginCheck) {
                setLoginCheck(false);
                setConfirmationData(undefined);
              }
            }}
          />
        ) : (
          <div className="login-container">
            <h3 className="login-heading">Checkout Your Subscription</h3>

            <div className="login-section">
              <h3 className="login-section-heading">
                Enter your mobile number
              </h3>
              <p className="login-section-subheading">
                Booking updates, Puja photos, videos & details will be shared on
                WhatsApp on below number
              </p>

              <div className="login-field">
                <TextField
                  iconPosition="left"
                  withIcon={true}
                  icon={<WhatsappColoredIcon />}
                  placeholder="Mobile number"
                  value={formData.mobile}
                  onChange={(e) => handleChange("mobile", e)}
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  type="tel"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div className="login-section">
              <h3 className="login-section-heading">{t("ENTER_YOUR_NAME")}</h3>
              <p className="login-section-subheading">
                {t("WILL_BE_RICTED_DURING_SEVA")}
              </p>
              <div className="login-field">
                <TextField
                  placeholder={t("ENTER_YOUR_NAME")}
                  value={formData.name}
                  onChange={(e) => handleChange("name", e)}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </div>
            </div>

            <div className="login-section">
              <div className="checkout-userData--member-headingwrap">
                <h3 className="login-section-heading">
                  {t("GOTRA_OF_MEBMBER")}
                </h3>
                <p className="login-section-subheading">
                  {t("WILL_BE_RICTED_DURING_SEVA")}
                </p>
              </div>
              <div className="login-field">
                <TextField
                  placeholder={t("ENTER_GOTRA")}
                  value={formData.gotra}
                  onChange={(e) => handleChange("gotra", e)}
                  disabled={formData.gotra_not_know}
                  error={!!errors.gotra}
                  helperText={errors.gotra}
                  required={!formData.gotra_not_know}
                />
              </div>
              <div className="checkout-userData--member-checkbox">
                <input
                  checked={formData.gotra_not_know}
                  type="checkbox"
                  className="checkout-userData--member-checkbox-box"
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    handleChange("gotra_not_know", isChecked);
                    if (isChecked) {
                      handleChange("gotra", "Kashyap");
                      setErrors((prev) => ({ ...prev, gotra: "" }));
                    }
                  }}
                />
                <label className="checkout-userData--member-checkbox-label">
                  {t("NOT_KNOW_GOTRA")}
                </label>
              </div>
            </div>

            <div className="login-button-container">
              <DarkBgButtonFw
                isLoading={loading}
                onClick={() => handleLogin(formData)}
                disabled={
                  !formData.mobile ||
                  !formData.name ||
                  (!formData.gotra && !formData.gotra_not_know) ||
                  !!errors.mobile ||
                  !!errors.name ||
                  (!!errors.gotra && !formData.gotra_not_know)
                }
              >{`Pay ${sign + "" + otherData.price}/-`}</DarkBgButtonFw>
            </div>
          </div>
        )}
      </Popup>
    )
  );
};

export default DI(CheckoutWithLogin);

import { WhatsappColoredIcon } from "@/assets/svgs";
import { useState, useEffect, useRef } from "react";
import { DIProps } from "@/core/DI.types";
import { login } from "@/store/slices/authSlice";
import { DI } from "@/core/DependencyInjection";
import { urlFetchCalls } from "@/constants/url";
import { packageAddress } from "@/store/slices/checkoutSlice";
import useWindow from "@/customHooks/useWindows";
import useTrans from "@/customHooks/useTrans";
import { getCurrencyName, validatePhone } from "@/constants/commonfunctions";
import Popup from "../Common/Popup";
import TextField from "../Common/TextField";
import { DarkBgButtonFw } from "../Common/Buttons";
import "./Login.css";
import { pushToDataLayerWithoutEvent } from "@/lib/gtm";
import { getLocalStorage, getLocalStorageUtm } from "@/services/storage";
interface Props extends DIProps {
  setLoginCheck?: (e: boolean) => void;
  showPopup: boolean;
  hideName?: boolean;
}

const {
  POST: { users_login, users_verifyOtp },
} = urlFetchCalls;

const Login = ({
  dispatch,
  setLoginCheck,
  request,
  showPopup,
  toast,
  hideName,
  redux,
  location,
}: Props) => {
  const t = useTrans(redux?.common?.language);
  const currency_name = getCurrencyName();
  const { width } = useWindow();
  const [formData, setFormData] = useState({
    mobile: "",
    phone_code: currency_name == "USD" ? "+1" : "+91",
    name: "",
    otp: "",
    authToken: "",
  });
  const [loading, setLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [errors, setErrors] = useState({
    mobile: "",
    name: "",
    otp: "",
  });

  // Timer effect for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const validateName = (name: string) => {
    if (!name || name.trim() === "") return t("NAME_REQUIRED");
    if (name.length < 3) return t("SHORT_NAME");
    if (!/^[a-zA-Z ]+$/.test(name)) return t("INVALID_NAME");
    return "";
  };

  const validateOtp = (otp: string) => {
    if (!otp) return t("OTP_REQUIRED");
    if (!/^\d{6}$/.test(otp)) return t("INVALID_OTP");
    return "";
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user types
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    // Handle full 6-digit paste
    if (value.length === 6) {
      const digits = value.split("");
      setFormData((prev) => ({
        ...prev,
        otp: value,
      }));
      digits.forEach((digit, idx) => {
        if (otpInputRefs.current[idx]) {
          otpInputRefs.current[idx]!.value = digit;
        }
      });
      otpInputRefs.current[5]?.blur();
      return;
    }

    // Single digit input
    const newOtp = formData.otp.split("");
    newOtp[index] = value;
    const updatedOtp = newOtp.join("");
    setFormData((prev) => ({
      ...prev,
      otp: updatedOtp,
    }));

    // Move to next
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Clear error
    if (errors.otp) {
      setErrors((prev) => ({
        ...prev,
        otp: "",
      }));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleLogin = (user_details: any) => {
    const mobileError = validatePhone(formData.mobile, formData.phone_code, t);
    const nameError = !hideName ? validateName(formData.name) : "";

    setErrors({
      mobile: mobileError,
      name: nameError,
      otp: "",
    });

    if (!mobileError && !nameError) {
      setLoading(true);
      otpInputRefs.current[0]?.focus();
      const param = {
        name: user_details?.name,
        mobileNo: user_details?.mobile,
        ...(currency_name != "INR" ? { type: "LIVE" } : {}),
        countryCode: user_details?.phone_code,
      };

      if (request) {
        request
          .POST(users_login, param, true)
          .then((res: any) => {
            if (res?.user) {
              pushToDataLayerWithoutEvent({
                event: "user_register",
                user_id: res.user.userId,
                name: formData?.name,
                mobile: user_details?.mobile,
                utm_source: getLocalStorageUtm("utm_source") ?? "",
                utm_medium: getLocalStorageUtm("utm_medium") ?? "",
                utm_campaign: getLocalStorageUtm("utm_campaign") ?? "",
                utm_content: getLocalStorageUtm("utm_content") ?? "",
                utm_term: getLocalStorageUtm("utm_term") ?? "",
              });
              toast?.show(res?.message || t("LOGIN_SUCCESS"), "success");
              if (dispatch) {
                dispatch(
                  login({
                    authToken: res.user.userId,
                    mobile: formData?.mobile,
                    username: formData?.name,
                    countryCode: formData?.phone_code,
                  })
                );
                if (setLoginCheck) setLoginCheck(false);
                if (location == "/checkout") window.location.reload();
              }
            } else if (res?.authToken) {
              toast?.show(res?.message, "success");
              setOtpSent(true);
              setShowOtpField(true);
              setOtpTimer(60);
              setLoading(false);
              setFormData((prev) => ({
                ...prev,
                otp: "",
                authToken: res?.authToken,
              }));
            } else {
              toast?.show(res?.message || "Login error", "error");
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };

  const verifyOtp = () => {
    setLoading(true);
    if (request) {
      request
        .POST(users_verifyOtp, {
          mobileNo: formData.mobile,
          otp: formData.otp,
          authToken: formData?.authToken,
        })
        .then((res: any) => {
          toast?.show(res?.message, res?.success ? "success" : "error");
          if (res?.success) {
            if (dispatch) {
              dispatch(
                login({
                  authToken: res.user.userId,
                  mobile: formData?.mobile,
                  username: formData?.name,
                  countryCode: formData?.phone_code,
                })
              );
              pushToDataLayerWithoutEvent({
                event: "user_login",
                user_id: res.userId,
                name: formData?.name || "",
                mobile: formData?.mobile,
                utm_source: getLocalStorageUtm("utm_source") ?? "",
                utm_medium: getLocalStorageUtm("utm_medium") ?? "",
                utm_campaign: getLocalStorageUtm("utm_campaign") ?? "",
                utm_content: getLocalStorageUtm("utm_content") ?? "",
                utm_term: getLocalStorageUtm("utm_term") ?? "",
              });
              dispatch(
                packageAddress({
                  address: {
                    address: {
                      street_address: res.user?.address?.streetAddress ?? "",
                      city: res.user?.address?.townCity ?? "",
                      state: res.user?.address?.stateRegion ?? "",
                      pincode: res.user?.address?.postalCode ?? "",
                    },
                    members: res.user?.familyMembers ?? [],
                    gotra: res.user?.gotra,
                  },
                })
              );
              if (location == "/checkout") window.location.reload();
              if (setLoginCheck) setLoginCheck(false);
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleSubmit = () => {
    const otpError = validateOtp(formData.otp);
    setErrors((prev) => ({
      ...prev,
      otp: otpError,
    }));

    if (!otpError) {
      verifyOtp();
    } else {
      toast?.show(t("OTP_ERROR"), "error");
    }
  };

  return (
    showPopup && (
      <Popup
        position={width > 480 ? "center" : "bottom"}
        isEscape={true}
        onClose={() => {
          if (setLoginCheck) setLoginCheck(false);
        }}
      >
        <div className="login-container">
          <h3 className="login-heading">Fill your login details</h3>

          <div className="login-section">
            <h3 className="login-section-heading">Enter your mobile number</h3>
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
                disabled={otpSent}
                countryCode={formData?.phone_code}
                onCountryCodeChange={(e) => handleChange("phone_code", e)}
              />
            </div>
          </div>

          {!hideName && (
            <div className="login-section">
              <h3 className="login-section-heading">Enter your name</h3>
              <div className="login-field">
                <TextField
                  placeholder="Add full name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e)}
                  error={!!errors.name}
                  helperText={errors.name}
                  disabled={otpSent}
                />
              </div>
            </div>
          )}

          {showOtpField && (
            <div className="login-section">
              <h3 className="login-section-heading">Enter OTP</h3>
              <p className="login-section-subheading">
                We've sent a 6-digit OTP to your mobile number
              </p>

              <div className="otp-container">
                {[...Array(6)].map((_, index) => (
                  // <input
                  //   key={index}
                  //   ref={(el: any) => (otpInputRefs.current[index] = el)}
                  //   type="number"
                  //   inputMode="numeric"
                  //   autoComplete="one-time-code"
                  //   maxLength={1}
                  //   value={formData.otp[index] || ""}
                  //   onChange={(e) => handleOtpChange(index, e.target.value)}
                  //   onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  //   className={`otp-input ${errors.otp ? "error" : ""}`}
                  // />
                  <input
                    key={index}
                    ref={(el: any) => (otpInputRefs.current[index] = el)}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={formData.otp[index] || ""}
                    onChange={(e) => {
                      // Only allow numeric input using regex
                      const numericValue = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                      if (numericValue === "" || /^[0-9]$/.test(numericValue)) {
                        handleOtpChange(index, numericValue);
                      }
                    }}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={`otp-input ${errors.otp ? "error" : ""}`}
                  />
                ))}
              </div>

              {errors.otp && <p className="error-message">{errors.otp}</p>}

              <div className="otp-timer-container">
                {otpTimer > 0 ? (
                  <span className="otp-timer">
                    Resend OTP in {Math.floor(otpTimer / 60)}:
                    {String(otpTimer % 60).padStart(2, "0")}
                  </span>
                ) : (
                  <button
                    className="otp-resend-button"
                    onClick={() => handleLogin(formData)}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="login-button-container">
            <DarkBgButtonFw
              children={otpSent ? "Verify & Continue" : "Submit"}
              isLoading={loading}
              onClick={() => {
                if (otpSent) {
                  handleSubmit();
                } else handleLogin(formData);
              }}
              disabled={
                otpSent
                  ? !formData.otp || formData.otp.length < 6
                  : !formData.mobile ||
                    (!formData.name && !hideName && !!formData.mobile)
              }
            />
          </div>
        </div>
      </Popup>
    )
  );
};

export default DI(Login);

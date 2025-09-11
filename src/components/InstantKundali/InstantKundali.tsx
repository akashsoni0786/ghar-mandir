import "../Kundali/Kundali.css";
import { useEffect, useState } from "react";
import { AlertTriangle, Calendar, Edit } from "react-feather";
import "../ContactUs/ContactUs.css";
import TextField from "../Common/TextField";
import { DarkBgButtonFw } from "../Common/Buttons";
import { GharmandirRed_NameLogo, WhatsappColoredIcon } from "@/assets/svgs";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import RadioButton from "../Common/RadioButton";
import Select from "../Common/Select";
import TimePicker from "../Common/TimePicker";
import { environment } from "@/environment/environment";
import moment from "moment";
import { Alert } from "antd";
import DateOfBirthPicker from "../Common/DateOfBirthPicker/DateOfBirthPicker";

const Kundali = ({ request, toast, redux }: DIProps) => {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    countryCode: "+91",
    day: "",
    month: "",
    year: "",
    hour: "",
    min: "",
    postalCode: "",
    state: "",
    city: "",
    gender: "",
    language: "hi",
    ampm: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [kundliResult, setKundliResult] = useState("");
  const [stateList, setStateList] = useState<any>(undefined);
  const [cityList, setCityList] = useState<any>(undefined);
  const [loadingCity, setLoadingCity] = useState(false);
  const handleChange = (
    field: string,
    value: any,
    field2?: string,
    value2?: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field2 ? { [field2]: value2 } : {}),
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };
  const handleCountryCodeChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      countryCode: val,
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";

    const fullWhatsappNumber = `${formData.countryCode} ${formData.whatsapp}`;
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "Whatsapp number is required";
    } else if (!/^\d{10}$/.test(formData.whatsapp)) {
      newErrors.whatsapp = "Invalid mobile number (10 digits required)";
    }

    if (!formData.day || !formData.month || !formData.year) {
      newErrors.date = "Birth date is required";
    }

    if (!formData.hour || !formData.min) {
      newErrors.time = "Time of birth is required";
    }
    if (!formData.gender || formData.gender == "") {
      newErrors.gender = "Gender is required";
    }

    // if (!formData.postalCode.trim())
    //   newErrors.postalCode = "Postal code is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.city.trim()) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateChange = (dateString) => {
    if (!dateString) {
      setFormData((prev) => ({
        ...prev,
        day: "",
        month: "",
        year: "",
      }));
      return;
    }

    const [day, month, year] = dateString;
    setFormData((prev) => ({
      ...prev,
      day,
      month,
      year,
    }));
  };

  const handleTimeChange = (timeString) => {
    if (!timeString) {
      setFormData((prev) => ({
        ...prev,
        hour: "",
        min: "",
      }));
      return;
    }
    let firstAr = timeString.split(" ");
    const [hour, min] = firstAr[0].split(":");
    setFormData((prev) => ({
      ...prev,
      hour,
      min,
      ampm: firstAr[1],
    }));
  };

  const getDateValue = () => {
    if (!formData.year || !formData.month || !formData.day) return "";
    return `${formData.year}-${formData.month.padStart(
      2,
      "0"
    )}-${formData.day.padStart(2, "0")}`;
  };

  const getTimeValue = () => {
    if (!formData.hour || !formData.min) return "";
    return `${formData.hour.padStart(2, "0")}:${formData.min.padStart(2, "0")}`;
  };
  const formatTime = (hour: string, min: string, ampm: string) => {
    const hourNum = parseInt(hour);
    const period = ampm;
    const formattedHour = hourNum % 12 || 12;
    return `${formattedHour}:${min.padStart(2, "0")} ${period}`;
  };
  const generateKundli = async () => {
    try {
      const formattedValues = {
        source: "admin",
        userId: "1234567",
        name: formData.name,
        gender: formData.gender.toLowerCase(),
        dob: `${formData.day.padStart(2, "0")}/${formData.month.padStart(
          2,
          "0"
        )}/${formData.year}`,
        time: formatTime(formData.hour, formData.min, formData.ampm),
        city: formData.city,
        state: formData.state,
        kundliLanguage: formData.language,
        whatsapp: formData.whatsapp,
        countryCode: formData?.countryCode,
      };
      const response = await fetch(
        `${environment.API_ENDPOINT}users/generateKundli`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedValues),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast?.show("Kundli generated successfully!", "success");

        if (data?.data?.kundli && data.data.kundli.startsWith("http")) {
          const kundliUrl = data.data.kundli;
          const fileName = `kundli_${formData.name}_${moment().format(
            "YYYYMMDD_HHmmss"
          )}.pdf`;
          // setKundliResult(kundliUrl);
          // Open in new tab
          window.open(kundliUrl, "_blank")?.focus();
          //   newTab.location.href = kundliUrl;

          // Then trigger download
          const link = document.createElement("a");
          link.href = kundliUrl;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        toast?.show(data.message || "Error generating Kundli", "error");
      }
    } catch (error) {
      toast?.show("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
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
    const user_name = userdata.name;
    const phone_number = userdata?.whatsapp ?? "";
    const email = "No email found";

    // Load Razorpay SDK dynamically
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast?.show("Failed to load Razorpay", "error");
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    const Razorpay = (window as any).Razorpay;
    if (!Razorpay) {
      toast?.show("Razorpay not found", "error");
      setLoading(false);
      setIsSubmitting(false);
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

    const options = {
      key: razorpayKey,
      amount: amount,
      currency: "INR",
      name: "Ghar Mandir",
      description: "Payment to Ghar Mandir",
      image: "",
      order_id: order_id,
      prefill: {
        name: user_name,
        email: email,
        contact: phone_number,
      },
      theme: {
        color: "#F4C430",
      },
      handler: function (response: any) {
        toast?.show("Payment completed successfully", "success");
        generateKundli();
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
          setIsSubmitting(false);
          toast?.show("Payment cancelled", "error");
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
      setLoading(false);
      toast?.show(`Payment failed: ${response.error.description}`, "error");
    });

    paymentObject.open();
  };

  const generateOrderId = (values: any) => {
    setLoading(true);
    setIsSubmitting(true);
    if (request) {
      request
        .POST("users/kundliPayment", {
          userId: 1234567,
          amount: 21,
          name: values.name,
          mobileNumber: values?.whatsapp,
        })
        .then((res: any) => {
          if (res.data.razorpayOrderId) {
            handleRazorpayScreen(res.data.razorpayOrderId, 21, values);
          } else {
            toast?.show("Unable to process your payment this time", "error");
            setIsSubmitting(false);
          }
        });
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast?.show("Please fill all required fields properly!", "error");
      return;
    }
    generateOrderId(formData);
  };
  const getCityList = (state_name: string) => {
    if (request) {
      setLoadingCity(true);
      request
        .POST("states/getCitiesByState", {
          statename: state_name,
        })
        .then((res: any) => {
          if (res.data) {
            const cities = res.data.map((val: any) => ({
              label: val?.district,
              value: val?.district,
            }));
            setCityList(cities ?? []);
          }
        })
        .finally(() => {
          handleChange("city", "");
          setLoadingCity(false);
        });
    }
  };
  // useEffect(() => {
  //   if (kundliResult != "") window.open(kundliResult, "_blank");
  // }, [kundliResult]);
  useEffect(() => {
    if (request) {
      request.GET("states/allStates").then((res: any) => {
        if (res.data) {
          const states = res.data.map((val: any) => ({
            label: val?.statename,
            value: val?.statename,
          }));
          setStateList(states ?? []);
        }
      });
    }
  }, []);
  return (
    <>
      <div className="instant-kundali container">
        <div className="instant-kundali--wrap">
          <div className="kundali-heading-instant">
            <div className="mb-16">
              <GharmandirRed_NameLogo />
            </div>
            <h3 className="kundali-heading--head">Kundli Generator</h3>
            <p className="kundali-heading--desc">
              Generate your personalized astrological chart
            </p>
            <div className="instant-line-gray" />
          </div>
          {submitError && (
            <div
              className="error-message"
              style={{ color: "red", margin: "10px 0" }}
            >
              {submitError}
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <TextField
              required
              heading="Full name"
              value={formData.name}
              onChange={(e) => handleChange("name", e)}
              placeholder="Enter full name"
              error={errors.name}
              disabled={isSubmitting}
              helperText={errors.name}
            />
            <span className="max-width-field">
              <RadioButton
                label="Gender"
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Other", value: "Other" },
                ]}
                selectedValue={formData?.gender ?? ""}
                onChange={(val) => handleChange("gender", val)}
                direction="horizontal"
                error={errors.gender}
              />
              {errors.gender && (
                <p
                  className="error-text"
                  style={{
                    marginTop: "5px",
                    marginBottom: "10px",
                    color: "#AF1E2E",
                    fontSize: "12px",
                  }}
                >
                  {errors.gender}
                </p>
              )}
            </span>
            <TextField
              heading="Whatsapp Number"
              value={formData.whatsapp}
              onChange={(e) => {
                // Allow only numbers and limit to 10 digits
                const value = e.replace(/\D/g, "").slice(0, 10);
                handleChange("whatsapp", value);
              }}
              withIcon={true}
              iconPosition="both"
              icon={<WhatsappColoredIcon />}
              rightIcon={<Edit color="#AF1E2E" />}
              type="tel"
              required
              countryCode={formData.countryCode}
              onCountryCodeChange={handleCountryCodeChange}
              placeholder="Enter mobile number"
              error={errors.whatsapp}
              maxLength={10}
              disabled={isSubmitting}
              helperText={errors.whatsapp}
            />
            <DateOfBirthPicker
              heading="Date of Birth"
              value={[formData.day,formData.month,formData.year]}
              onChange={handleDateChange}
              required
              helperText="Select your date of birth"
              error={errors.date}
              disabled={isSubmitting}
            />
            <TimePicker
              heading="Time of Birth"
              required
              value={getTimeValue()}
              onChange={(e) => {
                handleTimeChange(e);
              }}
              error={errors.time}
              disabled={isSubmitting}
              helperText={errors.time}
            />
            <Select
              required
              heading="State"
              value={formData.state}
              onChange={(e) => {
                handleChange("state", e);
                getCityList(e);
              }}
              options={stateList ?? []}
              error={errors.state}
              isLoading={!stateList || stateList?.length == 0}
              helperText={errors.state}
              disabled={isSubmitting}
            />
            <Select
              required
              heading="City"
              value={formData.city}
              onChange={(e) => handleChange("city", e)}
              options={cityList ?? []}
              error={errors.city}
              disabled={cityList?.length == 0 || isSubmitting}
              isLoading={loadingCity}
              helperText={errors.city}
            />
            {/* <TextField
              heading="State"
              value={formData.state}
              onChange={(e) => handleChange("state", e)}
              placeholder="Enter state of birth"
              required
              error={errors.state}
              disabled={isSubmitting}
            />

            <TextField
              heading="City"
              value={formData.city}
              onChange={(e) => handleChange("city", e)}
              placeholder="Enter city of birth"
              required
              error={errors.city}
              disabled={isSubmitting}
            /> */}
            <Select
              required
              heading="Select Language"
              options={[
                { label: "Hindi", value: "hi" },
                { label: "English", value: "en" },
              ]}
              value={formData.language}
              onChange={(e) => handleChange("language", e)}
              disabled={isSubmitting}
            />
            <Alert
              type="warning"
              icon={<AlertTriangle className="alert-icon" />}
              description={"Pay ₹21/- to generate kundali"}
            />
            <DarkBgButtonFw
              type="submit"
              // isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Generating..." : "Generate Kundali"}
            </DarkBgButtonFw>
          </form>
        </div>
      </div>
    </>
  );
};

export default DI(Kundali);

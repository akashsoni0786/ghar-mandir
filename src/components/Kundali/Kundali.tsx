import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, ChevronLeft, Edit, ThumbsUp } from "react-feather";
import "../ContactUs/ContactUs.css";
import "./Kundali.css";
import TextField from "../Common/TextField";
import { DarkBgButtonFw } from "../Common/Buttons";
import { WhatsappColoredIcon } from "@/assets/svgs";
import useDebounce from "@/customHooks/useDebounce";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import { urlFetchCalls } from "@/constants/url";
import RadioButton from "../Common/RadioButton";
import Select from "../Common/Select";
import TimePicker from "../Common/TimePicker";
import Popup from "../Common/Popup";

const {
  POST: { pooja_city, users_generateKundli },
} = urlFetchCalls;

const Kundali = ({ request, toast, redux }: DIProps) => {
  const router = useRouter();
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
    maritalStatus:""
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowpop] = useState(false);
  const debouncedPincode = useDebounce(formData?.postalCode, 500);
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
    if (!formData.maritalStatus || formData.maritalStatus == "") {
      newErrors.maritalStatus = "Marital Status is required";
    }

    if (!formData.postalCode.trim())
      newErrors.postalCode = "Postal code is required";
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

    const [year, month, day] = dateString.split("-");
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

  const formatTime = (hour: string, min: string, ampm: string) => {
    const hourNum = parseInt(hour);
    const period = ampm;
    const formattedHour = hourNum % 12 || 12;
    return `${formattedHour}:${min.padStart(2, "0")} ${period}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      userId:
        redux?.auth?.authToken && redux?.auth?.authToken != ""
          ? redux?.auth?.authToken
          : "123456",
      name: formData.name,
      gender: formData.gender.toLowerCase(),
      dob: `${formData.day.padStart(2, "0")}/${formData.month.padStart(
        2,
        "0"
      )}/${formData.year}`,
      time: formatTime(formData.hour, formData.min, formData.ampm),
      city: formData.city,
      state: formData.state,
      language: formData.language,
      whatsapp: formData.whatsapp,
      countryCode: formData?.countryCode,
      maritalStatus:formData?.maritalStatus
    };

    if (request) {
      const res = await request
        .POST(users_generateKundli, { ...payload })
        .then((res: any) => {
          if (res?.status == "success") {
            setShowpop(true);
            toast?.show("Kundali request submitted successfully!", "success");
          } else {
            toast?.show(res?.message || "Failed to submit request", "error");
          }
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
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

  const fetchCityState = async (pincode: string) => {
    setLoading(true);
    request
      ?.POST?.(pooja_city, {
        pincode: parseInt(pincode),
      })
      .then((res: any) => {
        if (res?.data) {
          handleChange(
            "city",
            res?.data?.district || "",
            "state",
            res?.data?.statename || ""
          );
        } else {
          toast?.show(res?.message, "error");
        }
      })
      .catch((error: any) => {
        console.error("Error fetching city/state:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const hidePopup = () => {
    setShowpop(false);
    router.push("/");
  };
  useEffect(() => {
    if (debouncedPincode?.length === 6 && /^\d+$/.test(debouncedPincode)) {
      fetchCityState(debouncedPincode);
    }
  }, [debouncedPincode]);

  return (
    <>
      <div className="contact container">
        {showPopup && (
          <Popup position="center" onClose={hidePopup} isEscape>
            <div className="success-popup">
              Thank you for submitting your details. Your Kundali will be shared
              within 12 hours.
              <ThumbsUp color="#af1e2e" />
            </div>
          </Popup>
        )}
        <div className="checkout-header container">
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              router.push("../");
            }}
          >
            <ChevronLeft className="contact-header--name" />
          </span>
          <p className="contact-header--name">Kundali</p>
        </div>
        <div className="kundali-heading">
          <h3 className="kundali-heading--head">Request for Kundali</h3>
          <p className="kundali-heading--desc">
            We'd love to share kundali. Please fill out this form.
          </p>
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
          />
          <span className="max-width-field">
            <RadioButton
            required
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

          <span className="max-width-field">
            <RadioButton
            required
            label="Marital Status"
            options={[
              { label: "Married", value: "Married" },
              { label: "Unmarried", value: "Unmarried" },
            ]}
            selectedValue={formData?.maritalStatus ?? ""}
            onChange={(val) => handleChange("maritalStatus", val)}
            direction="horizontal"
          />
            {errors.maritalStatus && (
              <p
                className="error-text"
                style={{
                  marginTop: "5px",
                  marginBottom: "10px",
                  color: "#AF1E2E",
                  fontSize: "12px",
                }}
              >
                {errors.maritalStatus}
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
          />

          <TextField
            heading="Birth Date"
            type="date"
            value={getDateValue()}
            onChange={(e) => handleDateChange(e)}
            customCalendarIcon={<Calendar color="#AF1E2E" />}
            hideNativeCalendarIcon={true}
            inputId="birth-date-input"
            required
            placeholder="dd-mm-yyyy"
            error={errors.date}
          />
          <TimePicker
            heading="Time of Birth"
            required
            value={getTimeValue()}
            onChange={(e) => {
              handleTimeChange(e);
            }}
            error={errors.time}
          />

          <TextField
            heading="Postal Code"
            value={formData.postalCode}
            onChange={(e) => handleChange("postalCode", e)}
            placeholder="Enter postal code area of birth"
            required
            error={errors.postalCode}
          />

          <TextField
            heading="State"
            value={formData.state}
            onChange={(e) => handleChange("state", e)}
            placeholder="Enter state of birth"
            required
            error={errors.state}
            isLoading={loading}
          />

          <TextField
            heading="City"
            value={formData.city}
            onChange={(e) => handleChange("city", e)}
            placeholder="Enter city of birth"
            required
            error={errors.city}
            isLoading={loading}
          />
          <Select
            required
            heading="Select Language"
            options={[
              { label: "Hindi", value: "hi" },
              { label: "English", value: "en" },
            ]}
            value={formData.language}
            onChange={(e) => handleChange("language", e)}
          />

          <DarkBgButtonFw
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Request Kundali"}
          </DarkBgButtonFw>
        </form>
      </div>
    </>
  );
};

export default DI(Kundali);

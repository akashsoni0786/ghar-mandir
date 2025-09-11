import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "react-feather";
import "./ContactUs.css";
import TextField from "../Common/TextField";
import Select from "../Common/Select";
import TextArea from "../Common/TextArea";
import { DarkBgButtonFw } from "../Common/Buttons";
import { urlFetchCalls } from "@/constants/url";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import {
  button_event,
  pageview_event,
  save_event,
} from "@/constants/eventlogfunctions";
import { pushToDataLayerWithoutEvent } from "@/lib/gtm";
import useTrans from "@/customHooks/useTrans";

const {
  POST: { contact_contactUs },
} = urlFetchCalls;

const ContactUs = ({ request, toast, redux }: DIProps) => {
  const t = useTrans(redux?.common?.language);
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    queryType: "",
    message: "",
    preferredTime: "",
    agreeToPolicy: false,
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryTypes = [
    {
      value: "Puja / Chadhava Booking Inquiry",
      label: "1. Puja / Chadhava Booking Inquiry",
    },
    {
      value: "Order Status / Video Delivery Support",
      label: "2. Order Status / Video Delivery Support",
    },
    { value: "Payment / Refund Support", label: "3. Payment / Refund Support" },
    {
      value: "Post-Puja Experience / Feedback",
      label: "4. Post-Puja Experience / Feedback",
    },
    {
      value: "Temple Partnership / B2B Inquiry",
      label: "5. Temple Partnership / B2B Inquiry",
    },
    {
      value: "Report a Problem / Technical Issue",
      label: "6. Report a Problem / Technical Issue",
    },
    { value: "General Inquiry / Other", label: "7. General Inquiry / Other" },
  ];

  const timeSlots = [
    { value: "9am-12pm", label: "9am–12pm" },
    { value: "12pm-3pm", label: "12pm–3pm" },
    { value: "3pm-6pm", label: "3pm–6pm" },
    { value: "6pm-9pm", label: "6pm–9pm" },
  ];

  const handleChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.fullName.trim())
      newErrors.fullName = t("FULL_NAME") + t("IS_REQUIRED");
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = t("PHONE_NUMBER") + t("IS_REQUIRED");
    else if (
      !/^(\+91[\s]?)?[0]?(91)?[789]\d{9}$/.test(
        formData.phoneNumber.replace(/\s/g, "")
      )
    ) {
      newErrors.phoneNumber = "Please enter a valid Indian phone number";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.queryType) newErrors.queryType = t("SELECT_QUERY_TYPE");
    if (!formData.message.trim()) newErrors.message = t("ENTER_MESSAGE");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      const eventbtn = button_event(
        "Submit",
        "Contact Us : Form Submission",
        "Submit",
        {
          additionalData: formData,
        }
      );
      save_event(redux?.auth?.authToken, location ?? "Home", [eventbtn]);
      pushToDataLayerWithoutEvent({
        event: "contact_form_submission",
        user_id: redux?.auth?.authToken,
        mobile: redux?.auth?.mobile,
        data: formData,
      });
      request
        ?.POST(contact_contactUs, formData)
        .then((res: any) => {
          if (res.success) toast?.show(res.message, "success");
          else toast?.show(res.message ?? "Something went wrong.", "error");
        })
        .finally(() => {
          setIsSubmitting(false);
          router.push("../");
        });
    }
  };

  useEffect(() => {
    const eventbtn = pageview_event("Contact Us");
    save_event(redux?.auth?.authToken, location ?? "Home", [eventbtn]);
  }, []);

  return (
    <div className="contact container">
      <div
        className="checkout-header container"
        onClick={() => router.push("./account")}
      >
        <span style={{ cursor: "pointer" }}>
          <ChevronLeft className="contact-header--name" />
        </span>
        <p className="contact-header--name">{t("CONTACT_US")}</p>
      </div>

      <div className="contact-heading">
        <h3 className="contact-heading--head">{t("GET_IN_TOUCH")}</h3>
        <p className="contact-heading--desc">{t("CONTACT_DESC")}</p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <TextField
          required
          heading={t("FULL_NAME")}
          value={formData.fullName}
          onChange={(e: any) => handleChange(e, "fullName")}
          placeholder={t("ENTER_FULL_NAME")}
          error={errors.fullName}
          helperText={errors.fullName}
        />

        <TextField
          required
          heading={t("PHONE_NUMBER")}
          value={formData.phoneNumber}
          onChange={(e: any) => handleChange(e, "phoneNumber")}
          placeholder={t("ENTER_PHONE_NUMBER")}
          error={errors.phoneNumber}
          helperText={errors.phoneNumber}
          type="tel"
          maxLength={10}
        />

        <TextField
          heading={t("EMAIL")}
          value={formData.email}
          onChange={(e: any) => handleChange(e, "email")}
          placeholder={t("ENTER_EMAIL")}
          error={errors.email}
          helperText={errors.email}
        />

        <Select
          required
          heading={t("QUERY_TYPE")}
          value={formData.queryType}
          onChange={(e: any) => handleChange(e, "queryType")}
          options={queryTypes}
          error={errors.queryType}
          helperText={errors.queryType}
        />

        <Select
          heading={t("PREFERRED_TIME")}
          value={formData.preferredTime}
          onChange={(e: any) => handleChange(e, "preferredTime")}
          options={timeSlots}
          placeholder={t("SELECT_TIME_SLOT")}
        />

        <TextArea
          required
          heading={t("MESSAGE_DETAIL")}
          value={formData.message}
          onChange={(e: any) => handleChange(e, "message")}
          placeholder={t("ENTER_MESSAGE")}
          error={errors.message}
          helperText={errors.message}
        />

        <DarkBgButtonFw type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("SUBMITTING") : t("SUBMIT")}
        </DarkBgButtonFw>

        <p className="contact-reply">{t("REPLY_TIME")}</p>
      </form>
    </div>
  );
};

export default DI(ContactUs);

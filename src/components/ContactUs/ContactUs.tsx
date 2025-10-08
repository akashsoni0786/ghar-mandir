import { ChevronLeft } from "react-feather";
import "./ContactUs.css";
import ContactForm from "./ContactForm";
import { useRouter } from "next/navigation";
import useTrans from "@/customHooks/useTrans";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";

const ContactUs = ({ redux }: DIProps) => {
  const t = useTrans(redux?.common?.language);
  const router = useRouter();

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

      <ContactForm fromMessage={false}/>
    </div>
  );
};

export default DI(ContactUs);

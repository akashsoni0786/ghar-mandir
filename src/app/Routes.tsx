"use client";
import ErrorBoundary from "../services/ErrorBoundary";
import TopNavbar from "@/components/Common/Navbar";
import Footer from "../components/Common/Footer/Footer";
import Link from "next/link";
import { WhatsappColoredIcon } from "@/assets/svgs";
import { urlFetchCalls } from "@/constants/url";
import { useSelector } from "react-redux";
import { pushToDataLayer } from "@/lib/gtm";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import VideoBox from "@/components/Common/Videobox/VideoBox";
// const videoSource = new URL("../assets/video/video.mp4", import.meta.url).href;
const {
  SHARE_LINKS: { whatsapp },
} = urlFetchCalls;

export const WhatsAppContactComponent = DI(({ redux }: DIProps) => {
  const selector = useSelector((state: any) => state?.common);
  const handleWhatsAppClick = () => {
    if (typeof window !== "undefined") {
      pushToDataLayer("WhatsApp_Opted_In_Web", {
        category: "Contact",
        action: "Click",
        label: "WhatsApp Floating Button",
        user_id: redux?.auth?.mobile || redux?.auth?.mobileNo,
        mobile: redux?.auth?.mobile || redux?.auth?.mobileNo,
        user_type:
          redux?.auth?.mobile || redux?.auth?.mobileNo ? "user" : "guest",
      });
    }
  };
  return (
    <Link
      href={whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed ${
        selector?.showMobFooter?.mobFooter
          ? selector?.showMobFooter?.timeBanner
            ? "bottom-32"
            : "bottom-22"
          : "bottom-6"
      } right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors z-5`}
      aria-label="Chat on WhatsApp"
      onClick={handleWhatsAppClick}
    >
      <WhatsappColoredIcon className="whatsapp-icon" />
    </Link>
  );
});

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      {/* <Marquee content='This is Ghar Mandir's new website and belongs to the same company.'/> */}
      <TopNavbar />
      {children}
      <Footer />

      {/* WhatsApp icon */}
      <WhatsAppContactComponent />
      <VideoBox />
    </ErrorBoundary>
  );
}
export function PageWrapperWithoutFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <TopNavbar />
      {children}

      {/* WhatsApp icon */}
      <WhatsAppContactComponent />
    </ErrorBoundary>
  );
}

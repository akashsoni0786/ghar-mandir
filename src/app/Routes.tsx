"use client";
import ErrorBoundary from "../services/ErrorBoundary";
import TopNavbar from "@/components/Common/Navbar";
import Footer from "../components/Common/Footer/Footer";
import { urlFetchCalls } from "@/constants/url";
import { useSelector } from "react-redux";
import { pushToDataLayer } from "@/lib/gtm";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import VideoBox from "@/components/Common/Videobox/VideoBox";
import { useEffect, useState } from "react";
import { updateDefaultVideo, updateVideo } from "@/store/slices/commonSlice";
import Image from "next/image";
import Popup from "@/components/Common/Popup";
import ContactForm from "@/components/ContactUs/ContactForm";
import Marquee from "@/components/Common/Marqee";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { WhatsappColoredIcon } from "@/assets/svgs";
const {
  GET: { categoryPage_getHomepageVideo },
  SHARE_LINKS: { whatsapp },
} = urlFetchCalls;

// export const WhatsAppContactComponent = DI(({ redux }: DIProps) => {
//   const [showForm, setShowForm] = useState(false);
//   const selector = useSelector((state: any) => state?.common);
//   const handleWhatsAppClick = () => {
//     setShowForm(true);
//     if (typeof window !== "undefined") {
//       pushToDataLayer("WhatsApp_Opted_In_Web", {
//         category: "Contact",
//         action: "Click",
//         label: "Message Floating Button",
//         user_id: redux?.auth?.mobile || redux?.auth?.mobileNo,
//         mobile: redux?.auth?.mobile || redux?.auth?.mobileNo,
//         user_type:
//           redux?.auth?.mobile || redux?.auth?.mobileNo ? "user" : "guest",
//       });
//     }
//   };
//   return (
//     <div>
//       {showForm && (
//         <Popup
//           position="center"
//           isEscape={true}
//           closeOnOutsideClick={true}
//           onClose={() => setShowForm(false)}
//           showCloseButton={true}
//         >
//           <div
//             style={{
//               scrollBehavior: "smooth",
//               maxHeight: "80vh", // Limits height to 80% of viewport
//               overflowY: "auto", // Enables vertical scrolling
//               padding: "0 10px", // Optional: adds some padding
//             }}
//           >
//             <h2
//               style={{
//                 textAlign: "center",
//                 fontSize: "20px",
//                 fontWeight: "600",
//                 padding: "16px 0",
//               }}
//             >
//               Write your query here
//             </h2>
//             <ContactForm fromMessage={true} />
//           </div>
//         </Popup>
//       )}
//       <Image
//         src={
//           "https://d28wmhrn813hkk.cloudfront.net/uploads/1759239071624-snunee.webp"
//         }
//         alt={"message"}
//         height={50}
//         width={50}
//         style={{
//           position: "fixed",
//           bottom: selector?.showMobFooter?.mobFooter
//             ? selector?.showMobFooter?.timeBanner
//               ? "120px"
//               : "22px"
//             : "20px",
//           right: "15px",
//           cursor: "pointer",
//         }}
//         onClick={handleWhatsAppClick}
//       />
//     </div>
//   );
// });

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
interface PageWrapperProps extends DIProps {
  children: React.ReactNode;
}

export const PageWrapper = DI(
  ({ children, dispatch, request }: PageWrapperProps) => {
    const route = useRouter();
    useEffect(() => {
      const hidden = sessionStorage.getItem("video");
      if (request && hidden != "hidden") {
        request.GET(categoryPage_getHomepageVideo).then((res: any) => {
          if (res?.success) {
            if (dispatch) {
              dispatch(
                updateDefaultVideo({
                  default_videoSource: res?.data?.[0]?.video,
                  default_thumbnail: res?.data?.[0]?.image,
                })
              );
              dispatch(
                updateVideo({
                  video_data: res?.data?.[0]?.video,
                })
              );
            }
          }
        });
      }
    }, []);
    return (
      <ErrorBoundary>
        <TopNavbar />
        <Marquee
          content="Dear Devotee, please check your “Offering Videos” On My Bookings Page"
          sticky={true}
          showButton={true}
          buttonText="Click Here"
          buttonBackgroundColor="#af1e2e"
          buttonTextColor="#ffffff"
          onButtonClick={() => route.push("../bookings")}
        />
        {children}
        <Footer />
        <WhatsAppContactComponent />
        <VideoBox />
      </ErrorBoundary>
    );
  }
);

export const PageWrapperWithoutFooter = DI(
  ({ children, dispatch, request }: PageWrapperProps) => {
    const route = useRouter();
    useEffect(() => {
      const hidden = sessionStorage.getItem("video");
      if (request && hidden != "hidden") {
        request.GET(categoryPage_getHomepageVideo).then((res: any) => {
          if (res?.success && res?.data?.videoUrl) {
            if (dispatch) {
              dispatch(
                updateDefaultVideo({
                  default_videoSource: res?.data?.[0]?.video,
                  default_thumbnail: res?.data?.[0]?.image,
                })
              );
              dispatch(
                updateVideo({
                  video_data: res?.data?.[0]?.video,
                })
              );
            }
          }
        });
      }
    }, []);
    return (
      <ErrorBoundary>
        <TopNavbar />
        <Marquee
          content="Dear Devotee, please check your “Offering Videos” On My Bookings Page"
          sticky={true}
          showButton={true}
          buttonText="Click Here"
          buttonBackgroundColor="#af1e2e"
          buttonTextColor="#ffffff"
          onButtonClick={() => route.push("../bookings")}
        />

        {children}

        {/* WhatsApp icon */}
        <WhatsAppContactComponent />
      </ErrorBoundary>
    );
  }
);

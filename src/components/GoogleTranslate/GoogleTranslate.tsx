import { useEffect, useRef } from "react";
import "./GoogleTranslate.css";

declare global {
  interface Window {
    gtranslateSettings?: {
      default_language: string;
      native_language_names?: boolean;
      detect_browser_language?: boolean;
      languages?: string[];
      wrapper_selector?: string;
    };
  }
}

const GTranslatePopup = () => {
  const wrapperRef = useRef(null);
  const language_list = ["en", "hi", "mr", "gu", "kn", "ta", "bn", "te", "ml"];

  // helper: set googtrans cookie
  const setCookie = (name: string, value: string, days: number) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };

  // helper: read cookie
  const getCookie = (name: string) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en";

    if (document.getElementById("gtranslate-popup-script")) return;

    window.gtranslateSettings = {
      default_language: "en", // Google needs a base language
      native_language_names: true,
      detect_browser_language: false,
      languages: language_list,
      wrapper_selector: ".gtranslate_wrapper",
    };

    const script = document.createElement("script");
    script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
    script.id = "gtranslate-popup-script";
    script.defer = true;

    script.onload = () => {
      // ✅ Apply saved language on load
      setCookie("googtrans", `/en/${savedLang}`, 365);

      // ✅ Check for multiple dropdowns but reload only once per session
      setTimeout(() => {
        const selects = document.querySelectorAll(
          ".gtranslate_wrapper select"
        );
        if (selects.length > 1 && !sessionStorage.getItem("gt_reloaded")) {
          sessionStorage.setItem("gt_reloaded", "true"); // mark reload
          console.warn("Duplicate GTranslate dropdowns found. Reloading once.");
          // window.location.reload();
        }
      }, 1000);

      // ✅ Poll for user language change
      const intervalId = setInterval(() => {
        const cookieLang = getCookie("googtrans");
        if (!cookieLang){
          localStorage.setItem("language", 'en');
          return;}

        const parts = cookieLang.split("/");
        const currentLang = parts[2]; // /en/hi → hi

        if (currentLang && language_list.includes(currentLang)) {
          if (currentLang !== localStorage.getItem("language")) {
            localStorage.setItem("language", currentLang);
          }
        }
      }, 1500);

      // cleanup
      return () => clearInterval(intervalId);
    };

    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById("gtranslate-popup-script");
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [localStorage.getItem("language")]);

  return <div ref={wrapperRef} className="gtranslate_wrapper"></div>;
};

export default GTranslatePopup;


// "use client";

// import { Globe_Icon } from "@/assets/svgs";
// import { useEffect, useRef, useState } from "react";

// export default function GoogleTranslate() {
//   const [isOpen, setIsOpen] = useState(false);
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const initializedRef = useRef(false);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     if (initializedRef.current) return;

//     (window as any).googleTranslateElementInit = function () {
//       try {
//         new (window as any).google.translate.TranslateElement(
//           {
//             pageLanguage: "en",
//             includedLanguages: "en,hi",
//             layout: (window as any).google.translate.TranslateElement.InlineLayout.HORIZONTAL,
//           },
//           "google_translate_element"
//         );

//         // Hide banner frame with retry
//         const hideBanner = () => {
//           const banner = document.querySelector(".goog-te-banner-frame");
//           if (banner) {
//             (banner as HTMLElement).style.display = "none";
//           } else {
//             setTimeout(hideBanner, 100);
//           }
//         };
//         hideBanner();
//       } catch (error) {
//         console.error("Google Translate init error:", error);
//       }
//     };

//     if (!document.querySelector(".google-translate-script") && !(window as any).google) {
//       const script = document.createElement("script");
//       script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//       script.async = true;
//       script.className = "google-translate-script";
//       document.body.appendChild(script);
//       initializedRef.current = true;
//     }

//     return () => {
//       // Remove iframes (safely)
//       document.querySelectorAll(".goog-te-iframe, .goog-te-banner-frame").forEach((iframe) => {
//         try {
//           iframe.remove();
//         } catch (error) {
//           console.warn("Failed to remove iframe:", error);
//         }
//       });

//       // Remove the script safely
//       const script = document.querySelector(".google-translate-script");
//       if (script && script.parentNode) {
//         try {
//           if (script.parentNode.contains(script)) {
//             script.parentNode.removeChild(script);
//           } else {
//             script.remove(); // fallback
//           }
//         } catch (error) {
//           console.warn("Failed to remove script:", error);
//         }
//       }

//       // Cleanup global functions
//       try {
//         delete (window as any).googleTranslateElementInit;
//         delete (window as any).google;
//       } catch (error) {
//         console.warn("Failed to clean globals:", error);
//       }
//     };
//   }, []);

//   return (
//     <div
//       ref={wrapperRef}
//       style={{
//         position: "relative",
//         display: "inline-block",
//         fontFamily: "inherit",
//         zIndex: 1000,
//       }}
//     >
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "4px",
//           padding: "4px",
//           borderRadius: "4px",
//           border: "1px solid #e2e8f0",
//           background: "#af1e2e",
//           color: "#fff",
//           cursor: "pointer",
//           transition: "all 0.2s ease",
//           fontSize: "14px",
//           fontWeight: "500",
//           fontFamily: "inherit",
//         }}
//       >
//         <span>
//           <Globe_Icon />
//         </span>
//         <span style={{ fontSize: "12px", color: "#fff" }}>
//           {isOpen ? "▲" : "▼"}
//         </span>
//       </button>

//       <div
//         id="google_translate_element"
//         style={{
//           position: "absolute",
//           top: "100%",
//           right: "0",
//           marginTop: "8px",
//           opacity: isOpen ? 1 : 0,
//           visibility: isOpen ? "visible" : "hidden",
//           transition: "all 0.2s ease",
//           zIndex: 1000,
//           background: "white",
//           borderRadius: "4px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//           padding: "8px",
//           minWidth: "120px",
//           minHeight: "40px",
//         }}
//       />

//       <style jsx global>{`
//         .goog-te-gadget {
//           color: transparent !important;
//           font-size: 0 !important;
//         }
//         .goog-te-combo {
//           padding: 8px 32px 8px 12px !important;
//           border-radius: 4px !important;
//           border: 1px solid #e2e8f0 !important;
//           background: white url(https://translate.google.com/translate.ico) no-repeat right center !important;
//           color: #1a202c !important;
//           font-size: 14px !important;
//           cursor: pointer !important;
//           font-family: inherit !important;
//           width: 100% !important;
//           height: 36px !important;
//           appearance: none !important;
//           -webkit-appearance: none !important;
//         }
//         .goog-te-banner-frame,
//         .goog-te-menu-value,
//         .goog-te-gadget-icon {
//           display: none !important;
//         }
//         .goog-te-iframe {
//           position: absolute !important;
//           top: 0 !important;
//           left: 0 !important;
//           width: 100% !important;
//           height: 100% !important;
//         }
//       `}</style>
//     </div>
//   );
// }
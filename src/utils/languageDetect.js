export function detectLanguage() {
  // 1. Check for Facebook/Instagram URL parameter (?hl=es)
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    const socialMediaLang = urlParams.get("hl");
    if (socialMediaLang) return socialMediaLang;
  }

  // 2. Check for stored cookie (if running on client-side)
  if (typeof document !== "undefined") {
    const cookieLang = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_lang="))
      ?.split("=")[1];
    if (cookieLang) return cookieLang;
  }

  // 3. Check browser language (client-side only)
  if (typeof navigator !== "undefined") {
    const browserLang = (navigator.language || navigator.userLanguage).split(
      "-"
    )[0];
    return browserLang;
  }

  // 4. Default fallback
  return "en";
}

// Simple version without cookie check:
export function getSimpleLanguage() {
  // Client-side only
  if (typeof window === "undefined") return "en";

  // 1. Check URL param
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get("hl");
  if (urlLang) return urlLang;

  // 2. Check browser
  return (navigator.language || navigator.userLanguage).split("-")[0] || "en";
}

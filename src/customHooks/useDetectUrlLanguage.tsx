import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function useDetectUrlLanguage() {
  const pathname: any = usePathname();
  const [language, setLanguage] = useState<string>("en");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    try {
      // Extract language code from pathname (e.g., "/path__hi" → "hi")
      const parts = pathname.split("__");
      let detectedLanguage = "en"; // Default language

      if (parts.length > 1) {
        detectedLanguage = parts[parts.length - 1];
      }

      // Update local state and Redux store
      setLanguage(detectedLanguage);
      if (
        !localStorage.getItem("language") ||
        (localStorage.getItem("language") != detectedLanguage &&
          detectedLanguage != "en")
      )
        localStorage.setItem("language", detectedLanguage);
    } catch (error) {
      console.error("Error detecting language:", error);
      setLanguage("en");
      if (!localStorage.getItem("language"))
        localStorage.setItem("language", "en");
    } finally {
      setIsLoading(false);
    }
  }, [pathname]);

  return {
    language,
    isLoading,
    originalPath: pathname, // Returns the original URL path
  };
}
export default useDetectUrlLanguage;

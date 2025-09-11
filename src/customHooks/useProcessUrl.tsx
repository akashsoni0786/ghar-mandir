import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useCleanUrlRedirect(): {
  langCode: string;
  cleanPath: string;
  isLoading: boolean;
} {
  const router = useRouter();
  const pathname = usePathname();
  const [langCode, setLangCode] = useState<string>("en"); // Default to 'en'
  const [cleanPath, setCleanPath] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    try {
      const currentPath = window.location.pathname;
      const parts = currentPath.split("__");

      let detectedLangCode = "en"; // Default language

      if (parts.length > 1) {
        const newCleanPath = parts.slice(0, -1).join("__");
        detectedLangCode = parts[parts.length - 1];

        if (newCleanPath !== currentPath) {
          setCleanPath(newCleanPath);
          router.replace(newCleanPath);
        } else {
          setCleanPath(currentPath);
        }
      } else {
        setCleanPath(currentPath);
      }
      // Update local state and Redux store
      setLangCode(detectedLangCode);
      
      if (
        !localStorage.getItem("language") ||
        (localStorage.getItem("language") != detectedLangCode &&
          detectedLangCode != "en")
      )
        localStorage.setItem("language", detectedLangCode);
    } catch (error) {
      console.error("Error processing URL:", error);
      setLangCode("en");
      if (!localStorage.getItem("language"))
        localStorage.setItem("language", "en");
      setCleanPath(window.location.pathname);
    } finally {
      setIsLoading(false);
    }
  }, [pathname, router]);

  return { langCode, cleanPath, isLoading };
}

"use client"; // Required for Client Components
import FullPageLoader from "@/components/Common/Loadings/FullPageLoader";
import { encryptStorageKey, fetchCurrency } from "@/constants/commonfunctions";
import { useCleanUrlRedirect } from "@/customHooks/useProcessUrl";
import store, { persistor } from "@/store/store";
import { simpleEncrypt } from "@/utils/cryption";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const { isLoading } = useCleanUrlRedirect();
  const location = usePathname();
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/serviceworker.js")
        .then((reg) => {
          console.log("✅ Service Worker registered: ", reg);
        })
        .catch((err) => {
          console.error("❌ Service Worker registration failed: ", err);
        });
    }
  }, []);

  const setCurrency = async () => {
    try {
      const data = await fetchCurrency();
      const countryKey = encryptStorageKey("country");
      const currencyKey = encryptStorageKey("currency");

      localStorage.setItem(
        countryKey,
        simpleEncrypt(data?.countryName ?? "IN")
      );
      localStorage.setItem(currencyKey, simpleEncrypt(data?.currency ?? "INR"));
    } catch (error) {
      console.error("Failed to set currency:", error);
      // Optionally set default values on error
      const defaultKey = encryptStorageKey("currency");
      localStorage.setItem(defaultKey, simpleEncrypt("INR"));
    }
  };

  useEffect(() => {
    const currencyKey = encryptStorageKey("currency");
    const value = localStorage.getItem(currencyKey);

    if (!value) {
      setCurrency();
    }
  }, []);

  useEffect(() => {
    if (location) {
      const isCheckoutPage = location.includes("/checkout");
      document.body.style.backgroundColor = isCheckoutPage
        ? "rgb(219 219 219 / 67%)"
        : "#fff";
    }
  }, [location]);

  return isLoading ? (
    <FullPageLoader />
  ) : (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
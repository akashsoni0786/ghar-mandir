// pages/Checkout.tsx
import dynamic from "next/dynamic";

// Dynamically import the CheckoutPage component without SSR
const Checkout = dynamic(() => import("../components/Checkout/CheckoutPage"), {
  ssr: false,
  loading: () => <p>Loading Checkout...</p>, // Optional fallback
});

export default Checkout;

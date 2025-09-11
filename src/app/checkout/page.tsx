"use client";
import FullPageLoader from "@/components/Common/Loadings/FullPageLoader";
import { PageWrapperWithoutFooter } from "../Routes";
import dynamic from "next/dynamic";
const CheckoutLoader = dynamic(
  () => import("../../components/Checkout/CheckoutPage"),
  {
    loading: () => <FullPageLoader />,
    ssr: false,
  }
);
const Checkout = () => {
  return (
    <PageWrapperWithoutFooter>
      <CheckoutLoader />
    </PageWrapperWithoutFooter>
  );
};
export default Checkout;

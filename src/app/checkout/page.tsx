"use client";
import { PageWrapperWithoutFooter } from "../Routes";
import dynamic from "next/dynamic";
import CheckoutSkeleton from "@/skeletons/checkout/CheckoutSkeleton";
const CheckoutLoader = dynamic(
  () => import("../../components/Checkout/CheckoutPage"),
  {
    loading: () => <CheckoutSkeleton />,
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

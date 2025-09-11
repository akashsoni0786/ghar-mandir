"use client";
import FullPageLoader from "@/components/Common/Loadings/FullPageLoader";
import dynamic from "next/dynamic";
import { PageWrapperWithoutFooter } from "../Routes";
const PaymentConfirmation = dynamic(
  () => import("../../components/Checkout/PaymentConfirmation"),
  {
    loading: () => <FullPageLoader />,
    ssr: false,
  }
);
const Puja = () => {
  return (
    <PageWrapperWithoutFooter>
      <PaymentConfirmation />
    </PageWrapperWithoutFooter>
  );
};
export default Puja;

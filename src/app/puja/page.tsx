"use client";
import FullPageLoader from "@/components/Common/Loadings/FullPageLoader";
import dynamic from "next/dynamic";
import { PageWrapper } from "../Routes";
const PujaComponent = dynamic(
  () => import("../../components/PujaDetails/PujaListing"),
  {
    loading: () => <FullPageLoader />,
    ssr: false,
  }
);
const Puja = () => {
  return (
    <PageWrapper>
      <PujaComponent />
    </PageWrapper>
  );
};
export default Puja;

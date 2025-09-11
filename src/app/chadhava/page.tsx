"use client";
import FullPageLoader from "@/components/Common/Loadings/FullPageLoader";
import dynamic from "next/dynamic";
import { PageWrapper } from "../Routes";
const ChadhavaComponent = dynamic(
  () => import("../../components/Chadhava/ChadhavaListing"),
  {
    loading: () => <FullPageLoader />,
    ssr: false,
  }
);

const Chadhava = () => {
  return (
    <PageWrapper>
      <ChadhavaComponent />
    </PageWrapper>
  );
};
export default Chadhava;

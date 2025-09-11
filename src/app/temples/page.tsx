"use client";
import FullPageLoader from "@/components/Common/Loadings/FullPageLoader";
import dynamic from "next/dynamic";
import { PageWrapper } from "../Routes";
const TempleComponent = dynamic(
  () => import("../../components/Temple/TempleListing"),
  {
    loading: () => <FullPageLoader />,
    ssr: false,
  }
);
const Puja = () => {
  return (
    <PageWrapper>
      <TempleComponent />
    </PageWrapper>
  );
};
export default Puja;

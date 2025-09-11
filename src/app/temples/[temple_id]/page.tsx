"use client";
import { PageWrapper } from "@/app/Routes";
import FullPageLoader from "@/components/Common/Loadings/FullPageLoader";
import { resetStorage } from "@/constants/commonfunctions";
import dynamic from "next/dynamic";
import { useEffect } from "react";
const TempleViewComponent = dynamic(
  () => import("../../../components/Temple/TemplePage"),
  {
    loading: () => <FullPageLoader />,
    ssr: false,
  }
);

const TempleView = () => {
  return (
    <PageWrapper>
      <TempleViewComponent />
    </PageWrapper>
  );
};
export default TempleView;

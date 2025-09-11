"use client";
import FullPageLoader from "@/components/Common/Loadings/FullPageLoader";
import dynamic from "next/dynamic";
import { PageWrapper } from "../Routes";
const AboutComponent = dynamic(() => import("../../components/Aboutus/About"), {
  loading: () => <FullPageLoader />,
  ssr: false,
});
const AboutPage = () => {
  return (
    <PageWrapper>
      <AboutComponent />
    </PageWrapper>
  );
};
export default AboutPage;

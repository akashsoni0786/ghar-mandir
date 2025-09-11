"use client";
import FullPageLoader from "@/components/Common/Loadings/FullPageLoader";
import dynamic from "next/dynamic";
import { PageWrapper } from "../Routes";
const ContactUsComponent = dynamic(
  () => import("../../components/ContactUs/ContactUs"),
  {
    loading: () => <FullPageLoader />,
    ssr: false,
  }
);
const Page = () => {
  return (
    <PageWrapper>
      <ContactUsComponent />
    </PageWrapper>
  );
};
export default Page;

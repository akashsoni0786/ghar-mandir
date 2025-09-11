"use client";
import FullPageLoader from "@/components/Common/Loadings/FullPageLoader";
import dynamic from "next/dynamic";
import { PageWrapper } from "../Routes";
import PublicRoute from "@/Routes/PublicRoute";
const KundaliComponent = dynamic(
  () => import("../../components/Kundali/Kundali"),
  {
    loading: () => <FullPageLoader />,
    ssr: false,
  }
);
const Account = () => {
  return (
    // <PublicRoute>
      <PageWrapper>
        <KundaliComponent />
      </PageWrapper>
    // </PublicRoute>
  );
};
export default Account;

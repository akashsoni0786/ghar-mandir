"use client";
import FullPageLoader from "@/components/Common/Loadings/FullPageLoader";
import dynamic from "next/dynamic";
import { PageWrapper } from "../Routes";
import PublicRoute from "@/Routes/PublicRoute";
const AccountComponent = dynamic(
  () => import("../../components/Account/Account"),
  {
    loading: () => <FullPageLoader />,
    ssr: false,
  }
);
const Account = () => {
  return (
    <PublicRoute>
      <PageWrapper>
        <AccountComponent />
      </PageWrapper>
    </PublicRoute>
  );
};
export default Account;

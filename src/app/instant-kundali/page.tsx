"use client";
import FullPageLoader from "@/components/Common/Loadings/FullPageLoader";
import dynamic from "next/dynamic";
import { PageWrapper } from "../Routes";
import PublicRoute from "@/Routes/PublicRoute";
const KundaliComponent = dynamic(
  () => import("../../components/InstantKundali/InstantKundali"),
  {
    loading: () => <FullPageLoader />,
    ssr: false,
  }
);
const Account = () => {
  return (
    // <PublicRoute>
      <KundaliComponent />
    // </PublicRoute>
  );
};
export default Account;

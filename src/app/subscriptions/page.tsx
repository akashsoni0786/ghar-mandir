"use client";
import FullPageLoader from "@/components/Common/Loadings/FullPageLoader";
import dynamic from "next/dynamic";
import { PageWrapper } from "../Routes";
import PublicRoute from "@/Routes/PublicRoute";
const SuscriptionComponent = dynamic(
  () => import("../../components/Subscription/SubscriptionPage"),
  {
    loading: () => <FullPageLoader />,
    ssr: false,
  }
);
const Profile = () => {
  return (
    <PublicRoute>
      <PageWrapper>
        <SuscriptionComponent />
      </PageWrapper>
    </PublicRoute>
  );
};
export default Profile;

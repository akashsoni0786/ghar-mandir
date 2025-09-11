"use client";
import FullPageLoader from "@/components/Common/Loadings/FullPageLoader";
import dynamic from "next/dynamic";
import { PageWrapper } from "../Routes";
import PublicRoute from "@/Routes/PublicRoute";
const ProfileComponent = dynamic(
  () => import("../../components/Profile/Profile"),
  {
    loading: () => <FullPageLoader />,
    ssr: false,
  }
);
const Profile = () => {
  return (
    <PublicRoute>
      <PageWrapper>
        <ProfileComponent />
      </PageWrapper>
    </PublicRoute>
  );
};
export default Profile;

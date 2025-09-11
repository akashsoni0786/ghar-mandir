"use client";
import { PageWrapper } from "@/app/Routes";
import FullPageLoader from "@/components/Common/Loadings/FullPageLoader";
import dynamic from "next/dynamic";
const SubsDetailComponent = dynamic(
  () => import("../../../components/Subscription/SubscriptionDetails"),
  {
    loading: () => <FullPageLoader />,
    ssr: false,
  }
);

const Subscription = () => {
  return (
    <PageWrapper>
      <SubsDetailComponent />
    </PageWrapper>
  );
};
export default Subscription;

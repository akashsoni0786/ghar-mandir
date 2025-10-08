"use client";
import { PageWrapper } from "@/app/Routes";
import ChadhavaDetailsSkeleton from "@/skeletons/chadhava/ChadhavaDetailsSkeleton/ChadhavaDetailsSkeleton";
import dynamic from "next/dynamic";
const ChadhavaComponent = dynamic(
  () => import("../../../components/Chadhava/ChadhavaPage"),
  {
    loading: () => <ChadhavaDetailsSkeleton />,
    ssr: false,
  }
);

const Chadhava = () => {
  return (
    <PageWrapper>
      <ChadhavaComponent />
    </PageWrapper>
  );
};
export default Chadhava;

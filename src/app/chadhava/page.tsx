"use client";
import dynamic from "next/dynamic";
import { PageWrapper } from "../Routes";
import BannerSkeleton from "@/skeletons/banner/BannerSkeleton";
import ChadhavaListingSkeleton from "@/skeletons/chadhava/ChadhavaListingSkeleton/ChadhavaListingSkeleton";
const ChadhavaComponent = dynamic(
  () => import("../../components/Chadhava/ChadhavaListing"),
  {
    loading: () => (
      <div>
        <BannerSkeleton />
        <ChadhavaListingSkeleton />
      </div>
    ),
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

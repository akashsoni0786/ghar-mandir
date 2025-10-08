"use client";
import dynamic from "next/dynamic";
import { PageWrapper } from "../Routes";
import BannerSkeleton from "@/skeletons/banner/BannerSkeleton";
import PujaCategorySkeleton from "@/skeletons/puja/PujaCategorySkeleton/PujaCategorySkeleton";
const PujaComponent = dynamic(
  () => import("../../components/PujaDetails/PujaListing"),
  {
    loading: () => (
      <div>
        <BannerSkeleton />
        <PujaCategorySkeleton />
      </div>
    ),
    ssr: false,
  }
);
const Puja = () => {
  return (
    <PageWrapper>
      <PujaComponent />
    </PageWrapper>
  );
};
export default Puja;

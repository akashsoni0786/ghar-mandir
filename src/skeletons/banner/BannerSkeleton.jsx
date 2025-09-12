import React from "react";
import "./BannerSkeleton.css";
import { SkeletonBox } from "@/components/Skeletons/Skeleton";
const BannerSkeleton = () => {
  return (
    <div style={{ margin: "20px 0" }}>
      <div className="banner-carousel-container">
        <div className="banner-carousel">
          {[1, 2, 3, 4, 5]?.map((item, index) => (
            <SkeletonBox className="skeleton-carousel-box" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerSkeleton;

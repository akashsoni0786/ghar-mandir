import React from "react";
import { SkeletonBox, SkeletonLine } from "@/components/Skeletons/Skeleton";
import useWindow from "@/customHooks/useWindows";
import "../../../styles/Listing.css";
import "./ChadhavaListingSkeleton.css";
const ChadhavaListingSkeleton = () => {
  const { width } = useWindow();
  return (
    <div className="container">
      <div className="category-heading" style={{ padding: "16px" }}>
        <SkeletonLine width={width > 480 ? "30%" : "50%"} height={"35px"} />
      </div>
      <div className="category-description ph-16">
        <SkeletonLine width={"70%"} height={"10px"} />
      </div>

      <div
        className="category-description"
        style={{ padding: "16px 0", display: "block" }}
      >
        <div className="category-heading" style={{ padding: "4px 16px" }}>
          <SkeletonLine width={"200px"} height={"10px"} />
        </div>
        <div className="category-heading" style={{ padding: "4px 16px" }}>
          <SkeletonLine width={"50%"} height={"25px"} />
        </div>
      </div>
      <div className="horizontal-line-gray"></div>
      <div className="listing-result ph-16">
        <SkeletonLine width={width > 480 ? "30%" : "50%"} height={"15px"} />
      </div>

      <div className="listing-cards">
        {Array.from({ length: 15 }).map((item) => (
          <div key={item}>
            <SkeletonBox className="card-participate" height={"400px"} />
          </div>
        ))}
      </div>

      <div className="ph-1">
        <div
          style={{
            padding: width > 480 ? "40px 0" : "20px 0",
          }}
        >
          <SkeletonBox width={"100%"} height={width > 480 ? 392 : 145} />
        </div>
      </div>
    </div>
  );
};

export default ChadhavaListingSkeleton;

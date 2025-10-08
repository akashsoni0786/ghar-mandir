import React from "react";
import "../../../styles/Listing.css";
import { SkeletonBox, SkeletonLine } from "@/components/Skeletons/Skeleton";
const PujaEventSkeleton = () => {
  return (
    <div className="upcoming-events">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <SkeletonLine width={"200px"} height={"30px"} />
        <SkeletonLine width={"250px"} height={"14px"} />
      </div>
      <div className="scrollable-boxes ">
        {[1,2,3,4].map((item) => (
          <div key={item}>
            <SkeletonBox className="card-participate scrollable-boxes--child" height={"400px"} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PujaEventSkeleton;

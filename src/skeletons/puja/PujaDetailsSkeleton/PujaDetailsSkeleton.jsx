import React from "react";
import "./PujaDetailsSkeleton.css";
import {
  SkeletonAvatar,
  SkeletonBox,
  SkeletonCard,
  SkeletonLine,
  SkeletonParagraph,
} from "../../../components/Skeletons/Skeleton";
import useWindow from "@/customHooks/useWindows";
import "../../../styles/Listing.css";
import "../../../components/Common/VideoSlider/VideoSlider.css";
import MobileFooterWithButtonComponent from "@/components/Common/MobileFooterWithButtonComponent";
const PujaDetailsSkeleton = () => {
  const { width } = useWindow();
  return (
    <div>
      <div className="container">
        {/* Hero Section */}
        <div className="pujadetailsskeleton-hero">
          {<SkeletonCard className="pujadetailsskeleton-hero--img" />}
          <div className="pujadetailsskeleton-hero--data">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <SkeletonLine width={"50%"} />
              {width <= 480 && (
                <div className="pujadetailsskeleton-hero--data-rating">
                  <SkeletonLine width={"40px"} />
                  <SkeletonLine width={"20px"} />
                  <SkeletonLine width={"40px"} />
                </div>
              )}
            </div>

            <div>
              <SkeletonLine
                width={"100%"}
                height={width > 480 ? "50px" : "40px"}
              />
            </div>
            {width > 480 && (
              <div className="pujadetailsskeleton-hero--data-rating">
                <SkeletonLine width={"40px"} />
                <SkeletonLine width={"20px"} />
                <SkeletonLine width={"40px"} />
              </div>
            )}
            <div className="horizontal-line-gray" />
            <div className="pujadetailsskeleton-hero--data-rating">
              <SkeletonLine width={"10px"} height={"10px"} />
              <SkeletonLine width={"30%"} height={"10px"} />
            </div>
            <div className="pujadetailsskeleton-hero--data-rating">
              <SkeletonLine width={"10px"} height={"10px"} />
              <SkeletonLine width={"30%"} height={"10px"} />
            </div>
            <div className="horizontal-line-gray" />
            <div>
              <SkeletonLine width={"50%"} height={"20px"} />
            </div>
            <div>
              <SkeletonParagraph lines={4} lineHeight={"10px"} />
            </div>
            <div>
              <SkeletonParagraph lines={3} lineHeight={"10px"} />
            </div>
            <div>
              <SkeletonParagraph lines={5} lineHeight={"10px"} />
            </div>
          </div>
        </div>
        {/* Package Section */}

        <div className="container-box ph-1" id="package-data">
          <div style={{ padding: "16px 0" }}>
            <SkeletonLine width={width > 480 ? "30%" : "50%"} height={"30px"} />
          </div>

          <div className="package">
            <SkeletonCard className="package-box" />
            <SkeletonCard className="package-box" />
            <SkeletonCard className="package-box" />
            <SkeletonCard className="package-box" />
          </div>
          <div className="horizontal-line-gray"></div>

          <div style={{ padding: "16px 0" }}>
            <SkeletonLine width={width > 480 ? "30%" : "50%"} height={"30px"} />
          </div>

          <div className="prasad-data">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="prasad-data--box">
                <SkeletonAvatar />
                {width > 480 ? (
                  <span>
                    <div style={{ padding: "4px 0" }}>
                      <SkeletonLine width={"200px"} height={"10px"} />
                    </div>
                    <div style={{ padding: "4px 0" }}>
                      <SkeletonLine width={"100px"} height={"10px"} />
                    </div>
                  </span>
                ) : (
                  <span>
                    <div style={{ padding: "4px 0" }}>
                      <SkeletonLine width={"70px"} height={"10px"} />
                    </div>
                    <div style={{ padding: "4px 0" }}>
                      <SkeletonLine width={"70px"} height={"10px"} />
                    </div>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="horizontal-line-gray" />

        <div className="container ph-1">
          <div className="container-box">
            <div style={{ padding: "16px 0" }}>
              <SkeletonLine
                width={width > 480 ? "30%" : "50%"}
                height={"30px"}
              />
            </div>
            <div id="accordion-flush" className="accordion-flush">
              {[1, 2, 3, 4].map((item, index) => (
                <div
                  key={`${index}-body`}
                  className="accordion-item"
                  style={{
                    padding: "10px 0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <SkeletonLine width={"90%"} />
                    <SkeletonLine width={"15px"} height={"15px"} />
                  </div>

                  <div
                    className="horizontal-line"
                    style={{
                      margin: "2px 0",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {[1, 2, 3, 4].map((_) => (
          <div className="container-box ph-1">
            <SkeletonBox
              height={width > 480 ? "60px" : "40px"}
              width={"100%"}
            />
          </div>
        ))}

        <div className="container-box ph-1">
          <div className="horizontal-line-gray " />
        </div>

        <div className="container-box">
          <div style={{ padding: "16px" }}>
            <SkeletonLine width={width > 480 ? "30%" : "50%"} height={"30px"} />
          </div>
          <div className="date-temple-container">
            <div className="date-temple-cards ph-1">
              {[1, 2, 3].map((card, index) => (
                <div
                  key={index}
                  className="date-temple-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <SkeletonBox className="thumbnail-container" />
                  <SkeletonLine height={"10px"} width={"90%"} />
                  <SkeletonLine height={"10px"} width={"50%"} />
                </div>
              ))}
            </div>
          </div>
          <div className="container ph-1">
            <div className="horizontal-line-gray"></div>
          </div>
        </div>

        <div className="container-box">
          <div style={{ padding: "16px" }}>
            <SkeletonLine width={width > 480 ? "30%" : "50%"} height={"30px"} />
          </div>
          <div className="date-temple-container">
            <div className="date-temple-cards ph-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((card, index) => (
                <div key={index}>
                  <SkeletonBox height={"300px"} width={"200px"} />
                </div>
              ))}
            </div>
          </div>
          <div className="container ph-1">
            <div className="horizontal-line-gray"></div>
          </div>
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
      <MobileFooterWithButtonComponent
        right_section={<SkeletonLine width={"150px"} height={"40px"} />}
        left_section={
          <div
            className="checkout-footerbox"
            style={{ display: "flex", flexDirection: "column", gap: "6px" }}
          >
            <SkeletonLine width={"200px"} height={"15px"} />
            <SkeletonLine width={"100px"} height={"30px"} />
          </div>
        }
      />
    </div>
  );
};

export default PujaDetailsSkeleton;

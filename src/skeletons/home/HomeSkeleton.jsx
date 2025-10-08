import "./HomeSkeleton.css";
import BannerSkeleton from "../banner/BannerSkeleton";
import useWindow from "@/customHooks/useWindows";
import {
  SkeletonAvatar,
  SkeletonBox,
  SkeletonLine,
} from "@/components/Skeletons/Skeleton";
import "../../styles/Listing.css";
import PujaEventSkeleton from "../home/HomeSkeletonComponents/PujaEventSkeleton";
const HomeSkeleton = () => {
  const { width } = useWindow();
  return (
    <div>
      <BannerSkeleton />

      <div className="container ">
        {/* Why Book Us */}
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
          <div className="whybookus-container ph-mob-16">
            <div className="whybookus ">
              {[1, 2, 3, 4].map((item, idx) => (
                <div className="whybookus-item" key={idx}>
                  <SkeletonAvatar size={"5rem"} />
                  <div className="whybookus-item--data">
                    <SkeletonLine width={"70%"} height={"30px"} />
                    <SkeletonLine width={"80%"} height={"14px"} />
                    <SkeletonLine width={"90%"} height={"14px"} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="horizontal-line-gray" />
        {/* Puja & Chadhava Events */}
        <PujaEventSkeleton />
        <PujaEventSkeleton />
        {/* How it works */}
        <div className="upcoming-events ph-1">
          <div className="upcoming-events--heading">
            <SkeletonLine width={"200px"} height={"30px"} />
          </div>
          <div className="stepper-box ph-mob-16">
            <div className="stepper">
              {[1, 2, 3, 4].map((step, index) => (
                <div key={index} className="step-container">
                  <div className="step">
                    <SkeletonAvatar className="step-icon-container" />
                    <div className="step-content">
                      <div className="step-title">
                        <SkeletonLine width={"100px"} height={"20px"} />
                      </div>
                      <div className="step-description">
                        <SkeletonLine width={"150px"} height={"15px"} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="horizontal-line-gray" />
      </div>

      <div className="container ">
        {/* FAQ */}
        <div className="container ph-1">
          <div className="container-box">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <SkeletonLine width={"200px"} height={"30px"} />
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
        {/* Devotee Experience */}
        <div className="container-box">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
              padding: "16px",
            }}
          >
            <SkeletonLine width={"200px"} height={"30px"} />
          </div>
          <div className="date-temple-container">
            <div className="scrollable-boxes ph-1">
              {[1, 2, 3, 4, 5].map((card, index) => (
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
      </div>
      {/* Community  */}
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
        </div>
        <div className="community-container ph-mob-16">
          <div className="community">
            {[1, 2, 3].map((val) => (
              <div className="community-item"key={val}>
                <SkeletonAvatar size={"4rem"} />
                <SkeletonLine
                  width={width > 480 ? "150px" : width > 380 ? "80px" : "50px"}
                  height={"20px"}
                />
              </div>
            ))}
          </div>
        </div>
        <div
          className="startup-container ph-mob-16"
          style={{ marginBottom: "24px" }}
        >
          <div className="community-enterpnur">
            <SkeletonLine width={"100px"} height={"35px"} />
            <SkeletonLine width={"100px"} height={"35px"} />
            <SkeletonLine width={"100px"} height={"35px"} />
          </div>
        </div>
      </div>
      <div className="container">
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
    </div>
  );
};

export default HomeSkeleton;

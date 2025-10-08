import React from "react";
import "./CheckoutSkeleton.css";
import { SkeletonBox, SkeletonLine } from "@/components/Skeletons/Skeleton";
import MobileFooterWithButtonComponent from "@/components/Common/MobileFooterWithButtonComponent";
import useWindow from "@/customHooks/useWindows";
const CheckoutSkeleton = () => {
  const { width } = useWindow();
  const color_bg =
    "linear-gradient(90deg, rgb(255, 255, 255) 25%, rgb(204 204 204) 50%, rgb(171 171 171) 75%)";

  return (
    <div className="container ">
      <div className="checkout">
        <div className="container checkout-header">
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              router.push("../");
            }}
          >
            <SkeletonLine width={"30px"} height={"30px"} bgColor={color_bg} />
          </span>
          <SkeletonLine width={"150px"} height={"30px"} bgColor={color_bg} />
        </div>

        <div className="checkout-package">
          {[1, 2].map((val) => (
            <div key={val}>
              <SkeletonLine width={"100px"} height={"20px"} />
              <div className="checkout-package--card">
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    gap: "10px",
                    alignItems: "start",
                    justifyContent: "space-between",
                    paddingBottom: "10px",
                  }}
                >
                  <SkeletonLine width={"100%"} height={"15px"} />
                  <SkeletonLine width={"50px"} height={"15px"} />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignContent: "center",
                    gap: "10px",
                  }}
                >
                  <SkeletonLine width={"50px"} height={"15px"} />
                  <SkeletonLine width={"50px"} height={"15px"} />
                </div>
                <div className="checkout-offer--card-hr" />

                <div className="checkout-package--pricebox">
                  <div
                    style={{
                      display: "flex",
                      gap: width > 480 ? "12px" : "4px",
                      flexDirection: "column",
                    }}
                  >
                    <div className="checkout-package--templedate">
                      <SkeletonLine width={"10px"} height={"10px"} />
                      <SkeletonLine
                        width={width > 480 ? "200px" : "75px"}
                        height={"10px"}
                      />
                    </div>
                    <div className="checkout-package--templedate">
                      <SkeletonLine width={"10px"} height={"10px"} />
                      <SkeletonLine
                        width={width > 480 ? "200px" : "75px"}
                        height={"10px"}
                      />
                    </div>
                  </div>
                  <div className="checkout-package--pricebox-btns">
                    <SkeletonBox
                      className="checkout-package--pricebox-btn"
                      height={"25px"}
                      width={width > 480 ? "80px" : "40px"}
                    />
                    <SkeletonBox
                      className="checkout-package--pricebox-btn"
                      height={"25px"}
                      width={width > 480 ? "80px" : "40px"}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="checkout-userData">
          {[1, 2, 3, 4].map((val) => (
            <div className="checkout-userData--member" key={val}>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <SkeletonLine width={"150px"} height={"20px"} />
                <SkeletonLine width={"200px"} height={"10px"} />
              </div>

              <div className="checkout-userData--member-textfield checkout-userData--whatsapp-textfield">
                <SkeletonBox width={"100%"} height={"40px"} />
              </div>
            </div>
          ))}
        </div>

        <div
          className="checkout-userData--member "
          style={{
            margin: "0 16px ",
            marginBottom: width > 480 ? "100px" : "80px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <SkeletonLine width={"150px"} height={"20px"} />
            <SkeletonLine width={"200px"} height={"10px"} />
          </div>

          <div className="checkout-userData--member-address">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
              <SkeletonBox
                width={width > 480 ? "200px" : "100px"}
                height={"10px"}
              />
              <SkeletonBox width={"100%"} height={"40px"} />
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
              <SkeletonBox
                width={width > 480 ? "200px" : "100px"}
                height={"10px"}
              />
              <SkeletonBox width={"100%"} height={"40px"} />
            </div>

            <div className="divide-into-50">
              <div className="divide-into-50-item">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <SkeletonBox
                    width={width > 480 ? "200px" : "100px"}
                    height={"10px"}
                  />
                  <SkeletonBox width={"100%"} height={"40px"} />
                </div>
              </div>

              <div className="divide-into-50-item">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <SkeletonBox
                    width={width > 480 ? "200px" : "100px"}
                    height={"10px"}
                  />
                  <SkeletonBox width={"100%"} height={"40px"} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <MobileFooterWithButtonComponent
          right_section={
            <SkeletonLine
              width={width > 480 ? "150px" : "75px"}
              height={"40px"}
            />
          }
          left_section={
            <div
              className="checkout-footerbox"
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <SkeletonLine
                width={width > 480 ? "200px" : "75px"}
                height={"15px"}
              />
              <SkeletonLine
                width={width > 480 ? "70px" : "40px"}
                height={"25px"}
              />
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CheckoutSkeleton;

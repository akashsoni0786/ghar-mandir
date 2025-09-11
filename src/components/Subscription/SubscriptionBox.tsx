import React, { useEffect, useState } from "react";
import "./SubscriptionBox.css";
import { Button } from "../Common/Buttons";
import { getSign } from "@/constants/commonfunctions";
import useWindow from "@/customHooks/useWindows";
import CheckGif from "../../assets/images/check.gif";
import CheckImg from "../../assets/images/check.png";
import Image from "next/image";
interface Props {
  subscription: any;
  offering: any;
  setCheckoutPage: (e: boolean) => void;
}
const SubscriptionBox = ({
  subscription,
  offering,
  setCheckoutPage,
}: Props) => {
  const { width } = useWindow();
  const currency = getSign();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

  useEffect(() => {
    setIsFirstRender(false);
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5); // 0 = none, 1 = Day1, 2 = Day2, 3 = Day3
    }, 1500);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);
  // Immediately show first step if it's the initial render
  useEffect(() => {
    if (isFirstRender) {
      setActiveStep(1);
    }
  }, [isFirstRender]);
  // Helper function to determine what to show for each step
  const getStepContent = (stepNumber: number) => {
    if (activeStep === stepNumber) {
      return (
        <Image
          src={CheckGif}
          alt=""
          style={{ borderRadius: "50%" }}
          className="subscription-dateStep-circle"
        />
      );
    } else if (activeStep > stepNumber) {
      return (
        <Image
          src={CheckImg}
          alt=""
          style={{ borderRadius: "50%" }}
          className="subscription-dateStep-circle active"
        />
      );
    }
    return <span className="subscription-dateStep-circle"></span>;
  };

  return (
    <div className="subscription">
      <div className="subscription-details">
        <img
          className="subscription-details--img"
          src={
            offering?.image ??
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE9kLlz3dUTPuX_niSZkQJlt_WtySWi7PiSQ&s"
          }
          alt={offering?.title ?? ""}
        />
        <div className="subscription-details--data">
          <h3 className="subscription-details--data-heading">
            {offering?.title ?? ""}
          </h3>
          <p className="subscription-details--data-subheading">
            {subscription.planType ?? "Monthly Plan"}
          </p>

          <div className="subscription-details--data-price">
            <p className="subscription-details--data-price-cur">
              {currency}
              {subscription?.price ?? ""}/-
            </p>
            <p className="subscription-details--data-price-prev">
              {currency}
              {subscription?.crossprice ?? Number(subscription?.price) + 50}/-
              {/* per month */}
            </p>
          </div>
        </div>
      </div>

      <div className="subscription-dateStep">
        {[...subscription.dates, "etc"].map((date, index) => {
          if (date != "etc")
            return (
              <div key={index} className="subscription-dateStep-stepbox">
                {getStepContent(index + 1)}
                <div
                  className={`subscription-dateStep-step ${
                    activeStep >= index + 1 ? "active" : ""
                  }`}
                >
                  <p
                    className={`subscription-dateStep-step-d1 ${
                      activeStep >= index + 1 ? "active" : ""
                    }`}
                  >
                    Chadhava {index + 1}
                  </p>
                  <p
                    className={`subscription-dateStep-step-d2 ${
                      activeStep >= index + 1 ? "active" : ""
                    }`}
                  >
                    {date}
                  </p>
                </div>
              </div>
            );
          else {
            return (
              <div key={index} className="subscription-dateStep-stepbox">
                {getStepContent(index + 1)}
                <div
                  className={`subscription-dateStep-steplast ${
                    activeStep >= index + 1 ? "active" : ""
                  }`}
                >
                  <p
                    className={`subscription-dateStep-step-d1 ${
                      activeStep >= index + 1 ? "active" : ""
                    }`}
                  >
                    So on
                  </p>
                  <p
                    className={`subscription-dateStep-step-d2 ${
                      activeStep >= index + 1 ? "active" : ""
                    }`}
                  >
                    Continue
                  </p>
                </div>
              </div>
            );
          }
        })}
      </div>

      <div className="subscription-planData">
        {subscription.description && subscription.description.length > 0 && (
          <div className="subscription-planData--details">
            <h4 className="subscription-planData--details-head">
              {subscription.planTopText ?? "Plan Details"}
            </h4>
            <ul className="subscription-planData--details-list">
              {subscription.description.map((desc: string, idx: number) => {
                return (
                  <li
                    key={idx}
                    className="subscription-planData--details-list-item"
                  >
                    • {desc}
                  </li>
                );
              })}
            </ul>

            <h6 className="subscription-planData--details-footer">
              {subscription.planBottomText ??
                "🕉️ Let your devotion be Nirantar — steady, sacred, and seamless"}
            </h6>
          </div>
        )}

        <div className="subscription-planData-btn">
          <Button
            size={width > 480 ? "medium" : "small"}
            onClick={() => setCheckoutPage(true)}
          >
            Select
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBox;

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "react-feather";
import "../Bookings/ViewBooking.css"; // Assuming you have a CSS file for styling
import SliderImgBox from "../Common/SliderImgbox";
import { GharmandirRed_Logo, TempleIcon } from "@/assets/svgs";
import { useEffect, useState } from "react";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import FullPageLoader from "../Common/Loadings/FullPageLoader";
import { pageview_event, save_event } from "@/constants/eventlogfunctions";
import ZeroResponse from "../NoDataComponents/ZeroResponse";
import useTrans from "@/customHooks/useTrans";
import StatusBox from "../Bookings/StatusBox";
import SubscriptionStepData from "./SubscriptionStepData";
import { Spinner } from "../Common/Loadings/Spinner";
import { formatTimestampToReadableDate } from "@/constants/commonfunctions";

const SubscriptionDetails = ({ redux, location, toast }: DIProps) => {
  const t = useTrans(redux?.common?.language);
  const subscriptionData = redux?.common?.subscriptionData;
  const params = useParams();
  const router: any = useRouter();
  const [loadings, setLoadings] = useState<any>({});
  const subscription_id: any = params?.subscription_id;
  useEffect(() => {
    if (subscription_id && subscriptionData) {
      const eventbtn = pageview_event("View subscription", {
        additionalData: subscriptionData ?? {},
      });
      save_event(redux?.auth?.authToken, location ?? "View subscription", [
        eventbtn,
      ]);
    }
  }, [subscription_id, subscriptionData]);
  return false ? (
    <FullPageLoader />
  ) : (
    <>
      {subscription_id && subscriptionData ? (
        <div className="booking-view container">
          <div className="container checkout-header">
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                router.push("../subscriptions");
              }}
            >
              <ChevronLeft className="booking-header--name" />
            </span>
          </div>

          <div className="booking-view--hero  ph-16">
            <div className="booking-view--hero-image">
              <SliderImgBox
                images={
                  subscriptionData?.product?.images?.length
                    ? subscriptionData?.product?.images
                    : [
                        "https://c4.wallpaperflare.com/wallpaper/741/711/759/krishna-hindu-gods-bhagwan-vishnu-narayan-hd-wallpaper-preview.jpg",
                      ]
                }
              />
            </div>
            <div className="booking-view--hero-details">
              <div className="flex-row-box btw">
                <p className="booking-view--hero-heading">
                  {subscriptionData?.product?.heading}
                </p>
                <span className="booking-view--hero-status">
                  <StatusBox status={subscriptionData?.status} />
                </span>
              </div>
              <div className="flex-row-box align-center">
                <TempleIcon />
                <p className="booking-view--hero-templename">
                  {subscriptionData?.product?.poojaTemple}
                </p>
              </div>
              <div className="horizontal-line-gray" />
              <p className="booking-view--hero-type">Your Subscription</p>
              <div className="booking-view--hero-card">
                {/* <p className="booking-view--hero-card-name">
                  {subscriptionData?.subscription?.planType}
                </p> */}
                {subscriptionData?.userName &&
                  subscriptionData?.userName != "" && (
                    <p className="booking-view--hero-card-data">
                      <span>Sankalp for :</span> {subscriptionData?.userName}
                    </p>
                  )}
                <p className="booking-view--hero-card-data">
                  <span>{t("PACKAGE")}:</span> (
                  {subscriptionData?.subscription?.planType}){" "}
                </p>

                {/* <div className="horizontal-line-gray" /> */}
                {subscriptionData?.gotra && subscriptionData?.gotra != "" && (
                  <p className="booking-view--hero-card-data">
                    <span>{t("GOTRA")}:</span> {subscriptionData?.gotra}
                  </p>
                )}
                {subscriptionData?.createdAt?.timestamp &&
                  subscriptionData?.createdAt?.timestamp != "" && (
                    <p className="booking-view--hero-card-data">
                      <span>Order Date:</span>{" "}
                      {formatTimestampToReadableDate(
                        subscriptionData?.createdAt?.timestamp
                      )}
                    </p>
                  )}
                {subscriptionData?.subscription?.subscriptionId &&
                  subscriptionData?.subscription?.subscriptionId != "" && (
                    <p className="booking-view--hero-card-data">
                      <span>Subscription Id:</span>{" "}
                      {subscriptionData?.subscription?.subscriptionId}
                    </p>
                  )}
              </div>
            </div>
          </div>

          <SubscriptionStepData data={subscriptionData} />

          <div className="horizontal-line-gray" />

          <div className="booking-view--actions ph-16">
            <div
              className="booking-view--actions-invoice booking-view--actions-contact"
              onClick={() => {
                setLoadings((prev: any) => ({
                  ...prev,
                  contact: true,
                }));
                router.push("../contact-us");
              }}
            >
              <div className="data-flex">
                <span>
                  <GharmandirRed_Logo />
                </span>
                <label className="btn-label btn-label-contact ">
                  {t("CONTACT_US")}
                </label>
              </div>
              {loadings.contact && <Spinner size="large" />}
            </div>
          </div>
        </div>
      ) : (
        <ZeroResponse value={"Subscription Data"} />
      )}
    </>
  );
};
export default DI(SubscriptionDetails);

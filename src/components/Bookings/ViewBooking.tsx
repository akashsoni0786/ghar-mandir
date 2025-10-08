import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "react-feather";
import "./ViewBooking.css"; // Assuming you have a CSS file for styling
import SliderImgBox from "../Common/SliderImgbox";
import { GharmandirRed_Logo, TempleIcon } from "@/assets/svgs";
import ActiveBooking from "./ActiveBooking";
import { Spinner } from "../Common/Loadings/Spinner";
import { useEffect, useState } from "react";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import { urlFetchCalls } from "@/constants/url";
import {
  capitalizeWord,
  chadhavaSpell,
  extractIdsAdvanced,
} from "@/constants/commonfunctions";
import Stepper from "../Common/Stepper/Stepper";
import FullPageLoader from "../Common/Loadings/FullPageLoader";
import { pageview_event, save_event } from "@/constants/eventlogfunctions";
import ZeroResponse from "../NoDataComponents/ZeroResponse";
import useTrans from "@/customHooks/useTrans";
import BookingReview from "../ReviewPage/BookingReview";
import { updateVideo } from "@/store/slices/commonSlice";
const {
  POST: { bookings_getBookingsById },
} = urlFetchCalls;
const ViewBooking = ({
  request,
  redux,
  location,
  toast,
  dispatch,
}: DIProps) => {
  const t = useTrans(redux?.common?.language);
  const [show, setShow] = useState(false);
  const router = useRouter();
  const params = useParams();
  const [loadings, setLoadings] = useState({ download: false, contact: false });
  const booking_id: any = params?.booking_id;
  const [packagedata, setPackagedata] = useState<any>(undefined);
  const [loading, setLoading] = useState(false);
  const fetchData = () => {
    if (booking_id) {
      setLoading(true);
      request
        ?.POST(bookings_getBookingsById, {
          ...extractIdsAdvanced(booking_id),
          userId: redux?.auth?.authToken ?? "",
        })
        .then((res: any) => {
          if (res.success) {
            setPackagedata(res?.data ?? {});
            if (
              res?.data?.userFeedback &&
              Object.keys(res?.data?.userFeedback ?? {}).length > 0
            ) {
              setShow(true);
            }
            const eventbtn = pageview_event("View Bookings", {
              additionalData: res?.data ?? {},
            });
            save_event(redux?.auth?.authToken, location ?? "View Bookings", [
              eventbtn,
            ]);
          } else toast?.show("No booking found!", "error");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  if (dispatch) {
    dispatch(
      updateVideo({
        video_data: undefined,
      })
    );
  }
  useEffect(() => {
    if (booking_id) {
      fetchData();
    } else {
      setPackagedata(undefined);
      setLoading(false);
    }
  }, [booking_id]);
  return loading ? (
    <FullPageLoader />
  ) : (
    <>
      {packagedata ? (
        <div className="booking-view container">
          <div className="container checkout-header">
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                router.push("../bookings");
              }}
            >
              <ChevronLeft className="booking-header--name" />
            </span>
            {/* <div style={{ paddingRight: "16px" }}>
              <AlertBox type="warning">
                <p style={{ fontWeight: "600", fontSize: "12px" }}>
                  {`📌 ${t("IMP_NOTICE")}`}
                </p>
              </AlertBox>
            </div> */}
          </div>

          <div className="booking-view--hero  ph-16">
            <div className="booking-view--hero-image">
              <SliderImgBox
                images={
                  packagedata?.images?.length
                    ? packagedata?.images
                    : [
                        "https://c4.wallpaperflare.com/wallpaper/741/711/759/krishna-hindu-gods-bhagwan-vishnu-narayan-hd-wallpaper-preview.jpg",
                      ]
                }
              />
            </div>
            <div className="booking-view--hero-details">
              <div className="flex-row-box btw">
                <p className="booking-view--hero-heading">{packagedata.name}</p>
                {/* <span className="booking-view--hero-status">
                  <StatusBox
                    status={isDateInPast(packagedata.date) ? "Completed" : "Active"}
                  />
                </span> */}
              </div>
              <div className="flex-row-box align-center">
                <TempleIcon />
                <p className="booking-view--hero-templename">
                  {packagedata?.temple}
                </p>
              </div>
              <div className="horizontal-line-gray" />
              <p className="booking-view--hero-type">
                Your {capitalizeWord(chadhavaSpell(packagedata.type))}
              </p>
              <div className="booking-view--hero-card">
                <p className="booking-view--hero-card-name">
                  {packagedata.desc}
                </p>
                {packagedata.family_package &&
                  packagedata.family_package != "" && (
                    <p className="booking-view--hero-card-data">
                      <span>{t("PACKAGE")}:</span> ({packagedata.family_package}
                      ){" "}
                    </p>
                  )}
                {packagedata.addons && (
                  <p className="booking-view--hero-card-data">
                    <span>{t("AD_ONS")}:</span> {packagedata.addons}
                  </p>
                )}

                {packagedata.addons ||
                (packagedata.family_package &&
                  packagedata.family_package != "") ? (
                  <div className="horizontal-line-gray" />
                ) : (
                  <></>
                )}

                {packagedata.date && (
                  <p className="booking-view--hero-card-data">
                    <span>{t("DATE")}:</span> {packagedata.date}
                  </p>
                )}
                {packagedata.time && (
                  <p className="booking-view--hero-card-data">
                    <span>{t("TIME")}:</span> {packagedata.time}
                  </p>
                )}
                {packagedata.tithi && (
                  <p className="booking-view--hero-card-data">
                    <span>{t("TITHI")}:</span> {packagedata.tithi}
                  </p>
                )}
                {packagedata.userName && (
                  <p className="booking-view--hero-card-data">
                    <span>{"Your Name"}:</span> {packagedata.userName}
                  </p>
                )}
              </div>

              {booking_id == "Active" && (
                <p className="booking-view--hero-footer">
                  *{t("PRASAD_WILL_DISPATCH_ONCE_PUJA_DONE")}
                </p>
              )}
            </div>
          </div>
          <ActiveBooking data={packagedata} />
          {packagedata?.order_status && (
            <div className="horizontal-line-gray" />
          )}
          {packagedata?.order_status && (
            <div className="booking-view--box ph-16">
              <h3 className="booking-view--box-heading">
                {t("TRACK_YOUR_PRASAD")}
              </h3>
              <div className="booking-view--box-content">
                <Stepper steps={packagedata?.order_status} />
              </div>
            </div>
          )}

          <div className="booking-view--box ph-16">
            <h3 className="booking-view--box-heading">
              {!show ? "Add Review" : "Reviews & Ratings"}
            </h3>
            <BookingReview
              show={show}
              setShow={setShow}
              paramData={extractIdsAdvanced(booking_id)}
              reviewData={packagedata?.userFeedback}
              reloadPage={fetchData}
            />
          </div>
          {/* {packagedata?.pandit_list?.panditName && (
            <div className="booking-view--box ph-16">
              <h3 className="booking-view--box-heading">
                {t("PUJA_WILL_PERFORM_BY")}
              </h3>
              <div className="booking-view--box-content">
                <DetailPanditCard
                  imageSrc={packagedata?.pandit_list?.imageSrc}
                  title={packagedata?.pandit_list?.title}
                  subtitle={packagedata?.pandit_list?.templeName}
                  description={packagedata?.pandit_list?.panditDescription}
                />
              </div>
            </div>
          )} */}
          <div className="booking-view--actions ph-16">
            {/* <div
          className="booking-view--actions-invoice"
          onClick={() => {
            setLoadings((prev: any) => ({
              ...prev,
              download: true,
            }));
          }}
        >
          <div className="data-flex">
            <span>
              <File />
            </span>
            <label className="btn-label">Download Invoice</label>
          </div>
          {loadings.download && <Spinner size="large" />}
        </div> */}
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
        <ZeroResponse value={"Booking Data"} />
      )}
    </>
  );
};
export default DI(ViewBooking);

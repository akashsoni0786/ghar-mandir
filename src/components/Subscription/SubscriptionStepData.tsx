import useWindow from "@/customHooks/useWindows";
import "../Bookings/ViewBooking.css";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import VideoPlayer from "../Common/VideoSlider/VideoPlayer";
import "./SubscriptionDetails.css";
import Badge from "../Common/Badge";
interface Props extends DIProps {
  data: any;
}

const SubscriptionStepData = ({ data }: Props) => {
  const { width } = useWindow();
  const currency = "₹";
  const uncheck = (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "50%",
        border: "1px solid #999999 ",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width > 480 ? "24" : "18"}
        height={width > 480 ? "24" : "18"}
        viewBox={"0 0 42 42"}
        fill="none"
      >
        <circle
          cx="21"
          cy="21"
          r="16.5"
          fill="white"
          stroke="#999999"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
  const check = (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "50%",
        border: "1px solid #5BA61A",
      }}
    >
      <svg
        width={width > 480 ? "24" : "18"}
        height={width > 480 ? "24" : "18"}
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17 3.83989C18.5083 4.71075 19.7629 5.96042 20.6398 7.46519C21.5167 8.96997 21.9854 10.6777 21.9994 12.4192C22.0135 14.1608 21.5725 15.8758 20.72 17.3946C19.8676 18.9133 18.6332 20.1831 17.1392 21.0782C15.6452 21.9733 13.9434 22.4627 12.2021 22.498C10.4608 22.5332 8.74055 22.1131 7.21155 21.2791C5.68256 20.4452 4.39787 19.2264 3.48467 17.7434C2.57146 16.2604 2.06141 14.5646 2.005 12.8239L2 12.4999L2.005 12.1759C2.061 10.4489 2.56355 8.76585 3.46364 7.29089C4.36373 5.81592 5.63065 4.59934 7.14089 3.75977C8.65113 2.92021 10.3531 2.48629 12.081 2.50033C13.8089 2.51437 15.5036 2.97589 17 3.83989ZM15.707 9.79289C15.5348 9.62072 15.3057 9.51729 15.0627 9.502C14.8197 9.48672 14.5794 9.56064 14.387 9.70989L14.293 9.79289L11 13.0849L9.707 11.7929L9.613 11.7099C9.42058 11.5607 9.18037 11.4869 8.9374 11.5022C8.69444 11.5176 8.46541 11.621 8.29326 11.7932C8.12112 11.9653 8.01768 12.1943 8.00235 12.4373C7.98702 12.6803 8.06086 12.9205 8.21 13.1129L8.293 13.2069L10.293 15.2069L10.387 15.2899C10.5624 15.426 10.778 15.4998 11 15.4998C11.222 15.4998 11.4376 15.426 11.613 15.2899L11.707 15.2069L15.707 11.2069L15.79 11.1129C15.9393 10.9205 16.0132 10.6802 15.9979 10.4372C15.9826 10.1942 15.8792 9.96509 15.707 9.79289Z"
          fill="#5BA61A"
        />
      </svg>
    </div>
  );
  const ongoing = (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "50%",
        border: "1px solid #FDCB58",
      }}
    >
      <div
        style={{
          backgroundColor: "#FDCB58",
          padding: width > 480 ? "10px" : "8px",
          borderRadius: "50%",
          margin: "2px",
        }}
      ></div>
    </div>
  );

  const statusComponent = (value: string) => {
    if (value == "COMPLETED") return check;
    else if (value == "ONGOING") return ongoing;
    else return uncheck;
  };

  const statusClass = (status: string, last: boolean) => {
    if (last) return "booking-status-step-goon";
    if (status == "COMPLETED") return "booking-status-step-done";
    else if (status == "ONGOING") return "booking-status-step-ongoing";
    else return "booking-status-step-notdone";
  };

  const statusType = (status: string) => {
    if (status == "COMPLETED") return "success";
    else if (status == "ONGOING") return "warning";
    else return "error";
  };
  return (
    <div>
      <div className="horizontal-line-gray ph-16" />
      {data?.subscription && (
        <div className="subscription-data ph-16">
          <img
            className="subscription-data--img"
            src={
              data?.subscription?.image
                ? data?.subscription?.image
                : "https://ih1.redbubble.net/image.4905811447.8675/flat,750x,075,f-pad,750x1000,f8f8f8.jpg"
            }
            alt="chadhava-img"
          />
          <div className="subscription-data--details">
            <p className="subscription-data--details-name">
              {data?.subscription?.planName}{" "}
            </p>
            <p className="subscription-data--details-price">
              {currency}
              {data?.subscription?.price}/-
            </p>
            <p className="subscription-data--details-price">
              Plan Type : {data?.subscription?.planType}
            </p>
            {/* <p className="subscription-data--details-price">Other details</p> */}
          </div>
        </div>
      )}
      <div className="horizontal-line-gray ph-16" />

      {data?.subscription?.dates?.length > 0 && (
        <div className="booking-completed subscription-steps">
          {data?.subscription?.dates?.map((item, idx) => {
            const last = data?.subscription?.dates?.length - 1 == idx;
            return (
              <div key={idx} className="booking-status-wrap">
                <span className="booking-view--box-check">
                  {statusComponent(item?.status)}
                </span>
                <div
                  className={`booking-status-step ${statusClass(
                    item?.status,
                    last
                  )}`}
                >
                  <h3 className="booking-view--box-heading-step">
                    {`Chadhava ${idx + 1}`}{" "}
                    <p style={{ fontWeight: "400", fontSize: "12px" }}>
                      ({item?.date}){" "}
                    </p>
                    <Badge variant={statusType(item?.status)} size="small">
                      {item?.status}
                    </Badge>
                  </h3>
                  {item?.videoThumbnail && item?.videoUrl && (
                    <div className="booking-view--box-content">
                      <VideoPlayer
                        devineExperience={{
                          videoThumbnail: item?.videoThumbnail,
                          videoUrl: item?.videoUrl,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="booking-status-wrap">
            <span className="booking-view--box-check">
              {data?.poojaCompleteVideo ? check : uncheck}
            </span>
            <div>
              <h3
                className="booking-view--box-heading-step"
                style={{ color: "gray" }}
              >
                {"More blessings on the way"}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DI(SubscriptionStepData);

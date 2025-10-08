import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DarkBgButtonFw } from "../Common/Buttons";
import { updateOrderData } from "@/store/slices/orderSlice";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import { updateTotalAmount } from "@/store/slices/checkoutSlice";
import { transactionIdUpdate } from "@/store/slices/commonSlice";
import FullPageLoader from "../Common/Loadings/FullPageLoader";
import { getSign } from "@/constants/commonfunctions";
import { pageview_event, save_event } from "@/constants/eventlogfunctions";
interface PaymentConfirmationProps extends DIProps {
  phoneNumber?: string;
  userName?: string;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  dispatch,
  redux,
}) => {
  const currency = getSign();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  window.addEventListener("popstate", function (event) {
    if (dispatch) {
      dispatch(updateOrderData({ order_data: {} }));
      dispatch(transactionIdUpdate({ transactionId: "" }));
      dispatch(updateTotalAmount({ total_amount: 0 }));
    }
  });
  // async function trackPurchase(order_id: string) {
  //   const { _fbp, _fbc } = getFacebookCookies();
  //   const session = createSessionManager({
  //     inactivityTimeout: 15 * 60 * 1000,
  //   });
  //   const params = {
  //     sessionId: session.getSessionId(),
  //     userId: redux.auth.authToken ?? "N/A",
  //     sessionStartTime: session.getSessionStartDateTime(),
  //     device: getDeviceInfo(),
  //     browser: getBrowserInfo(),
  //     network: getNetworkInfo(),
  //     location: getLocationInfo(),
  //     utm: utm_obj(),
  //     eventName: "Purchase",
  //     fbp: _fbp,
  //     fbc: _fbc,
  //     emails: [""],
  //     phones: [hash_create(redux.auth.mobile)],
  //     clientIp: redux?.common?.ipaddress ?? '',
  //     value: redux?.checkout?.total_amount,
  //     currency: "inr",
  //     eventUrl: window.location.href,
  //     order_data: {
  //       order_id: order_id,
  //     },eventID:hash_create(order_id)
  //   };
  //   if (request) request.POST(meta_metaPixel, params);
  // }

  useEffect(() => {
    if (
      redux.order.order_data?.order_id &&
      redux?.common?.transactionId?.paymentId &&
      redux?.common?.transactionId?.paymentId != "" &&
      Object.keys(data)?.length == 0
    ) {
      const response: any = redux.order.order_data;
      const amount: any = redux?.checkout?.total_amount;

      setData({
        Name: redux.auth.username ?? "-",
        "Mobile No.": `${redux.auth.countryCode} ${redux.auth.mobile}`,
        Gotra: response.gotra_not_know
          ? "Not Known"
          : response.gotra == ""
          ? "Not Known"
          : response.gotra,
        "Order Id": response?.order_id, // This would come from your backend
        Status:
          redux?.common?.transactionId?.paypalPaymentStatus == "NA"
            ? redux?.common?.transactionId?.razorpayPaymentStatus
            : redux?.common?.transactionId?.paypalPaymentStatus,
        "Transaction Id":
          redux?.common?.transactionId?.paymentId ?? "Not generated",
        Date: new Date().toLocaleString(),
        "Total amount": currency + "" + amount,
      });
      // trackPurchase(response?.order_id);
    } else {
      router.push("../bookings");
    }
    const eventParams = pageview_event("Payment Confirmation", {
      order_id: redux.order.order_data?.order_id ?? "",
      userId: redux?.auth?.authToken ?? "",
    });
    save_event(redux?.auth?.authToken, "Payment Confirmation", [eventParams]);
  }, [redux.order.order_data, redux?.common?.transactionId]);

  return redux.order.order_data?.order_id ? (
    <div className="confirmation-container">
      <div>
        <div className="confirmation-header">
          <svg className="confirmation-icon" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
            />
          </svg>
          <h1>Payment Successful!</h1>
          <p>Thank you for offering your Seva.</p>
        </div>

        <div className="confirmation-details">
          {Object.keys(data).map((item: any) => {
            return (
              <div className="detail-row" key={item} translate="no">
                <span className="detail-label" translate="no">
                  {item}
                </span>
                <span className="detail-value" translate="no">
                  {data[item]}
                </span>
              </div>
            );
          })}
        </div>

        {/* <button
          className="continue-button"
          onClick={() => {
            // router.push(`/puja`);
            setLoading(true);
          }}
        >
          Continue to Puja
        </button> */}
        <DarkBgButtonFw
          onClick={() => {
            setLoading(true);
            // router.push(`/puja`);
            if (dispatch) {
              dispatch(updateOrderData({ order_data: {} }));
              dispatch(transactionIdUpdate({ transactionId: "" }));
              dispatch(updateTotalAmount({ total_amount: 0 }));
            }
            router.push("../bookings");
            // window.location.href = "https://gharmandir.in/";
          }}
          children="See Bookings"
          isLoading={loading}
        />
      </div>

      <style jsx>{`
        .confirmation-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 91.25vh;
          background-color: #f5f7fa;
          padding: 16px 0;
          width: 100%;
        }

        .confirmation-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 40px;
          max-width: 500px;
          width: 100%;
          text-align: center;
        }

        .confirmation-header {
          display: flex;
          flex-direction: column;
          align-items: center;

          margin-bottom: 30px;
          text-align: center;
        }

        .confirmation-icon {
          width: 80px;
          height: 80px;
          color: #10b981;
          margin-bottom: 20px;
        }

        .confirmation-header h1 {
          font-size: 28px;
          color: #2d3748;
          margin-bottom: 8px;
        }

        .confirmation-header p {
          color: #718096;
          font-size: 16px;
        }

        .confirmation-details {
          text-align: left;
          // margin-bottom: 30px;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          text-align:end;
        }

        .detail-label {
          color: #718096;
          font-weight: 500;
          white-space: wrap;
          word-wrap: break-word;
          max-width:50%;
          text-align:start;
        }

        .detail-value {
          color: #2d3748;
          font-weight: 600;
          white-space: wrap;
         word-wrap: break-word;
          max-width:50%;
          text:align:left;
        }

        .continue-button {
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          width: 100%;
          transition: var(--primary-color) 0.3s;
        }

        .continue-button:hover {
          background-color: var(--primary-color);
        }

        @media (max-width: 600px) {
          .confirmation-card {
            padding: 30px 20px;
          }

          .confirmation-header h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  ) : (
    <FullPageLoader />
  );
};

export default DI(PaymentConfirmation);

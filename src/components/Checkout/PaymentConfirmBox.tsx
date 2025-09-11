import React, { useEffect, useState } from "react";
import { DarkBgButtonFw } from "../Common/Buttons";
import LoadingSpinner from "../Common/Loadings/LoadingSpinner";
import { useRouter } from "next/navigation";
interface Props {
  alldata: any;
  onClose?: () => void;
}

const PaymentConfirmationBox = ({ alldata, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const router = useRouter();
  useEffect(() => {
    if (alldata) {
      const reqData = [
        "Mobile No.",
        "Name",
        "Gotra",
        "price",
        "Date",
        "planName",
        "Subscription Id",
      ];
      const tempOj = {};

      Object.keys(alldata).forEach((key) => {
        if (reqData.includes(key)) {
          tempOj[key] = alldata[key];
        }
      });
      setData(tempOj);
    } else {
      setLoading(true);
    }
  }, [alldata]);

  const handleRedirect = () => {
    setLoading(true);
    if (onClose) {
      router.push("/subscriptions");
      onClose();
    }
  };
  const formatLabel = (label: string) => {
    return label
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/(\b(?:Id|Otp|Url)\b)/gi, (match) => match.toUpperCase());
  };

  if (!alldata) {
    return (
      <div className="box-loader">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <div className="payment-confirmation-card">
        <div className="confirmation-header">
          <div className="confirmation-icon-container">
            <svg className="confirmation-icon" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
              />
            </svg>
          </div>
          <h1 className="confirmation-title">Payment Successful!</h1>
          <p className="confirmation-subtitle">
            Subscription for <b>{` ${alldata.planName} `}</b> has been activated
          </p>
        </div>

        <div className="confirmation-details">
          {Object.keys(data).map((item: string) => {
            if (typeof data[item] === "object" || data[item] === undefined)
              return null;

            return (
              <div className="detail-row" key={item} translate="no">
                <span className="detail-label" translate="no">{formatLabel(item)}</span>
                <span className="detail-value" translate="no">
                  {item.toLowerCase().includes("amount") ||
                  item.toLowerCase().includes("price")
                    ? `₹${data[item]}/-`
                    : data[item]}
                </span>
              </div>
            );
          })}
        </div>

        <div className="confirmation-actions">
          <DarkBgButtonFw
            onClick={handleRedirect}
            isLoading={loading}
            disabled={loading}
          >
            Go to Your Subscriptions
          </DarkBgButtonFw>
        </div>
      </div>

      <style jsx>{`
        .payment-confirmation-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f8fafc;
          padding: 2rem 1rem;
        }

        .payment-confirmation-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 2rem;
          max-width: 100%;
          width: 100%;
          text-align: center;
          transition: all 0.3s ease;
        }

        .confirmation-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .confirmation-icon-container {
          width: 6rem;
          height: 6rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f0fdf4;
          border-radius: 50%;
          margin-bottom: 1.5rem;
          20px 20px 4px 20px;
        }

        .confirmation-icon {
          width: 3.5rem;
          height: 3.5rem;
          color: #10b981;
        }

        .confirmation-title {
          font-size: 1.5rem;
          color: #1e293b;
          margin-bottom: 0.5rem;
          font-weight: 600;
          line-height: 12px;
        }

        .confirmation-subtitle {
          color: #64748b;
          font-size: 1rem;
          margin-bottom: 0;
        }

        .confirmation-details {
          text-align: left;
          border-top: 1px solid #e2e8f0;
          padding-top: 1rem;
          margin-bottom: 2rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          align-items: flex-start;
        }

        .detail-label {
          color: #64748b;
          font-weight: 500;
          font-size: 0.875rem;
          flex: 1;
          text-align: left;
          padding-right: 1rem;
        }

        .detail-value {
          color: #1e293b;
          font-weight: 600;
          font-size: 0.875rem;
          flex: 1;
          text-align: right;
          word-break: break-word;
        }

        .confirmation-actions {
          margin-top: 1.5rem;
        }

        @media (max-width: 640px) {
          .payment-confirmation-card {
            padding: 1.5rem;
          }

          .confirmation-title {
            font-size: 1rem;
          }
            .confirmation-subtitle {
          font-size: .75rem;
        }

          .confirmation-icon-container {
            width: 4rem;
            height: 4rem;
          }

          .confirmation-icon {
            width: 2rem;
            height: 2rem;
          }
        }

        @media (max-width: 480px) {
          .payment-confirmation-container {
            padding: 1rem;
          }

          .detail-row {
            // flex-direction: column;
            gap: 0.25rem;
          }

          // .detail-label,
          // .detail-value {
          //   text-align: left;
          //   width: 100%;
          // }
        }
      `}</style>
    </div>
  );
};

export default PaymentConfirmationBox;

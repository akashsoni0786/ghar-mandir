import React from "react";
import GPayIcon  from "../../assets/svg_files/gpay.svg";
import PaytmIcon from "../../assets/svg_files/paytm.svg";
import PayPalIcon from "../../assets/svg_files/phonepe.svg";
// import { ReactComponent as UpiIcon } from "./upi.svg";
// import { ReactComponent as PhonePeIcon } from "./phonepe.svg";

type PaymentProvider = "gpay" | "paytm" | "paypal" | "upi" | "phonepe";

interface PaymentButtonProps {
  text: string;
  provider: PaymentProvider;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  text,
  provider,
  onClick,
  className = "",
  disabled = false,
  isLoading = false,
}) => {
  const getProviderIcon = () => {
    switch (provider) {
      case "gpay":
        return <GPayIcon className="payment-icon" />;
      case "paytm":
        return <PaytmIcon className="payment-icon" />;
      case "paypal":
        return <PayPalIcon className="payment-icon" />;
    //   case "upi":
    //     return <UpiIcon className="payment-icon" />;
    //   case "phonepe":
    //     return <PhonePeIcon className="payment-icon" />;
    //   default:
    //     return <UpiIcon className="payment-icon" />;
    }
  };

  return (
    <button
      className={`payment-button ${className} ${isLoading ? "loading" : ""}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      <span className="payment-button-content">
        <span className="payment-text">{text}</span>
        <span className="payment-icon-container">
          {isLoading ? (
            <div className="payment-loader" />
          ) : (
            getProviderIcon()
          )}
        </span>
      </span>
    </button>
  );
};



export default PaymentButton;
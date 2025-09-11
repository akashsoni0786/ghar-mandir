import React from "react";
import "./SubscriptionLabel.css";

const SubscriptionLabel = ({ onClick, subscriptionLabel }: any) => {
  return (
    <div className="fire-box" onClick={onClick}>
      <div className="fire"></div>
      <div className="content-label">
        <p>{subscriptionLabel ?? "Want to start nirantar chadhava!"}</p>
        <button onClick={onClick}>Click</button>
      </div>
    </div>
  );
};

export default SubscriptionLabel;

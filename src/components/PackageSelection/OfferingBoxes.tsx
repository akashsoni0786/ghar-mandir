import { DIProps } from "@/core/DI.types";
import { DarkBgButtonFw } from "../Common/Buttons";
import useTrans from "@/customHooks/useTrans";
import { DI } from "@/core/DependencyInjection";
import { getSign } from "@/constants/commonfunctions";
import SubscriptionLabel from "../Subscription/SubscriptionLabel";
import SubscriptionBox from "../Subscription/SubscriptionBox";
import Popup from "../Common/Popup";
import { useState } from "react";
import CheckoutWithLogin from "../Login/CheckoutWithLogin";
import MostPopular from "../Common/MostPopular/MostPopular";
import useWindow from "@/customHooks/useWindows";
interface Props extends DIProps {
  moreOffer: any;
  setMoreOffer: (e) => void;
  drawer: any;
  checkActive?: any;
  subscription?: any;
}
const OfferingBoxes = ({
  moreOffer,
  setMoreOffer,
  drawer,
  checkActive,
  redux,
  subscription,
}: Props) => {
  const t = useTrans(redux?.common?.language);
  const { width } = useWindow();
  const currency = getSign();
  const [subscribe, setSubscribe] = useState({});
  const [checkoutPage, setCheckoutPage] = useState({});
  const [showMore, setShowMore] = useState({});
  const handleOfferingInc = (id: string) => {
    const tempOffering = structuredClone(moreOffer);
    moreOffer.forEach((item, idx) => {
      if (item.offeringId == id || item.prasadId == id) {
        if (tempOffering[idx]["count"]) tempOffering[idx]["count"] += 1;
        else tempOffering[idx]["count"] = 1;
      }
    });
    setMoreOffer(tempOffering);
  };
  const handleOfferingDec = (id: string) => {
    const tempOffering = structuredClone(moreOffer);
    moreOffer.forEach((item, idx) => {
      if (item.offeringId == id || item.prasadId == id) {
        if (tempOffering[idx]["count"]) tempOffering[idx]["count"] -= 1;
        else tempOffering[idx]["count"] = 1;
      }
    });
    setMoreOffer(tempOffering);
  };
  const handleReadToggle = (idx) => {
    setShowMore((prev) => ({
      ...prev,
      [idx]: prev[idx] ? false : true,
    }));
  };
  const renderDescription = (description, index) => {
    if (width > 768) {
      return (
        <p className="package-selection-offering--box-subtitle">
          {description}
        </p>
      );
    } else {
      const showFullText = showMore[index] || description?.length <= 80;

      return (
        <p className="package-selection-offering--box-subtitle">
          {showFullText ? description : `${description?.slice(0, 80)}...`}
          {description?.length > 80 && (
            <span
              className="package-selection-offering--box-subtitle"
              style={{ fontWeight: "500", color: "#af1e2e" }}
              onClick={() => handleReadToggle(index)}
            >
              {showFullText ? " See Less" : " See More"}
            </span>
          )}
        </p>
      );
    }
  };
  return (
    <div className={drawer ? "package-selection-offering" : ""}>
      {moreOffer?.map((item, index) => {
        return (
          <div key={index}>
            <div className="package-selection-offering--box">
              <div className="package-selection-offering--box-content">
                <label className="package-selection-offering--box-title">
                  {item?.title ?? ""}
                  {item?.mostPopular && item?.mostPopular == true ? (
                    item?.prasadId ? (
                      <MostPopular text={"Most Added"} />
                    ) : (
                      <MostPopular text={"Trending"} />
                    )
                  ) : (
                    <></>
                  )}
                </label>
                {renderDescription(item?.description ?? "", index)}
                <p className="package-selection-offering--box-price">
                  {currency} {item?.price ?? ""}/-
                </p>
              </div>
              <div
                className="package-selection-offering--box-img-btn"
                translate="no"
              >
                <img
                  src={
                    item.image ?? "https://demofree.sirv.com/nope-not-here.jpg"
                  }
                  alt="img-prasad"
                  className="package-selection-offering--box-img"
                />
                <div className="package-selection-offering--box-button">
                  {item.count && item.count > 0 ? (
                    <span className="triple-data-button">
                      <span
                        className="triple-data-button-3"
                        onClick={() => {
                          if (item?.prasadId) handleOfferingDec(item?.prasadId);
                          else handleOfferingDec(item?.offeringId);
                        }}
                      >
                        -
                      </span>
                      <span className="triple-data-button-2">
                        {"  " + item.count + "  "}
                      </span>
                      <span
                        className="triple-data-button-1"
                        onClick={() => {
                          if (item?.prasadId) handleOfferingInc(item?.prasadId);
                          else handleOfferingInc(item?.offeringId);
                        }}
                      >
                        +
                      </span>
                    </span>
                  ) : (
                    <DarkBgButtonFw
                      onClick={() => {
                        if (item?.prasadId) handleOfferingInc(item?.prasadId);
                        else handleOfferingInc(item?.offeringId);
                      }}
                      // size="small"
                      disabled={checkActive}
                      className="small-button"
                    >
                      {t("ADD_PLUS")}
                    </DarkBgButtonFw>
                  )}
                </div>
              </div>
            </div>
            {subscription &&
              item?.offeringId == subscription.offeringId &&
              subscription.status == "ACTIVE" && (
                <SubscriptionLabel
                  onClick={() =>
                    setSubscribe((prev) => ({
                      ...prev,
                      [item?.offeringId]: true,
                    }))
                  }
                  subscriptionLabel={subscription?.subscriptionLabel}
                />
              )}
            {subscribe[item?.offeringId] && (
              <Popup
                position={"center"}
                isEscape={true}
                onClose={() => {
                  setSubscribe({});
                }}
                maxWidth={"635px"}
              >
                <SubscriptionBox
                  subscription={subscription}
                  offering={item}
                  setCheckoutPage={() => {
                    setCheckoutPage((prev) => ({
                      ...prev,
                      [item?.offeringId]: true,
                    }));
                    setSubscribe({});
                  }}
                />
              </Popup>
            )}

            <CheckoutWithLogin
              setLoginCheck={(e) => {
                setCheckoutPage((prev) => ({
                  ...prev,
                  [item?.offeringId]: e,
                }));
              }}
              showPopup={checkoutPage[item?.offeringId]}
              otherData={subscription}
            />
          </div>
        );
      })}
    </div>
  );
};
export default DI(OfferingBoxes);

import { CalenderWhiteIcon, TempleWhiteIcon } from "@/assets/svgs";
import "../../../styles/Listing.css";
import { useState } from "react";
import useWindow from "@/customHooks/useWindows";
import { Button } from "../Buttons";
import "./RecommendedChadhavaCard.css"; // Assuming you have a separate CSS file for this component
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import { pushToDataLayerWithoutEvent } from "@/lib/gtm";
import {
  getSign,
  transformToAddToCartEvent,
} from "@/constants/commonfunctions";
import { urlFetchCalls } from "@/constants/url";
import Login from "../../Login/Login";
import useTrans from "@/customHooks/useTrans";
import { addCartData } from "@/store/slices/checkoutSlice";
import { Tooltip } from "antd";
interface Props extends DIProps {
  data: any;
  addedToCart?: () => void;
  cartData?: any;
  getCartData: () => void;
  priceUpdate: (e) => void;
}
const {
  POST: { order_addToCart },
} = urlFetchCalls;
const RecommendedChadhavaCard = ({
  data,
  toast,
  redux,
  request,
  cartData,
  addedToCart,
  getCartData,
  priceUpdate,
  dispatch,
}: Props) => {
  const t = useTrans(redux?.common?.language);
  const currency = getSign();
  const { width } = useWindow();
  const [loading, setLoading] = useState(false);

  function getTimeLeft(endDateObj) {
    if (!endDateObj)
      return <div className="card-participate--recom-header">{"Ongoing"}</div>;

    const eventDate: any = new Date(
      endDateObj.year,
      endDateObj.month - 1,
      endDateObj.day,
      endDateObj.hour,
      endDateObj.min
    );

    const now: any = new Date();
    const diff = eventDate - now;

    if (diff <= 0)
      return (
        <div className="card-participate--recom-header">
          {"Event has ended"}
        </div>
      );

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return (
      <div className="card-participate--recom-header">
        {days ?? ""} Days | {hours ?? ""} Hrs | {mins ?? ""} Mins
      </div>
    );
  }
  const handleAddtoCart = (price: any) => {
    setLoading(true);
    priceUpdate(price);
    const param = {
      totalAmount: price,
      offerings: data?.offerings,
      prasad: data.prasad ?? [],
      package: {
        name: "",
        price: 0,
      },
      product: {
        chadhaavaId: data?.chadhaavaId,
        heading: data?.heading,
        poojaTemple: data?.poojaTemple ?? "",
        poojaDay: data?.poojaDay ?? "",
        description: data?.description ?? "",
        image: [data.image],
      },
      userId: redux?.auth?.authToken,
      userName: redux?.auth?.username,
      mobileNumber: redux?.auth?.mobile,
      chadhaavaName: data.chadhaavaName,
      type: "CHADHAVAA",
      editable: "no_editable",
      prasadIncluded: data?.prasadIncluded || false,
      pitruNameIncluded: data?.pitruNameIncluded || false,
    };
    pushToDataLayerWithoutEvent(transformToAddToCartEvent(param));
    if (param?.prasad?.length > 0) {
      pushToDataLayerWithoutEvent({
        ...transformToAddToCartEvent(param),
        event: "Prasad_Opted_In_Web",
      });
    }
    if (request && redux?.auth?.authToken && redux?.auth?.authToken != "") {
      request
        .POST(order_addToCart, { ...param })
        .then((res: any) => {
          if (res?.success) toast?.show(res?.message, "success");
          else toast?.show(res?.message, "warn");
          // router.push("/checkout");
        })
        .finally(() => {
          setLoading(false);
          getCartData();
          if (addedToCart) addedToCart();
        });
    } else {
      if (dispatch)
        dispatch(
          addCartData({
            addToCart: { [param.product.chadhaavaId]: param },
          })
        );
      toast?.show("Added to cart", "success");
      setLoading(false);
    }
  };

  return (
    <div
      className="recom-card-participate"
      style={{
        backgroundImage: `
        linear-gradient(0deg, rgba(19, 33, 2, 0.5) 30%, rgba(19, 33, 2, 0.2) 60%, rgba(19, 33, 2, 0) 69%),
        url(${
          data?.categoryImage ??
          data?.image ??
          "https://d28wmhrn813hkk.cloudfront.net/uploads/1751886008290-ukdwt.webp"
        })`,
      }}
    >
      {getTimeLeft(data?.chadhaavaEndDate)}
      <div className="recom-card-participate--data">
        <h3 className="card-participate--recom-title">
          {data?.heading?.length > 20 ? (
            <Tooltip
              placement="top"
              title={data?.heading}
            >{`${data?.heading?.slice(0, 20)}...`}</Tooltip>
          ) : (
            "..."
          )}
        </h3>

        {/* Offerings Section (Unique to ChadhavaCard) */}
        <div className="card-participate--offeringbox">
          <div className="card-participate--offering-recom-content">
            <img
              className={`card-participate--offering-recom-img chdw-img-0`}
              alt="offering"
              src={
                data?.offerings.filter((img) => img.count && img.count > 0)[0]
                  ?.image ??
                "https://cdn.cdnparenting.com/articles/2019/03/22170959/378178690-H.webp"
              }
            />
            <p
              className="card-participate--offering-recom-values"
              style={
                width > 551 || width < 330
                  ? { width: "150px" }
                  : { width: "200px" }
              }
            >
              {data?.offerings[0]?.title ?? ""}
            </p>
          </div>
        </div>

        <div className="horizontal-line" style={{ margin: "4px 0" }}></div>

        <div className="card-participate--temple-date">
          <div className="card-participate--recom-temple">
            <span className="card-participate--recom-icon">
              <TempleWhiteIcon size={14} />
            </span>
            <span>{data?.poojaTemple ?? ""}</span>
          </div>
          <div className="card-participate--recom-date">
            <span className="card-participate--recom-icon">
              <CalenderWhiteIcon size={14} />
            </span>
            <span>{data?.poojaDay ?? ""}</span>
          </div>
        </div>

        {/* Button & Share Section (Fixed Alignment) */}
        <div className="card-participate--recom-actions">
          <p className="card-participate--recom-price">
            {" "}
            {currency}
            {
              data?.offerings.filter((img) => img.count && img.count > 0)[0]
                ?.price
            }{" "}
            /-
          </p>
          <Button
            color="primary"
            size="small"
            onClick={() => {
              if (cartData[data.chadhaavaId]) {
                toast?.show(t("ALREADY_IN_CART"), "warn");
              } else {
                handleAddtoCart(
                  data?.offerings.filter((img) => img.count && img.count > 0)[0]
                    ?.price
                );
              }
            }}
            isLoading={loading}
            style={{ width: width < 550 ? "calc(60% - 30px)" : "60%" }} // Ensures button doesn't overflow
            disabled={cartData[data.chadhaavaId]}
          >
            {cartData[data.chadhaavaId] ? t("ADDED") : t("ADD_PLUS")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DI(RecommendedChadhavaCard);

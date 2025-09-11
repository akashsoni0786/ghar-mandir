import { useEffect, useRef, useState } from "react";
import MobileFooter from "../Common/MobileFooter";
import { useRouter } from "next/navigation";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import { pushToDataLayerWithoutEvent } from "@/lib/gtm";
import PrasadBoxs from "./PrasadBoxs";
import OfferingBoxes from "./OfferingBoxes";
import { updatePreviousPath } from "@/store/slices/commonSlice";
import {
  getCurrencyName,
  getSign,
  transformData,
  transformToAddToCartEvent,
} from "@/constants/commonfunctions";
import { urlFetchCalls } from "@/constants/url";
import { usePoojaContext } from "../PujaDetails/PoojaDetailsContext";
import { button_event, save_event } from "@/constants/eventlogfunctions";
import useTrans from "@/customHooks/useTrans";
import NoOffering from "../NoDataComponents/NoOffering";
import { addCartData } from "@/store/slices/checkoutSlice";
const {
  POST: { order_addToCart },
} = urlFetchCalls;
interface Props extends DIProps {
  data: any;
  poojaId: any;
  details: any;
  image: string;
  activePackage: any;
  showForLogin: () => void;
  poojaName: string;
  packages: any;
  afterlogin?: boolean;
  prasadIncluded?: boolean;
  pitruNameIncluded?: boolean;
}
const PujaPackageSelection = ({
  data,
  poojaId,
  details,
  image,
  activePackage,
  poojaName,
  dispatch,
  redux,
  location,
  showForLogin,
  request,
  packages,
  toast,
  afterlogin,
  prasadIncluded,
  pitruNameIncluded,
}: Props) => {
  const pujaContext = usePoojaContext();
  const t = useTrans(redux?.common?.language);
  const currency = getSign();
  const currency_name = getCurrencyName();
  const [moreOffer, setMoreOffer] = useState(
    pujaContext.addons.moreOffer ?? data?.moreOffering ?? []
  );
  const [prasad, setPrasad] = useState(
    pujaContext.addons.prasad ?? data?.prasad ?? []
  );
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState({
    addOns: "Prasad",
    total_price: 0,
  });
  const router = useRouter();
  const handleAddToCart = (param: any) => {
    const eventData = transformToAddToCartEvent(param, {
      user_id: redux.auth.authToken,
      name: redux.auth.username,
      mobile: redux.auth.mobile,
    });
    pushToDataLayerWithoutEvent(eventData);
    if (param.prasad && param.prasad?.length > 0) {
      pushToDataLayerWithoutEvent({
        ...eventData,
        event: "Prasad_Opted_In_Web",
      });
    }
    const currCartData = {
      ...param,
      member_package_list: packages,
      prasadIncluded: prasadIncluded || false,
      pitruNameIncluded: pitruNameIncluded || false,
    };
    // pushToDataLayerWithoutEvent(transformToAddToCartEvent(param));
    if (request && redux?.auth?.authToken && redux?.auth?.authToken != "") {
      request
        .POST(order_addToCart, currCartData)
        .then((res: any) => {
          if (res?.success) toast?.show(res?.message, "success");
          else toast?.show(res?.message, "warn");
          router.push("/checkout");
        })
        .finally(() => {
          setLoading(false);
          router.push("/checkout");
        });
    } else {
      if (dispatch)
        dispatch(
          addCartData({
            addToCart: {
              [currCartData.product.poojaId]: {
                ...currCartData,
                prasadIncluded: prasadIncluded || false,
                pitruNameIncluded: pitruNameIncluded || false,
              },
            },
          })
        );
      toast?.show("Added to cart", "success");
      setLoading(false);
      router.push("/checkout");
    }
  };
  const addToCartData = () => {
    const addtocart = transformData(
      { moreOffer, prasad, activePackage, poojaName, poojaId, prasadIncluded },
      redux?.auth,
      "PUJA"
    );
    handleAddToCart(addtocart);
    if (dispatch) dispatch(updatePreviousPath({ previous_path: location }));
  };
  const handlePayment = () => {
    // if (!redux.auth.authToken || redux.auth.authToken == "") {
    //   showForLogin();
    //   setLoading(false);
    // } else {
    addToCartData();
    // }
  };
  const packData = (prasad_count: number, offering_count: number) => {
    let str = "";
    if (prasad_count > 0) {
      if (prasad_count > 1) str += `${prasad_count} Prasad`;
      else str += `Prasad `;
    }
    if (offering_count > 0) {
      str += `+${offering_count} Ad Ons`;
    }
    return str;
  };
  useEffect(() => {
    let prasad_count = 1;
    let offering_count = 1;
    let total_price = 0;
    prasad.forEach((val: any) => {
      if (val?.count && val?.count > 0) {
        prasad_count++;
        total_price += val?.count * val?.price;
      }
    });
    moreOffer.forEach((val: any) => {
      if (val?.count && val?.count > 0) {
        offering_count++;
        total_price += val?.count * val?.price;
      }
    });

    total_price += activePackage?.price ?? 0;
    setPriceData({
      total_price,
      addOns: packData(prasad_count, offering_count),
    });
  }, [moreOffer, prasad, activePackage]);
  const hasProcessedLogin = useRef(false);

  useEffect(() => {
    if (afterlogin && !hasProcessedLogin.current) {
      addToCartData();
      hasProcessedLogin.current = true;
    }
  }, [afterlogin]);

  return (
    <div className="package-selection ">
      <div className="bottom-drawer-header">
        <div className="package-selection-header container ">
          <img
            src={
              image ??
              "https://i.pinimg.com/736x/4a/49/85/4a498553a5b1cdbb131195791dfa1f60.jpg"
            }
            alt="header"
            className="package-selection-header--image"
          />
          <div className="package-selection-header--contents">
            <p className="package-selection-header--subheading">
              {t("PUJA_SELECTED")}
            </p>
            <h4 className="package-selection-header--heading">
              {details?.heading ?? t("PACKAGE_OFFERINGS")}
            </h4>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          padding: "8px",
        }}
      >
        {prasad?.length > 0 && currency_name == "INR" && !prasadIncluded && (
          <div className="package-selection-container container">
            <h5 className="package-selection-container--heading">
              Get Prasad📦 Delivered to Your Home🏡
            </h5>
            <div className="package-selection-container--box">
              <PrasadBoxs
                prasad={prasad}
                setPrasad={(e) => {
                  setPrasad(e);
                  pujaContext.setAddons({ ...pujaContext.addons, prasad: e });
                }}
              />
            </div>
          </div>
        )}
        {moreOffer?.length > 0 ? (
          <div className="package-selection-container container">
            <h5 className="package-selection-container--heading">
              {t("ADD_MORE_OFFERINGS")}
            </h5>
            <div className="package-selection-container--box">
              <OfferingBoxes
                moreOffer={moreOffer}
                setMoreOffer={(e) => {
                  pujaContext.setAddons({
                    ...pujaContext.addons,
                    moreOffer: e,
                  });
                  setMoreOffer(e);
                }}
                drawer={true}
              />
            </div>
          </div>
        ) : prasad?.length == 0 || currency_name != "INR" ? (
          <NoOffering />
        ) : (
          <></>
        )}
      </div>
      <div style={{ height: "80px" }}></div>
      <MobileFooter
        button_name={t("Enter Details")}
        left_section={
          <div className="package-selection-footer--box">
            <span
              className="package-selection-footer--box-title"
              translate="no"
            >
              {currency}
              {priceData?.total_price}/-{" "}
            </span>
            <p className="package-selection-footer--box-price">
              {priceData?.addOns ?? t("TOTAL")}
            </p>
          </div>
        }
        onClick={() => {
          const eventbtn = button_event(
            "Add your sankalp",
            "Puja view : added to cart",
            "Puja View",
            { additional: { activePackage, moreOffer, prasad, priceData } }
          );
          save_event(redux?.auth?.authToken, "Puja View", [eventbtn]);
          handlePayment();
        }}
        setLoading={setLoading}
        loading={loading && redux.auth.authToken && redux.auth.authToken != ""}
      />
    </div>
  );
};
export default DI(PujaPackageSelection);

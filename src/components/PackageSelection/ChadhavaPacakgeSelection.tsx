import { useEffect, useRef, useState } from "react";
import MobileFooter from "../Common/MobileFooter";
import { useRouter } from "next/navigation";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import { pushToDataLayerWithoutEvent } from "@/lib/gtm";
import PrasadBoxs from "./PrasadBoxs";
import PackageBoxUn from "../Common/PackageBoxUn";
import PackageBox from "../Common/PackageBox";
import { chadhavaPackageList } from "@/commonvaribles/constant_variable";
import {
  getSign,
  packData,
  removeExtraKeys,
  transformData,
  transformToAddToCartEvent,
} from "@/constants/commonfunctions";
import { updatePreviousPath } from "@/store/slices/commonSlice";
import { urlFetchCalls } from "@/constants/url";
import { usePoojaContext } from "../PujaDetails/PoojaDetailsContext";
import { button_event, save_event } from "@/constants/eventlogfunctions";
import MobileFooterMultipleActions from "../Common/MobileFooterMultipleActions";
import useTrans from "@/customHooks/useTrans";
import { addCartData } from "@/store/slices/checkoutSlice";
const {
  POST: { order_addToCart },
} = urlFetchCalls;
interface Props extends DIProps {
  data: any;
  chadhaavaId: any;
  details: any;
  image: string;
  showForLogin: () => void;
  packages: any;
  moreOffer: any;
  imageList: any;
  chadhaavaName: string;
  prasadOffer: any;
  afterlogin?: boolean;
  prasadIncluded?: boolean;
  pitruNameIncluded?: boolean;
}
const ChadhavaPacakgeSelection = ({
  data,
  chadhaavaId,
  details,
  image,
  dispatch,
  redux,
  showForLogin,
  packages,
  moreOffer,
  imageList,
  location,
  chadhaavaName,
  request,
  toast,
  prasadOffer,
  afterlogin,
  prasadIncluded,
  pitruNameIncluded,
}: Props) => {
  const pujaContext = usePoojaContext();
  const currency = getSign();
  const t = useTrans(redux?.common?.language);
  const [prasad, setPrasad] = useState(
    pujaContext?.addons?.prasad ?? data?.prasad ?? []
  );
  const [loading, setLoading] = useState(false);
  const [loading_2, setLoading_2] = useState(false);
  const [activePackage, setActivePackage] = useState<any>({
    ...details,
    image: imageList,
    ...pujaContext.activePackage,
  });

  const [priceData, setPriceData] = useState({
    addOns: "Chadhava",
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
    // pushToDataLayerWithoutEvent(transformToAddToCartEvent(param));
    if (request && redux?.auth?.authToken && redux?.auth?.authToken != "") {
      request
        .POST(order_addToCart, {
          ...param,
          // member_package_list: packages
          prasadIncluded: prasadIncluded || false,
          pitruNameIncluded: pitruNameIncluded || false,

        })
        .then((res: any) => {
          if (res?.success) toast?.show(res?.message, "success");
          else toast?.show(res?.message, "warn");
          router.push("/checkout");
        })
        .finally(() => {
          setLoading(false);
          // router.push("/checkout");
        });
    } else {
      if (dispatch)
        dispatch(
          addCartData({
            addToCart: {
              [param.product.chadhaavaId]: {
                ...param,
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
    const addTocart = transformData(
      {
        moreOffer,
        prasad,
        ...{
          activePackage: removeExtraKeys(activePackage, details, imageList),
        },
        chadhaavaName,
        chadhaavaId,
      },

      redux?.auth,
      "CHADHAVAA"
    );

    handleAddToCart(addTocart);
    if (dispatch) dispatch(updatePreviousPath({ previous_path: location }));
  };

  const handlePayment = () => {
    addToCartData();
  };

  const hasProcessedLogin = useRef(false);

  useEffect(() => {
    if (afterlogin && !hasProcessedLogin.current) {
      addToCartData();
      hasProcessedLogin.current = true;
    }
  }, [afterlogin]);

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

  return (
    <div className="package-selection">
      <div className="bottom-drawer-header">
        <div className="package-selection-header container">
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
              {t("CHADHAVA_SELECTED")}
            </p>
            <h4 className="package-selection-header--heading">
              {details?.heading ?? "Package offerings"}
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
          backgroundColor: document.body.style.backgroundColor ?? "#fff",
        }}
      >
        {!prasadIncluded && chadhaavaId != "0f56b4b1-24dd-4e5c-9913-989675805e55" &&
          prasad?.length > 0 && (
            <div className="package-selection-container container mb-60">
              <h5 className="package-selection-container--heading ph-16">
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
        {/* <div className="package-selection-container mb-40 container">
        <div className="ph-16">
          {" "}
          <h5 className="package-selection-container--heading">
            Add family member
          </h5>
          <p className="package-selection-container--subheading">
            Choose your package
          </p>
        </div>
        <div className="package-selection-container--box ph-16 ">
          <div className="pacakge-chadhava">
            {chadhavaPackageList.map((item, index) => {
              index = index + 1;
              const name_data = packages[index]?.title?.split(" ");
              let idx = name_data?.length - 1;
              const subtitle = name_data[idx] ?? "";
              name_data.splice(idx, 1);
              const title = name_data.join(" ");
              if (
                activePackage?.index == index ||
                packages[index]?.title?.includes(activePackage?.name)
              )
                return (
                  <PackageBox
                    cutPrice={packages[index]?.cutPrice ?? ""}
                    chadhava={true}
                    isActive={true}
                    key={index}
                    index={index}
                    name={title ?? item.name}
                    sub_name={subtitle ?? item.sub_name}
                    image={packages[index]?.image ?? item.image}
                    price={packages[index]?.price ?? ""}
                    img_class={item.img_class}
                    onClick={(e) => {
                      setActivePackage(e);
                      pujaContext.setActivePackage(e);
                    }}
                    active={item.active}
                  />
                );
              else
                return (
                  <PackageBoxUn
                    cutPrice={packages[index]?.cutPrice ?? ""}
                    chadhava={true}
                    isActive={true}
                    key={index}
                    index={index}
                    name={title ?? item.name}
                    sub_name={subtitle ?? item.sub_name}
                    image={packages[index]?.image ?? item.image}
                    price={packages[index]?.price ?? ""}
                    img_class={item.img_class}
                    onClick={(e) => {
                      setActivePackage({ ...e, ...details, image: imageList });
                      pujaContext.setActivePackage(e);
                    }}
                    active={item.active}
                  />
                );
            })}
          </div>
        </div>
      </div> */}
      </div>
      <div
        style={{
          height: "70px",
          backgroundColor: document.body.style.backgroundColor ?? "#fff",
        }}
      ></div>
      <MobileFooterMultipleActions
        showWhatsapp={false}
        button_name="Enter Details"
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
              {priceData?.addOns ?? "Total"}
            </p>
          </div>
        }
        onClick={() => {
          const eventbtn = button_event(
            "Add your sankalp",
            "Chadhava view : added to cart",
            "Chadhava View : bottom bar",
            { additional: { moreOffer, prasadOffer, priceData, activePackage } }
          );
          save_event(redux?.auth?.authToken, "Chadhava View", [eventbtn]);
          handlePayment();
        }}
        button_name_2={"Skip"}
        onClick_2={() => {
          const eventbtn = button_event(
            "Add your sankalp",
            "Chadhava view : added to cart",
            "Chadhava View : bottom bar",
            { additional: { moreOffer, prasadOffer, priceData, activePackage } }
          );
          save_event(redux?.auth?.authToken, "Chadhava View", [eventbtn]);
          handlePayment();
        }}
        setLoading={setLoading}
        loading={loading}
        loading_2={loading_2}
        setLoading_2={setLoading_2}

        // disabled_btn={Object.keys(activePackage).length == 0}
      />
    </div>
  );
};
export default DI(ChadhavaPacakgeSelection);

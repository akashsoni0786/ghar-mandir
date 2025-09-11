"use client";
import { useEffect, useState } from "react";
import { DarkBgButtonFw } from "../Common/Buttons";
import MobileFooter from "../Common/MobileFooter";
import { useRouter } from "next/navigation";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import {
  chadhavaPackageList,
  packageList,
  packageNameObj,
} from "@/commonvaribles/constant_variable";
import { ActiveCheckIconLight, UncheckIcon } from "@/assets/svgs";
import Image from "next/image";
import { urlFetchCalls } from "@/constants/url";
import useTrans from "@/customHooks/useTrans";
import { getSign } from "@/constants/commonfunctions";
import { updateCartData } from "@/store/slices/checkoutSlice";
const {
  POST: { order_editCartItem },
} = urlFetchCalls;
interface Props extends DIProps {
  onClose: () => void;
  editable_data: any;
  reload_cart: () => void;
}
interface OfferingItem {
  offeringId: string;
  title?: string;
  description?: string;
  price?: number;
  image?: string;
  count?: number;
}
interface PrasadItem {
  prasadId: string;
  title?: string;
  description?: string;
  price?: number;
  image?: string;
  count?: number;
}
const EditPackage = (props: Props) => {
  const {
    redux,
    request,
    onClose,
    reload_cart,
    editable_data,
    toast,
    dispatch,
  } = props;
  const currency = getSign();
  const router = useRouter();
  const t = useTrans(redux?.common?.language);
  const [moreOffer, setMoreOffer] = useState<OfferingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [current_package, setCurrent_package] = useState<any>([]);
  const [prasad, setPrasad] = useState<PrasadItem[]>([]);
  const [noPrasad, setNoPrasad] = useState(false);
  const [priceData, setPriceData] = useState({
    addOns: "",
    total_price: 0,
  });
  const [activePackage, setActivePackage] = useState<any>(
    editable_data?.package
  );
  console.log("current_package", current_package);
  const validateData = () => {
    // Check if at least one offering or prasad has count > 0
    const hasValidOfferings = moreOffer.some(
      (item) => item.count && item.count > 0
    );
    const hasValidPrasad = prasad.some((item) => item.count && item.count > 0);

    if (
      !hasValidOfferings &&
      !hasValidPrasad &&
      editable_data?.type == "CHADHAVAA"
    ) {
      toast?.show(t("OFFERING_PRASAD_ERROR"), "error");
      return false;
    }

    // Check if total price is zero
    if (priceData.total_price <= 0) {
      if (editable_data?.type == "CHADHAVAA")
        toast?.show(t("OFFERING_PRASAD_ERROR"), "error");
      else toast?.show(t("PLZ_SELECT_PACKAGE"), "error");
      return false;
    }
    // Check if package is required and selected
    if (
      editable_data?.type != "CHADHAVAA" &&
      (!activePackage?.name || activePackage.price === 0)
    ) {
      toast?.show(t("PLZ_SELECT_PACKAGE"), "error");
      return false;
    }

    return true;
  };
  const handlePayment = () => {
    if (!validateData()) return;
    const package_param = {
      totalAmount: priceData?.total_price,
      offerings: moreOffer,
      prasad,
      package: activePackage,
      userId: redux.auth.authToken ?? "",
      cartId: editable_data?.cartId,
    };
    if (!redux.auth.authToken || redux.auth.authToken == "") {
      if (dispatch) {
        dispatch(
          updateCartData({
            cart_id: package_param?.cartId,
            cart_data: package_param,
          })
        );
      }
      onClose();
      toast?.show("Updated successfully", "success");
    } else {
      if (request) {
        setLoading(true);
        request
          .POST(order_editCartItem, package_param)
          .then(() => {})
          .finally(() => {
            router.push("/checkout");
            reload_cart();
            onClose();
            setLoading(false);
          });
      }
    }
  };
  const handlePrasadInc = (id: string) => {
    setNoPrasad(false);
    const tempPrasad = structuredClone(prasad);
    prasad.forEach((item, idx) => {
      if (item.prasadId == id) {
        if (tempPrasad[idx]["count"]) tempPrasad[idx]["count"] += 1;
        else tempPrasad[idx]["count"] = 1;
      }
    });
    setPrasad(tempPrasad);
  };
  const handlePrasadDec = (id: string) => {
    const tempPrasad = structuredClone(prasad);
    prasad.forEach((item, idx) => {
      if (item.prasadId == id) {
        if (tempPrasad[idx]["count"]) tempPrasad[idx]["count"] -= 1;
        else tempPrasad[idx]["count"] = 1;
      }
    });
    setPrasad(tempPrasad);
  };
  const handleOfferingInc = (id: string) => {
    const tempOffering = structuredClone(moreOffer);
    moreOffer.forEach((item, idx) => {
      if (item.offeringId == id) {
        if (tempOffering[idx]["count"]) tempOffering[idx]["count"] += 1;
        else tempOffering[idx]["count"] = 1;
      }
    });
    setMoreOffer(tempOffering);
  };
  const handleOfferingDec = (id: string) => {
    const tempOffering = structuredClone(moreOffer);
    moreOffer.forEach((item, idx) => {
      if (item.offeringId == id) {
        if (tempOffering[idx]["count"]) tempOffering[idx]["count"] -= 1;
        else tempOffering[idx]["count"] = 1;
      }
    });
    setMoreOffer(tempOffering);
  };
  const packData = (prasad_count: number, offering_count: number) => {
    let str = "";
    if (!noPrasad && prasad_count > 0) {
      if (prasad_count > 1) str += `${prasad_count} ${t("PRASAD")} `;
      else str += `${t("PRASAD")} `;
    }
    if (offering_count > 0) {
      str += `+${offering_count}  ${t("AD_ONS")} `;
    }
    return str;
  };
  useEffect(() => {
    if (editable_data) {
      try {
        const package_value = structuredClone(editable_data);
        setActivePackage(package_value?.package ?? {});
        setMoreOffer(package_value?.offerings ?? []);
        setPrasad(package_value?.prasad ?? []);
        setCurrent_package(
          editable_data?.member_package_list?.map((e, idx) => ({
            ...e,
            ...packageList[idx],
          }))
        );
      } catch (error) {
        setMoreOffer([]);
        setPrasad([]);
      }
    }
  }, [editable_data]);

  useEffect(() => {
    let prasad_count = 1;
    let offering_count = 1;
    let total_price = 0;
    if (!noPrasad)
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

  return editable_data ? (
    <div className="package-selection">
      <div className="bottom-drawer-header ">
        <div className="package-selection-header container">
          <img
            src={
              editable_data?.image
                ? editable_data?.image[0]
                : "https://i.pinimg.com/736x/4a/49/85/4a498553a5b1cdbb131195791dfa1f60.jpg"
            }
            alt="header"
            className="package-selection-header--image"
          />
          <div className="package-selection-header--contents">
            <p className="package-selection-header--subheading">
              {editable_data?.product?.poojaId
                ? t("PUJA_SELECTED")
                : t("CHADHAVA_SELECTED")}
            </p>
            <h4 className="package-selection-header--heading">
              {editable_data?.product?.heading ?? t("PACKAGE_OFFERINGS")}
            </h4>
          </div>
        </div>
      </div>
      <div className="package-selection--data">
        {current_package?.length > 0 && (
          <div className="package-selection-container container">
            <h5 className="package-selection-container--heading ">
              {t("EDIT_PACKAGE")}
            </h5>
            <div className="package-selection-container--box">
              <div className="package-selection-packageList">
                {(editable_data?.product?.poojaId
                  ? packageList
                  : chadhavaPackageList
                ).map((item: any, index: number) => {
                  if (editable_data?.product.chadhaavaId) index = index + 1;
                  const checkActive =
                    (activePackage as any)?.name &&
                    (activePackage as any)?.name != "" &&
                    current_package[index]?.title?.includes(
                      (activePackage as any)?.name
                    );
                  return (
                    <div
                      key={`${current_package[index]?.title}-${index}`}
                      className="package-selection-packageList--item"
                      onClick={() => {
                        if (checkActive) {
                          setActivePackage((prev: any) => ({
                            ...prev,
                            name: undefined,
                            price: undefined,
                          }));
                        } else {
                          setActivePackage((prev: any) => ({
                            ...prev,
                            name: current_package[index]?.title,
                            price: current_package[index]?.price,
                          }));
                        }
                      }}
                    >
                      <div className="package-selection-packageList--item-data">
                        <div
                          className={` ${
                            checkActive ? "bg-checked" : "bg"
                          } package-edit-packageList--item-imgwrp`}
                        >
                          <img
                            alt={item.name}
                            src={
                              editable_data?.pitruNameIncluded
                                ? current_package[index]?.image_p
                                : current_package[index]?.image ?? ""
                            }
                            className={
                              editable_data?.pitruNameIncluded
                                ? "package-edit-packageList--item-img_p"
                                : "package-edit-packageList--item-img"
                            }
                          />
                        </div>
                        <div className="package-selection-packageList--item-title">
                          <p className="package-selection-packageList--item-data-title">
                            {editable_data?.pitruNameIncluded &&
                            packageNameObj[current_package[index]?.title]
                              ? packageNameObj[current_package[index]?.title]
                              : current_package[index]?.title}
                          </p>
                          <p className="package-selection-packageList--item-data-price">
                            {currency} {current_package[index]?.price}/-
                          </p>
                        </div>
                      </div>

                      <div className="package-selection-packageList--item-checkbox">
                        {checkActive ? (
                          <ActiveCheckIconLight />
                        ) : (
                          <UncheckIcon />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {!editable_data?.prasadIncluded && prasad?.length > 0 && (
          <div className="package-selection-container container">
            <h5 className="package-selection-container--heading">
              {t("ADD_PRASAD")}
            </h5>
            <div className="package-selection-container--box">
              <div className="package-selection-prasad">
                {prasad?.map((item, index) => {
                  return (
                    <div
                      className="package-selection-prasad--box"
                      key={item?.prasadId}
                    >
                      <div className="package-selection-prasad--box-data">
                        <img
                          src={
                            item.image ??
                            "https://demofree.sirv.com/nope-not-here.jpg"
                          }
                          alt="img-prasad"
                          className="package-selection-prasad--box-img"
                        />
                        <div className="package-selection-prasad--box-content">
                          <label className="package-selection-prasad--box-title">
                            {item?.title ?? ""}
                          </label>
                          <p className="package-selection-prasad--box-subtitle">
                            {item?.description ?? ""}
                          </p>
                          <p className="package-selection-prasad--box-price">
                            {currency} {item?.price ?? ""}/-
                          </p>
                        </div>
                      </div>
                      <div className="package-selection-prasad--box-button">
                        {item.count && item.count > 0 ? (
                          <span className="triple-data-button">
                            <span
                              className="triple-data-button-3"
                              onClick={() => {
                                handlePrasadDec(item?.prasadId);
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
                                handlePrasadInc(item?.prasadId);
                              }}
                            >
                              +
                            </span>
                          </span>
                        ) : (
                          <DarkBgButtonFw
                            onClick={() => {
                              handlePrasadInc(item?.prasadId);
                            }}
                            className="small-button"
                          >
                            {t("ADD_PLUS")}
                          </DarkBgButtonFw>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {moreOffer?.length > 0 && (
          <div className="package-selection-container container">
            <h5 className="package-selection-container--heading">
              {t("ADD_MORE_OFFERINGS")}
            </h5>
            <div className="package-selection-container--box">
              <div className="package-selection-offering">
                {moreOffer?.map((item, index) => {
                  return (
                    <div
                      className="package-selection-offering--box"
                      key={item?.offeringId}
                    >
                      <div className="package-selection-offering--box-content">
                        <label className="package-selection-offering--box-title">
                          {item?.title ?? ""}
                        </label>
                        <p className="package-selection-offering--box-subtitle">
                          {item?.description ?? ""}
                        </p>
                        <p className="package-selection-offering--box-price">
                          {currency} {item?.price ?? ""}/-
                        </p>
                      </div>
                      <div className="package-selection-offering--box-img-btn">
                        <img
                          src={
                            item.image ??
                            "https://demofree.sirv.com/nope-not-here.jpg"
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
                                  handleOfferingDec(item?.offeringId);
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
                                  handleOfferingInc(item?.offeringId);
                                }}
                              >
                                +
                              </span>
                            </span>
                          ) : (
                            <DarkBgButtonFw
                              onClick={() => {
                                handleOfferingInc(item?.offeringId);
                              }}
                              className="small-button"
                            >
                              {t("ADD_PLUS")}
                            </DarkBgButtonFw>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={{ height: "70px" }}></div>
      <MobileFooter
        showWhatsapp={false}
        hideOnScroll={false}
        button_name={t("ADD_YOUR_SANKALP")}
        left_section={
          <div className="package-selection-footer--box">
            <p className="package-selection-footer--box-title" translate="no">
              {currency}
              {priceData?.total_price}/-{" "}
            </p>
            <p className="package-selection-footer--box-price">
              {priceData?.addOns ?? t("TOTAL")}
            </p>
          </div>
        }
        onClick={handlePayment}
        loading={loading}
      />
    </div>
  ) : (
    <></>
  );
};
export default DI(EditPackage);

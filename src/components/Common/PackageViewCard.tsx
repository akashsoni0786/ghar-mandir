import { useState } from "react";
import BottomDrawer from "./BottomDrawer";
import EditPackage from "../Checkout/EditPackage";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import useTrans from "@/customHooks/useTrans";
import { getSign } from "@/constants/commonfunctions";
import { CalenderIcon, TempleIcon } from "@/assets/svgs";
import { packageNameObj } from "@/commonvaribles/constant_variable";
interface Props extends DIProps {
  package_data: any;
  removePackage: () => void;
  reload_cart: () => void;
}
const PackageViewCard = ({
  package_data,
  removePackage,
  reload_cart,
  redux,
}: Props) => {
  const currency = getSign();
  const t = useTrans(redux?.common?.language);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const showEdit = () => {
    setIsDrawerOpen(true);
  };
  const addOns = () => {
    let addons_str = "";
    const len =
      (package_data?.offerings?.length ?? 0) +
      (package_data?.prasad?.length ?? 0);
    if (len > 0) {
      const tempArr: any = [
        ...package_data?.offerings,
        ...package_data?.prasad,
      ].filter((val: any) => val.count && val.count > 0);
      tempArr.forEach((item: any, idx: number) => {
        if (item.count && item.count > 0) {
          addons_str += item.count + "-" + item?.title;
          if (tempArr.length - 1 > idx) addons_str += ", ";
        }
      });
    }
    return addons_str;
  };
  const totalPrice = () => {
    let price: any = 0;
    const len =
      (package_data?.offerings?.length ?? 0) +
      (package_data?.prasad?.length ?? 0);
    if (len > 0) {
      const tempArr: any = [
        ...package_data?.offerings,

        ...package_data?.prasad,
      ].filter((val: any) => val?.count && val?.count > 0);
      tempArr.forEach((item: any, idx: number) => {
        if (item.count && item.count > 0) {
          price += Number(item.count) * Number(item?.price);
        }
      });
    }
    price +=
      package_data?.package?.price && package_data?.package?.price != ""
        ? package_data?.package?.price
        : 0;
    return price;
  };
  return (
    <div className="checkout-package--card">
      {isDrawerOpen && (
        <BottomDrawer
          setIsDrawerOpen={setIsDrawerOpen}
          isDrawerOpen={isDrawerOpen}
          component={
            <EditPackage
              editable_data={package_data}
              onClose={() => setIsDrawerOpen(false)}
              reload_cart={reload_cart}
            />
          }
        />
      )}
      <div
        style={{
          width: "100%",
          display: "flex",
          gap: "10px",
          alignItems: "start",
          justifyContent: "space-between",
        }}
      >
        <h4 className="checkout-package--cardheading">
          {package_data?.product?.heading}{" "}
          {package_data.type != "CHADHAVAA" && (
            <span className="checkout-package--cardpackage">
              (
              {package_data?.package?.name && package_data?.package?.name != ""
                ? package_data?.pitruNameIncluded
                  ? packageNameObj[package_data?.package?.name]
                  : package_data?.package?.name
                : t("NO_PACKAGE")}
              )
            </span>
          )}
        </h4>
        <p
          className="checkout-package--pricebox-price"
          key={totalPrice()}
          translate="no"
        >
          {currency}
          {totalPrice()}
          /-
        </p>
      </div>

      {addOns() && addOns() != "" && (
        <div style={{ display: "flex", alignContent: "center", gap: "6px" }}>
          <h5 className="checkout-package--cardsubheading">{t("AD_ONS")} : </h5>
          <p className="checkout-package--addons">{addOns()}</p>
        </div>
      )}
      <div className="checkout-offer--card-hr" />

      <div className="checkout-package--pricebox">
        <div style={{ display: "flex", gap: "0", flexDirection: "column" }}>
          <p className="checkout-package--templedate">
            <TempleIcon className="card-icon" />
            {package_data?.product?.poojaTemple}
          </p>
          <p className="checkout-package--templedate">
            <CalenderIcon className="card-icon" />
            {package_data?.product?.poojaDay}
          </p>
        </div>
        <div className="checkout-package--pricebox-btns">
          <div className="checkout-package--pricebox-btn" onClick={showEdit}>
            {t("EDIT")}
          </div>
          <div
            className="checkout-package--pricebox-btn"
            onClick={removePackage}
          >
            {t("REMOVE")}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DI(PackageViewCard);

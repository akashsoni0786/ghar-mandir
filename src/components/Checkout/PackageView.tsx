"use client";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import PackageViewCard from "../Common/PackageViewCard";
import { urlFetchCalls } from "@/constants/url";
import LoadingSpinner from "../Common/Loadings/LoadingSpinner";
import { pushToDataLayerWithoutEvent } from "@/lib/gtm";
import { transformToRemoveItemCartEvent } from "@/constants/commonfunctions";
import useTrans from "@/customHooks/useTrans";
import { removeFromCartData } from "@/store/slices/checkoutSlice";

const {
  POST: { order_removeFromCart },
} = urlFetchCalls;
interface Props extends DIProps {
  getData: (e: any) => void;
  cartData: any;
  setCartData: (e: any) => void;
  reload_cart: () => void;
}
const PackageView = (props: Props) => {
  const {
    redux,
    request,
    getData,
    cartData,
    setCartData,
    reload_cart,
    toast,
    dispatch,
  } = props;
  const t = useTrans(redux?.common?.language);
  const showRemove = () => {
    if (
      Object.keys({
        ...cartData?.Chadhava,
        ...cartData?.Puja,
      }).length > 0
    )
      return true;
    return false;
  };

  const removePackage = (cart_id: string) => {
    if (confirm(t("ARE_YOU_SURE_WANT_TO_REMOVE"))) {
      if (request && redux?.auth?.authToken && redux?.auth?.authToken != "") {
        request
          .POST(order_removeFromCart, {
            userId: redux?.auth?.authToken ?? "",
            cartId: cart_id,
          })
          .then((res: any) => {
            if (res.success) {
              if (toast)
                toast.show(
                  res?.message || t("REMOVED_SUCCESSFULLY"),
                  "success"
                );
              const temp = structuredClone(cartData);
              temp.Puja = temp?.Puja.filter(
                (c_id: any) => c_id?.cartId != cart_id
              );
              let totalValue = temp.Puja?.reduce(
                (acc, cur) => acc + cur.totalAmount,
                0
              );
              let cart_ids = temp.Puja?.map((crts: any) => crts?.cartId);
              temp.Chadhava = temp?.Chadhava.filter(
                (c_id: any) => c_id?.cartId != cart_id
              );
              cart_ids = [
                ...cart_ids,
                ...temp.Chadhava?.map((crts: any) => crts?.cartId),
              ];
              totalValue += temp.Chadhava?.reduce(
                (acc, cur) => acc + cur.totalAmount,
                0
              );
              setCartData(temp);
              pushToDataLayerWithoutEvent(transformToRemoveItemCartEvent(cart_id));
              
              getData({
                totalCartAmount: totalValue,
                loading: false,
                cartId: cart_ids ?? [],
              });
              reload_cart();
            } else if (toast)
              toast.show(res?.message || "Internal error", "error");
          });
      } else {
        if (dispatch) {
          dispatch(removeFromCartData({ cart_id }));
          pushToDataLayerWithoutEvent(transformToRemoveItemCartEvent(cart_id));
          if (toast) toast.show(t("REMOVED_SUCCESSFULLY"), "success");
        }
      }
    }
  };
  return cartData && showRemove() ? (
    <div className="checkout-package">
      {Object.keys(cartData).map((type: any) => {
        if (cartData[type]?.length > 0)
          return (
            <div key={type}>
              <h4 className="checkout-package--heading" key={type}>
                {type == "Puja" ? t("YOUR_PUJA") : t("YOUR_CHADHAVA")}
              </h4>
              {cartData[type]?.map((cart: any, idx: any) => {
                return (
                  <PackageViewCard
                    key={idx}
                    package_data={cart}
                    removePackage={() => {
                      removePackage(cart?.cartId);
                    }}
                    reload_cart={reload_cart}
                  />
                );
              })}
            </div>
          );
      })}
    </div>
  ) : (
    <div className="box-loader">
      <LoadingSpinner />
    </div>
  );
};
export default DI(PackageView);

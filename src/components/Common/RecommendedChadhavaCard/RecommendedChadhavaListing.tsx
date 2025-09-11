import RecommendedChadhavaCard from "./RecommendedChadhavaCard";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import { useEffect, useState } from "react";
import { urlFetchCalls } from "@/constants/url";
import useTrans from "@/customHooks/useTrans";
const {
  POST: { chadhaava_crossSell, order_getUserCart },
} = urlFetchCalls;
interface Props extends DIProps {
  chadhaavaId?: string;
  addedToCart?: () => void;
  priceUpdate?: (e) => void;
  dataAfterRemove?: any;
}
const RecommendedChadhavaListing = ({
  request,
  chadhaavaId,
  addedToCart,
  priceUpdate,
  redux,
  dataAfterRemove,
}: Props) => {
  const t = useTrans(redux?.common?.language);
  const [loading, setLoading] = useState(false);
  const [chadhavaData, setChadhavaData] = useState({});
  const [cartData, setCartData] = useState({});
  const getChadhavaDetailsById = () => {
    setLoading(true);
    if (request)
      request
        .POST(chadhaava_crossSell, {
          chadhaavaId: chadhaavaId ?? "123",
        })
        .then((res: any) => {
          if (res?.data?.length > 0) {
            let data = {};
            res?.data?.forEach((val) => {
              data[val.chadhaavaId] = val;
            });
            setChadhavaData(data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
  };
  const controller = new AbortController();
  const getCartData = () => {
    if (request && redux?.auth?.authToken && redux?.auth?.authToken != "") {
      request
        .POST(order_getUserCart, { userId: redux?.auth?.authToken ?? "" })
        .then((res: any) => {
          if (res?.data) {
            const cartObj = {};
            res?.data?.forEach((val) => {
              cartObj[val.product.chadhaavaId ?? ""] = val;
            });
            setCartData(cartObj);
          } else setCartData({});
        })
        .finally(() => {
          getChadhavaDetailsById();
        });
    } else {
      setCartData(redux?.checkout?.cart_data);
      getChadhavaDetailsById();
    }
  };
  useEffect(() => {
    if (!loading && Object.keys(chadhavaData)?.length == 0) {
      if (dataAfterRemove) {
        getChadhavaDetailsById();
      } else getCartData();
    }
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (dataAfterRemove) {
      if (dataAfterRemove?.length > 0) {
        const cartObj = {};
        dataAfterRemove?.forEach((val) => {
          cartObj[val.product.chadhaavaId ?? ""] = val;
        });
        setCartData(cartObj);
      }
    }
  }, [dataAfterRemove]);

  useEffect(() => {
    if (!redux?.auth?.authToken || redux?.auth?.authToken == "") {
      setCartData(redux?.checkout?.cart_data);
    }
  }, [redux?.auth?.authToken, redux?.checkout?.cart_data]);
  
  return Object.keys(chadhavaData)?.length > 0 ? (
    <div className="">
      <h3 className="container-box-heading ph-1">
        {t("RECOMMENDED_CHADHAVA")}
      </h3>
      <div className="recommended-puja-rows ph-mob-1">
        {Object.values(chadhavaData).map((datass, idx: number) => {
          return (
            <RecommendedChadhavaCard
              data={datass}
              key={idx}
              addedToCart={addedToCart}
              cartData={cartData}
              getCartData={() => {
                if (!dataAfterRemove) getCartData();
              }}
              priceUpdate={(e) => {
                if (priceUpdate) {
                  priceUpdate(e);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <></>
  );
};
export default DI(RecommendedChadhavaListing);

"use client";
import { urlFetchCalls } from "@/constants/url";
import { useEffect, useState } from "react";
import PujaDetails from "./PujaDetails";
import LoadingSpinner from "../Common/Loadings/LoadingSpinner";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import DataNotFound from "../NoDataComponents/DataNotFound";
import { pushToDataLayerWithoutEvent } from "@/lib/gtm";
import { transformToViewItemEvent } from "@/constants/commonfunctions";
import { pageview_event, save_event } from "@/constants/eventlogfunctions";

const {
  GET: { getPoojaById },
} = urlFetchCalls;

function PujaPage(props: DIProps) {
  const { request, redux } = props;
  const controller = new AbortController();
  const [loading, setLoading] = useState(false);
  const [pujaData, setPujaData] = useState([]);
  const getPujaDetailsById = () => {
    setLoading(true);
    if (request)
      request
        .GET(getPoojaById + "Bankey_bihari_puja", {
          signal: controller.signal,
        })
        .then((res: any) => {
          if (res?.data?.length > 0) {
            setPujaData(res?.data);
            pushToDataLayerWithoutEvent(
              transformToViewItemEvent(res.data, "Puja")
            );
            const eventParams = pageview_event("Puja View", {
              poojaId: res?.data?.[0]?.poojaId ?? "",
              poojaName: res?.data?.[0]?.poojaName ?? "",
            });
            save_event(redux?.auth?.authToken, "Puja View", [eventParams]);
          }
        })
        .finally(() => {
          setLoading(false);
        });
  };

  useEffect(() => {
    if (!loading && pujaData?.length == 0) getPujaDetailsById();
    return () => {
      controller.abort();
    };
  }, []);

  return !loading && pujaData?.length > 0 ? (
    <PujaDetails data={pujaData} />
  ) : !loading ? (
    <div className="error-message">
      <DataNotFound />
    </div>
  ) : (
    <div className="page-loader">
      <LoadingSpinner />
    </div>
  );
}

export default DI(PujaPage);

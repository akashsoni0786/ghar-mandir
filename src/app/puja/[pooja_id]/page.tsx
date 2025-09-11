"use client";
import { urlFetchCalls } from "@/constants/url";
import { useEffect, useState } from "react";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import PujaDetails from "@/components/PujaDetails/PujaDetails";
import { PageWrapper } from "@/app/Routes";
import { useParams } from "next/navigation";
import { transformToViewItemEvent } from "@/constants/commonfunctions";
import DataNotFound from "@/components/NoDataComponents/DataNotFound";
import { pushToDataLayerWithoutEvent } from "@/lib/gtm";
import { DetailsProvider } from "@/components/PujaDetails/PoojaDetailsContext";
import { pageview_event, save_event } from "@/constants/eventlogfunctions";
import { videoSource } from "@/commonvaribles/constant_variable";
import { updateVideo } from "@/store/slices/commonSlice";
import PujaDetailsSkeleton from "../../../skeletons/puja/PujaDetailsSkeleton/PujaDetailsSkeleton";
const {
  GET: { getPoojaById },
} = urlFetchCalls;

function Page(props: DIProps) {
  const { request, redux, dispatch } = props;
  const params = useParams();
  const pooja_id: any = params?.pooja_id;

  const controller = new AbortController();
  const [loading, setLoading] = useState(false);
  const [pujaData, setPujaData] = useState(undefined);
  const getPujaDetailsById = () => {
    setLoading(true);
    if (request)
      request
        .GET(getPoojaById + pooja_id?.split("__")[0], {
          signal: controller.signal,
        })
        .then((res: any) => {
          if (res?.data?.length > 0) {
            setPujaData(res?.data);
            if (dispatch) {
              if (res?.data?.[0]?.advertizeVideo) {
                dispatch(
                  updateVideo({
                    video_data: res?.data?.[0]?.advertizeVideo ?? videoSource,
                  })
                );
              } else {
                dispatch(
                  updateVideo({
                    video_data: null,
                  })
                );
              }
            }
            pushToDataLayerWithoutEvent(
              transformToViewItemEvent(res.data[0], "Puja")
            );
            const eventParams = pageview_event("Puja View", {
              poojaId: res?.data?.[0]?.poojaId ?? "",
              poojaName: res?.data?.[0]?.poojaName ?? "",
            });
            save_event(redux?.auth?.authToken, "Puja View", [eventParams]);
          } else setPujaData([]);
        })
        .finally(() => {
          setLoading(false);
        });
  };
  useEffect(() => {
    if (!loading && !pujaData && pooja_id) getPujaDetailsById();
    return () => {
      controller.abort();
    };
  }, [pooja_id]);

  return (
    <PageWrapper>
      {!pujaData ? (
        <PujaDetailsSkeleton />
      ) : pujaData && pujaData?.length == 0 ? (
        <div className="error-message">
          <DataNotFound />
        </div>
      ) : (
        <DetailsProvider>
          <PujaDetails data={pujaData} />
        </DetailsProvider>
      )}
    </PageWrapper>
  );
}

// Cast properly to avoid type issues with Next.js internal checkers
const WrappedPage = DI(Page) as unknown as React.FC;

export default WrappedPage;

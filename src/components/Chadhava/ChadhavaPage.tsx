"use client";
import { urlFetchCalls } from "@/constants/url";
import { useEffect, useState } from "react";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import ChadhavaDetails from "@/components/Chadhava/ChadhavaDetails";
import LoadingSpinner from "@/components/Common/Loadings/LoadingSpinner";
import { useParams } from "next/navigation";
import DataNotFound from "../NoDataComponents/DataNotFound";
import { pushToDataLayerWithoutEvent } from "@/lib/gtm";
import { transformToViewItemEvent } from "@/constants/commonfunctions";
import { DetailsProvider } from "../PujaDetails/PoojaDetailsContext";
import { pageview_event, save_event } from "@/constants/eventlogfunctions";
import { videoSource } from "@/commonvaribles/constant_variable";
import { updateVideo } from "@/store/slices/commonSlice";
import ChadhavaDetailsSkeleton from "../../skeletons/chadhava/ChadhavaDetailsSkeleton/ChadhavaDetailsSkeleton";
const {
  GET: { chadhaava_getchadhaavaById },
} = urlFetchCalls;

function ChadhavaPage(props: DIProps) {
  const { request, redux, dispatch } = props;
  const params = useParams();
  const chadhava_id: any = params?.chadhava_id;
  const controller = new AbortController();
  const [loading, setLoading] = useState(false);
  const [chadhavaData, setChadhavaData] = useState<any>(undefined);
  const showPrasad = [
    "0f56b4b1-24dd-4e5c-9913-989675805e55",
    "6fbc49ec-d117-491d-aac5-accb4ebf4aef",
  ];
  const getChadhavaDetailsById = () => {
    setLoading(true);
    if (request)
      request
        .GET(
          chadhaava_getchadhaavaById +
            (chadhava_id?.split("__")[0] ?? "MAHAKAAL_CHADHAAVA"),
          {
            signal: controller.signal,
          }
        )
        .then((res: any) => {
          if (res?.data?.length > 0) {
            if (showPrasad.includes(res.data[0].chadhaavaId)) {
              // const prasadData = res?.data?.[0]?.addOns?.prasad;
              // prasadData[0]["count"] = 1;
            } else {
              const offeringData = res?.data?.[0]?.addOns?.moreOffering;
              offeringData[0]["count"] = 1;
            }

            setChadhavaData(res?.data);
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
              transformToViewItemEvent(res.data[0], "Chadhava")
            );
            const eventParams = pageview_event("Chadhava View", {
              chadhaavaId: res?.data?.[0]?.chadhaavaId ?? "",
              chadhaavaName: res?.data?.[0]?.chadhaavaName ?? "",
            });
            save_event(redux?.auth?.authToken, "Chadhava View", [eventParams]);
          } else setChadhavaData([]);
        })
        .finally(() => {
          setLoading(false);
        });
  };

  useEffect(() => {
    if (!loading && !chadhavaData) getChadhavaDetailsById();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      {!chadhavaData ? (
        <ChadhavaDetailsSkeleton />
      ) : chadhavaData && chadhavaData?.length == 0 ? (
        <div className="error-message">
          <DataNotFound />
        </div>
      ) : (
        <DetailsProvider>
          <ChadhavaDetails data={chadhavaData} />
        </DetailsProvider>
      )}
    </>
  );
}
const WrappedPage = DI(ChadhavaPage) as unknown as React.FC;

export default WrappedPage;

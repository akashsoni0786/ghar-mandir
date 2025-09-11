import { useEffect, useState } from "react";
import VideoSliderWithStaticData from "../Common/VideoSlider/VideoSliderWithStaticData";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import { urlFetchCalls } from "@/constants/url";
import useTrans from "@/customHooks/useTrans";
const {
  GET: { add_getDevineExperience },
} = urlFetchCalls;
const VideoBoxes = ({ request, redux }: DIProps) => {
  const [data, setData] = useState<any>(undefined);
  const t = useTrans(redux?.common?.language);
  useEffect(() => {
    if (!data && request) {
      request.GET(add_getDevineExperience).then((res: any) => {
        setData(res.data ?? []);
      });
    }
  }, []);
  return data && data?.length > 0 ? (
    <div className="upcoming-events">
      <div>
        <h3 className="upcoming-events--heading">
          {t("BLESSED_MOMENTS_VIDEO_HEAD")}
        </h3>
      </div>
      <div className="videobox-container ph-des-16">
        <VideoSliderWithStaticData
          devineExperience={data}
          eventData={{
            page: "Home Page",
            eventName: t("DIVINE_EXPERIENCE"),
          }}
        />
      </div>
    </div>
  ) : (
    <></>
  );
};
export default DI(VideoBoxes);

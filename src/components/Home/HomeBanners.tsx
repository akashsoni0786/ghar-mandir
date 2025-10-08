import { DI } from "@/core/DependencyInjection";
import CarouselBanner from "../Common/CarouselBanner";
import { DIProps } from "@/core/DI.types";
import { useEffect, useState } from "react";
import { urlFetchCalls } from "@/constants/url";
import LittleKrishnaBanner from "../Common/CarouselBanners/LittleKrishna";
import {
  button_event,
  pageview_event,
  save_event,
} from "@/constants/eventlogfunctions";
import { updateMobFooter, updateVideo } from "@/store/slices/commonSlice";
import BannerSkeleton from "@/skeletons/banner/BannerSkeleton";
const {
  POST: { categoryPage_getBanners },
} = urlFetchCalls;
const HomeBanners = ({ request, redux, dispatch }: DIProps) => {
  const [banners, setBanners] = useState<any>([]);
  const [bannerLoad, setBannerLoad] = useState(true);
  const bannerImages = () => {
    if (request) {
      setBannerLoad(true);
      request
        .POST(categoryPage_getBanners, {
          pageType: "ALL",
        })
        .then((res: any) => {
          if (res?.data) {
            let data: any = [];
            res?.data?.forEach((val: any, idx: number) => {
              data.push(
                <LittleKrishnaBanner
                  type={"home"}
                  data={val?.poojaDetails}
                  priority={idx === 0}
                  eventData={() => {
                    const eventbtn = button_event(
                      "Participate Now",
                      "Home Banner : " + (val?.poojaDetails?.heading ?? ""),
                      "Home Page"
                    );
                    const eventParams = pageview_event(
                      val?.poojaDetails?.heading
                    );
                    save_event(redux?.auth?.authToken, "Home Page", [
                      eventbtn,
                      eventParams,
                    ]);
                  }}
                />
              );
            });
            setBanners([...banners, ...data]);
          } else {
            setBanners([]);
          }
        })
        .finally(() => {
          setBannerLoad(false);
        });
    }
  };
  useEffect(() => {
    if (banners?.length == 0) {
      bannerImages();
    }
    if (dispatch) {
      dispatch(
        updateVideo({
          video_data: redux?.common?.default_videoSource,
        })
      );

      dispatch(
        updateMobFooter({
          showMobFooter: {
            mobFooter: false,
            timeBanner: false,
          },
        })
      );
    }
  }, []);

  return bannerLoad ? (
     <BannerSkeleton />
  ) : (
    <CarouselBanner itemList={banners} />
  );
};
export default DI(HomeBanners);

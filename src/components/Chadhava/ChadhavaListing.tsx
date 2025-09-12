import CarouselBanner from "../Common/CarouselBanner";
import LittleKrishnaBanner from "../Common/CarouselBanners/LittleKrishna";
import "../../styles/Listing.css";
import SpiritualGuidanceBanner from "../Common/Banner";
import { useEffect, useState } from "react";
import ChadhavaCard from "../Common/ChadhavaCard";
import { updateMobFooter, updateVideo } from "@/store/slices/commonSlice";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import { urlFetchCalls } from "@/constants/url";
import {
  filterResult,
  transformToListingDataLayer,
} from "@/constants/commonfunctions";
import LoadingSpinner from "../Common/Loadings/LoadingSpinner";
import SearchFilterEmpty from "../NoDataComponents/SearchFilterEmpty";
import { pushToDataLayerWithoutEvent } from "@/lib/gtm";
import {
  button_event,
  pageview_event,
  save_event,
} from "@/constants/eventlogfunctions";
import SearchFilter from "../Common/SearchFilter";
import { filters, videoSource } from "@/commonvaribles/constant_variable";
import useTrans from "@/customHooks/useTrans";
import ChadhavaListingSkeleton from "../../skeletons/chadhava/ChadhavaListingSkeleton/ChadhavaListingSkeleton";
import BannerSkeleton from "@/skeletons/banner/BannerSkeleton";
const {
  POST: { categoryPage_details, categoryPage_getBanners },
} = urlFetchCalls;
const ChadhavaListing = ({ dispatch, request, redux }: DIProps) => {
  const t = useTrans(redux?.common?.language);
  const [visibleCount, setVisibleCount] = useState(4);
  const [allChadhava, setAllChadhava] = useState([]);
  const [allChadhavaClone, setAllChadhavaClone] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({});
  const [banners, setBanners] = useState<any>(undefined);
  const [bannerLoad, setBannerLoad] = useState(true);
  const showMoreCards = () => {
    // Show 3 more cards each time, or show all if remaining cards are less than 3
    setVisibleCount((prev) => Math.min(prev + 4, allChadhava.length));
  };

  const getChadhavaData = (params) => {
    if (request) {
      setLoading(true);
      request
        .POST(categoryPage_details, params)
        .then((res: any) => {
          setAllChadhava(res?.data ?? []);
          setAllChadhavaClone(res?.data ?? []);
          const eventData = transformToListingDataLayer(
            res.data ?? [],
            "Chadhava List",
            "chadhava_list",
            "Chadhava"
          );
          if (dispatch) {
            dispatch(
              updateVideo({
                video_data: videoSource,
              })
            );
          }
          pushToDataLayerWithoutEvent(eventData);
          const eventParams = pageview_event("Chadhava Listing");
          save_event(redux?.auth?.authToken, "Chadhava Listing", [eventParams]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const bannerImages = () => {
    if (request) {
      setBannerLoad(true);
      request
        .POST(categoryPage_getBanners, {
          pageType: "CHADHAVAA",
        })
        .then((res: any) => {
          if (res?.data) {
            let data: any = [];
            res?.data?.forEach((val: any, idx: number) => {
              data.push(
                <LittleKrishnaBanner
                  type={"chadhava"}
                  key={idx}
                  data={val?.poojaDetails}
                  eventData={() => {
                    const eventbtn = button_event(
                      "Participate Now",
                      "Chadhava Banner : " + (val?.poojaDetails?.heading ?? ""),
                      "Chadhava Listing"
                    );
                    const eventParams = pageview_event("Chadhava View");
                    save_event(redux?.auth?.authToken, "Chadhava Listing", [
                      eventbtn,
                      eventParams,
                    ]);
                  }}
                />
              );
            });
            setBanners(data);
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
    const param = {
      pageType: "CHADHAVAA",
    };
    getChadhavaData(param);
  }, []);
  useEffect(() => {
    const filteredPujas: any = filterResult(allChadhavaClone, params);
    setAllChadhava(filteredPujas);
  }, [params, allChadhavaClone]);
  useEffect(() => {
    if (!banners) {
      bannerImages();
    }
  }, [banners]);
  useEffect(() => {
    if (dispatch) {
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
  return (
    <div>
      {bannerLoad ? (
        <BannerSkeleton />
      ) : (
        <div style={{ margin: "20px 0 20px 0" }}>
          <CarouselBanner itemList={banners} />
        </div>
      )}

      {loading ? (
        <ChadhavaListingSkeleton />
      ) : (
        <div className="container">
          <h2 className="category-heading ph-16">
            {t("UPCOMING_CHADHAVA_HEAD")}
          </h2>
          <p className="category-description ph-16">
            {t("UPCOMING_CHADHAVA_SUBHEAD")}
          </p>
          <SearchFilter
            type={"Search Chadhava"}
            changedData={setParams}
            filters={filters}
          />
          <div className="horizontal-line-gray"></div>
          <p className="listing-result ph-16">
            Search Result ({allChadhava?.length ?? 0})
          </p>
          {allChadhava.length == 0 ? (
            <SearchFilterEmpty />
          ) : (
            <div className="listing-cards">
              {allChadhava
                // .slice(0, visibleCount)
                .map((item: any, index: number) => (
                  <ChadhavaCard
                    key={index}
                    data={item}
                    index={index}
                    eventData={() => {
                      const eventbtn = button_event(
                        "Participate Now",
                        "Chadhava Card : " + (item?.heading ?? ""),
                        "Chadhava Listing"
                      );
                      const eventParams = pageview_event("Chadhava View");
                      save_event(redux?.auth?.authToken, "Chadhava Listing", [
                        eventbtn,
                        eventParams,
                      ]);
                    }}
                  />
                ))}
            </div>
          )}
          {/* <div className="show-more-btn">
          {visibleCount < allChadhava.length && (
            <TextButton
              children={"Show More Chadhava"}
              onClick={showMoreCards}
            />
          )}
        </div> */}
          {/* <div className="horizontal-line-gray"></div>
        <div className="containerlist-box">
          <h3 className="containerlist-box-heading ph-1">
            Recommended Chadhava
          </h3>
          <p className="containerlist-box-description ph-1">
            Discover pujas specially chosen to match your intentions and
            spiritual needs.
          </p>
          <div className="recommended-puja-rows ph-mob-1">
            <RecommendedPujaCard />
            <RecommendedPujaCard />
            <RecommendedPujaCard />
            <RecommendedPujaCard />
          </div>
        </div> */}
          <div className="ph-1">
            {" "}
            <SpiritualGuidanceBanner />{" "}
          </div>
        </div>
      )}
    </div>
  );
};

export default DI(ChadhavaListing);

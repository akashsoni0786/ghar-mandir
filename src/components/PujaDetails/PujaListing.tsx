import CarouselBanner from "../Common/CarouselBanner";
import LittleKrishnaBanner from "../Common/CarouselBanners/LittleKrishna";
import "../../styles/Listing.css";
import SpiritualGuidanceBanner from "../Common/Banner";
import SearchFilter from "../Common/SearchFilter";
import { useEffect, useState } from "react";
import PujaCard from "../Common/PujaCard";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import { updateMobFooter, updateVideo } from "@/store/slices/commonSlice";
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
import useTrans from "@/customHooks/useTrans";
import { filters, videoSource } from "@/commonvaribles/constant_variable";
const {
  POST: { categoryPage_details, categoryPage_getBanners },
} = urlFetchCalls;
const PujaListing = (props: DIProps) => {
  const { dispatch, request, redux } = props;
  const t = useTrans(redux?.common?.language);
  const [visibleCount, setVisibleCount] = useState(4);
  const [allPuja, setAllPuja] = useState([]);
  const [allPujaClone, setAllPujaClone] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<any>({});
  const [banners, setBanners] = useState<any>(undefined);
  const [bannerLoad, setBannerLoad] = useState(true);

  const showMoreCards = () => {
    setVisibleCount((prev) => Math.min(prev + 4, allPuja.length));
  };
  const getPujaData = (params) => {
    if (request) {
      setLoading(true);
      request
        .POST(categoryPage_details, params)
        .then((res: any) => {
          setAllPuja(res?.data);
          setAllPujaClone(res?.data);
          if (dispatch) {
            dispatch(
              updateVideo({
                video_data: videoSource,
              })
            );
          }
          pushToDataLayerWithoutEvent(
            transformToListingDataLayer(
              res.data,
              "Puja List",
              "puja_list",
              "Puja"
            )
          );
          const eventParams = pageview_event("Puja Listing");
          save_event(redux?.auth?.authToken, "Puja Listing", [eventParams]);
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
          pageType: "PUJA",
          // pageType: "CHADHAAVA",
        })
        .then((res: any) => {
          if (res?.data) {
            let data: any = [];
            res?.data?.forEach((val: any, idx: number) => {
              data.push(
                <LittleKrishnaBanner
                  type={"puja"}
                  key={idx}
                  data={val?.poojaDetails}
                  eventData={() => {
                    const eventbtn = button_event(
                      "Participate Now",
                      "Puja Banner : " + (val?.poojaDetails?.heading ?? ""),
                      "Puja Listing"
                    );
                    const eventParams = pageview_event("Puja View");
                    save_event(redux?.auth?.authToken, "Puja Listing", [
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
      pageType: "PUJA",
    };
    getPujaData(param);
  }, []);

  useEffect(() => {
    const filteredPujas: any = filterResult(allPujaClone, params);
    setAllPuja(filteredPujas);
  }, [params, allPujaClone]);

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
      <div style={{ margin: "20px 0 20px 0" }}>
        {bannerLoad ? (
          <div className="box-loader">
            <LoadingSpinner />
          </div>
        ) : (
          <CarouselBanner itemList={banners} />
        )}
      </div>
      <div className="container">
        <h2 className="category-heading ph-16">{t("UPCOMING_PUJA_HEAD")}</h2>
        <p className="category-description ph-16">
          {t("UPCOMING_PUJA_SUBHEAD")}
        </p>
        <SearchFilter
          type={"Search Puja"}
          changedData={(e) => {
            setParams(e);
          }}
          filters={filters}
        />
        <div className="horizontal-line-gray"></div>
        <p className="listing-result ph-16">
          Search Result ({allPuja.length ?? 0})
        </p>

        {loading || !params ? (
          <div className="box-loader">
            <LoadingSpinner />
          </div>
        ) : allPuja.length == 0 ? (
          <SearchFilterEmpty />
        ) : (
          <div className="listing-cards">
            {allPuja
              // .slice(0, visibleCount)
              .map((item: any, index) => (
                <PujaCard
                  key={index}
                  data={item}
                  index={index}
                  eventData={() => {
                    const eventbtn = button_event(
                      "Participate Now",
                      "Puja Card : " + (item?.heading ?? ""),
                      "Puja Listing"
                    );
                    const eventParams = pageview_event("Puja View");
                    save_event(redux?.auth?.authToken, "Puja Listing", [
                      eventbtn,
                      eventParams,
                    ]);
                  }}
                />
              ))}
          </div>
        )}

        {/* <div className="show-more-btn">
          {visibleCount < allPuja.length && (
            <TextButton children={"Show More Puja"} onClick={showMoreCards} />
          )}
        </div> */}
        {/* <div className="horizontal-line-gray"></div>
        <div className="containerlist-box">
          <h3 className="containerlist-box-heading ph-1">Recommended Pujas</h3>
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
    </div>
  );
};

export default DI(PujaListing);

import CarouselBanner from "../Common/CarouselBanner";
import LittleKrishnaBanner from "../Common/CarouselBanners/LittleKrishna";
import "../../styles/Listing.css";
import RecommendedPujaCard from "../PujaComponents/RecommendedPujaCard";
import SpiritualGuidanceBanner from "../Common/Banner";
import SearchFilter from "../Common/SearchFilter";
import { useEffect, useState } from "react";
import { TextButton } from "../Common/Buttons";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import { updateMobFooter } from "@/store/slices/commonSlice";
import { urlFetchCalls } from "@/constants/url";
import {
  getActiveFilters,
  transformToListingDataLayer,
} from "@/constants/commonfunctions";
import LoadingSpinner from "../Common/Loadings/LoadingSpinner";
import SearchFilterEmpty from "../NoDataComponents/SearchFilterEmpty";
import { pushToDataLayerWithoutEvent } from "@/lib/gtm";
import { filters } from "@/commonvaribles/constant_variable";
import TempleCard from "../Common/TempleCard";
const {
  POST: { categoryPage_details, categoryPage_getBanners },
} = urlFetchCalls;
const PujaListing = (props: DIProps) => {
  const { dispatch, request } = props;
  const [visibleCount, setVisibleCount] = useState(4);
  const [allPuja, setAllPuja] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({});
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
          setAllPuja([...res?.data,...res?.data,...res?.data]);
          pushToDataLayerWithoutEvent(
            transformToListingDataLayer(
              res.data,
              "Puja List",
              "puja_list",
              "Puja"
            )
          );
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
                  data={val?.poojaDetails}
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
    if (params) {
      const filter = getActiveFilters(params);
      const param = {
        pageType: "PUJA",
        ...filter,
      };
      getPujaData(param);
    }
  }, [params]);
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
        <h2 className="category-heading ph-16">Temples</h2>
        
        <SearchFilter
          type={"Temple"}
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
            {allPuja?.slice(0, visibleCount).map((item, index) => (
              <TempleCard key={index} data={item} index={index} />
            ))}
          </div>
        )}

        <div className="show-more-btn">
          {visibleCount < allPuja.length && (
            <TextButton children={"Show More Temples"} onClick={showMoreCards} />
          )}
        </div>
        <div className="horizontal-line-gray"></div>
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
        </div>
        <div className="ph-1">
          {" "}
          <SpiritualGuidanceBanner />{" "}
        </div>
      </div>
    </div>
  );
};

export default DI(PujaListing);

import { urlFetchCalls } from "@/constants/url";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import { useEffect, useState } from "react";
import ZeroResponse from "../NoDataComponents/ZeroResponse";
import LoadingSpinner from "../Common/Loadings/LoadingSpinner";
import PujaCard from "../Common/PujaCard";
import ShowMoreCard from "../Common/Cards/ShowMoreCard";
import useWindow from "@/customHooks/useWindows";
import {
  button_event,
  pageview_event,
  save_event,
} from "@/constants/eventlogfunctions";
import useTrans from "@/customHooks/useTrans";
const {
  POST: { categoryPage_details },
} = urlFetchCalls;
const PujaEvents = ({ request, redux }: DIProps) => {
  const t = useTrans(redux?.common?.language);
  const { width } = useWindow();
  const [allPuja, setAllPuja] = useState<any>(undefined);
  const [pujaLoading, setPujaLoading] = useState(false);
  const getPujaData = (params) => {
    if (request) {
      setPujaLoading(true);
      request
        .POST(categoryPage_details, params)
        .then((res: any) => {
          setAllPuja(res?.data ?? []);
        })
        .finally(() => {
          setPujaLoading(false);
        });
    }
  };

  useEffect(() => {
    if (!allPuja) {
      getPujaData({
        pageType: "PUJA",
      });
    }
  }, []);
  return (
    <div className="upcoming-events">
      <div className="ph-16">
        <h3 className="upcoming-events--heading">{t("UPCOMING_PUJA_HEAD")}</h3>
        <p className="upcoming-events--description">
          {t("UPCOMING_PUJA_DESC")}
        </p>
      </div>
      {pujaLoading ? (
        <div className="page-loader">
          <LoadingSpinner />
        </div>
      ) : allPuja && allPuja.length > 0 ? (
        <div className="upcoming-events--databox">
          <div
            className={
              width > 1200
                ? "upcoming-events--databox-cards"
                : "date-temple-cards"
            }
          >
            {allPuja?.slice(0, 3)?.map((item, idx) => (
              <PujaCard
                key={idx}
                data={item}
                path={"home"}
                eventData={() => {
                  const eventbtn = button_event(
                    "Participate Now",
                    "Puja Card : " + (item?.heading ?? ""),
                    "Home Page"
                  );
                  const eventParams = pageview_event("Puja View");
                  save_event(redux?.auth?.authToken, "Home Page", [
                    eventbtn,
                    eventParams,
                  ]);
                }}
              />
            ))}
            <ShowMoreCard
              path={"puja"}
              eventData={() => {
                const eventbtn = button_event(
                  "Explore More",
                  "Upcoming Puja Event Cards",
                  "Home Page"
                );
                const eventParams = pageview_event("Puja Listing");
                save_event(redux?.auth?.authToken, "Home Page", [
                  eventbtn,
                  eventParams,
                ]);
              }}
            />
          </div>
          {/* <p
            onClick={() => {
              route.push("/puja");
            }}
            className="upcoming-events--databox-redirect ph-mob-16"
          >
            View all puja
          </p> */}
          <div className="horizontal-line-gray" />
        </div>
      ) : (
        allPuja && allPuja.length == 0 && <ZeroResponse value={"Puja"} />
      )}
    </div>
  );
};
export default DI(PujaEvents);

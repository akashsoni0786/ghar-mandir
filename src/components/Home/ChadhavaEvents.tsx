import "./Home.css";
import ChadhavaCard from "../Common/ChadhavaCard";
import { useEffect, useState } from "react";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import { urlFetchCalls } from "@/constants/url";
import ZeroResponse from "../NoDataComponents/ZeroResponse";
import LoadingSpinner from "../Common/Loadings/LoadingSpinner";
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
const ChadhavaEvents = ({ request, redux }: DIProps) => {
  const { width } = useWindow();
  const t = useTrans(redux?.common?.language);
  const [allChadhava, setAllChadhava] = useState<any>(undefined);
  const [chadhavaLoading, setChadhavaLoading] = useState(false);

  const getChadhavaData = (params) => {
    if (request) {
      setChadhavaLoading(true);
      request
        .POST(categoryPage_details, params)
        .then((res: any) => {
          setAllChadhava(res?.data ?? []);
        })
        .finally(() => {
          setChadhavaLoading(false);
        });
    }
  };
  useEffect(() => {
    if (!allChadhava) {
      getChadhavaData({
        pageType: "CHADHAVAA",
      });
    }
  }, []);
  return allChadhava && allChadhava.length > 0 ? (
    <div className="upcoming-events">
      <div className="ph-16">
        <h3 className="upcoming-events--heading">
          {t("UPCOMING_CHADHAVA_HEAD")}
        </h3>
        <p className="upcoming-events--description">
          {t("UPCOMING_CHADHAVA_DESC")}
        </p>
      </div>
      {chadhavaLoading ? (
        <div className="page-loader">
          <LoadingSpinner />
        </div>
      ) : allChadhava && allChadhava.length > 0 ? (
        <div className="upcoming-events--databox">
          <div
            className={
              width > 1200
                ? "upcoming-events--databox-cards"
                : "date-temple-cards"
            }
          >
            {allChadhava?.slice(0, 3)?.map((item: any, idx) => (
              <ChadhavaCard
                key={idx}
                data={item}
                path={"home"}
                eventData={() => {
                  const eventbtn = button_event(
                    "Participate Now",
                    "Chadhava Card : " + (item?.heading ?? ""),
                    "Home Page"
                  );
                  const eventParams = pageview_event("Chadhava View");
                  save_event(redux?.auth?.authToken, "Home Page", [
                    eventbtn,
                    eventParams,
                  ]);
                }}
              />
            ))}
            <ShowMoreCard
              path={"chadhava"}
              eventData={() => {
                const eventbtn = button_event(
                  "Explore More",
                  "Upcoming Events Cards",
                  "Home Page"
                );
                const eventParams = pageview_event("Chadhava Listing");
                save_event(redux?.auth?.authToken, "Home Page", [
                  eventbtn,
                  eventParams,
                ]);
              }}
            />
          </div>
          {/* <p
            onClick={() => {
              route.push("/chadhava");
            }}
            className="upcoming-events--databox-redirect  ph-mob-16"
          >
            View all chadhawa
          </p> */}
        </div>
      ) : (
        allChadhava &&
        allChadhava.length == 0 && <ZeroResponse value={"Chadhava"} />
      )}
      <div className="horizontal-line-gray" />
    </div>
  ) : (
    <></>
  );
};
export default DI(ChadhavaEvents);

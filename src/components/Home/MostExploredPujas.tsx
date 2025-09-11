import { urlFetchCalls } from "@/constants/url";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import { useEffect, useState } from "react";
import ZeroResponse from "../NoDataComponents/ZeroResponse";
import LoadingSpinner from "../Common/Loadings/LoadingSpinner";
import DietyCard from "../Common/DietyCard";
import ShowMoreCard from "../Common/Cards/ShowMoreCard";
import useWindow from "@/customHooks/useWindows";
import {
  button_event,
  pageview_event,
  save_event,
} from "@/constants/eventlogfunctions";
const {
  POST: { categoryPage_details },
} = urlFetchCalls;
const MostExploredPujas = ({ request, redux }: DIProps) => {
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
      <div>
        <h3 className="upcoming-events--heading">Most explored pujas</h3>
        <p className="upcoming-events--description">
          Worship the Most Powerful & Beloved Deities
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
              <DietyCard
                key={idx}
                data={item}
                path={"home"}
                eventData={() => {
                  const eventbtn = button_event(
                    "Participate Now",
                    "Most Expolred Puja Card : " + (item?.heading ?? ""),
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
                  "Most Explored Puja Event Cards",
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
        </div>
      ) : (
        allPuja && allPuja.length == 0 && <ZeroResponse value={"Puja"} />
      )}
    </div>
  );
};
export default DI(MostExploredPujas);

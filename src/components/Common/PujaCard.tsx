import {
  CalenderWhiteIcon,
  ShareBorderedIcon,
  TempleWhiteIcon,
} from "@/assets/svgs";
import "../../styles/Listing.css";
import { useRouter } from "next/navigation";
import { transformToSelectItemEvent } from "@/constants/commonfunctions";
import { pushToDataLayerWithoutEvent } from "@/lib/gtm";
import { DarkBgButtonFw } from "./Buttons";
import { useState } from "react";
import ShareButton from "./ShareButton/ShareButton";
import useTrans from "@/customHooks/useTrans";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import { Tooltip } from "antd";
interface Props extends DIProps {
  data?: any;
  index?: any;
  path?: string;
  eventData?: any;
  listingPage?: boolean;
}

const PujaCard = ({
  data,
  index,
  path,
  eventData,
  redux,
  listingPage,
}: Props) => {
  const t = useTrans(redux?.common?.language);
  const [loading, setLoading] = useState(false);
  const route = useRouter();
  const addIntoDataLayer = () => {
    pushToDataLayerWithoutEvent(
      transformToSelectItemEvent(data, "Puja List", "puja_list", index, "Puja")
    );
  };
  function getTimeLeft(endDateObj) {
    if (!endDateObj)
      return <div className="card-participate--header">{"Ongoing"}</div>;

    // Construct the future date (month is 0-indexed in JavaScript)
    const eventDate: any = new Date(
      endDateObj.year,
      endDateObj.month - 1, // Month is 0-based (0 = January)
      endDateObj.day,
      endDateObj.hour,
      endDateObj.min
    );

    const now: any = new Date();
    const diff = eventDate - now;

    if (diff <= 0)
      return (
        <div className="card-participate--header">{"Event has ended"}</div>
      );

    // Calculate remaining time
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return (
      <div className="card-participate--header">
        {days ?? ""} Days | {hours ?? ""} Hrs | {mins ?? ""} Mins
      </div>
    );
  }
  const shareUrl = () => {
    if (window.location.href.includes("/puja"))
      return `${window.location.href}/${data?.poojaName}`;
    else return `${window.location.href}puja/${data?.poojaName}`;
  };
  return (
    <a
      href={`/puja/${data?.poojaName}`}
      onClick={() => {
        setLoading(true);
        addIntoDataLayer();
        route.push(`/puja/${data?.poojaName}`);
        if (eventData) eventData();
      }}
      className={`card-participate ${
        listingPage ? "" : "scrollable-boxes--child"
      }`}
      style={{
        backgroundImage: `
        linear-gradient(0deg, rgba(19, 33, 2, 0.5) 30%, rgba(19, 33, 2, 0.2) 60%, rgba(19, 33, 2, 0) 69%),
        url(${
          data?.categoryImage ??
          data?.image ??
          "https://imgcdn.stablediffusionweb.com/2024/9/12/c9396a6d-6a9b-4a6f-a413-ed735e75a3ba.jpg"
        })`,
      }}
    >
      {getTimeLeft(data?.poojaEndDate)}
      <div className="card-participate--data">
        <h3 className="card-participate--title">
          {data.heading?.length > 45 ? (
            <Tooltip
              placement="topRight"
              title={data.heading}
            >{`${data.heading?.slice(0, 45)}...`}</Tooltip>
          ) : (
            data.heading
          )}
        </h3>
        {/* <p className="card-participate--description">
          {data.description?.length > 69
            ? `${data.description?.slice(0, 69)}...`
            : data.description}
        </p> */}
        <div className="horizontal-line"></div>
        <div className="card-participate--temple-date">
          <div className="card-participate--temple">
            <span>
              <TempleWhiteIcon />
            </span>

            <span>{data?.poojaTemple ?? ""}</span>
          </div>
          <div className="card-participate--date">
            <span>
              <CalenderWhiteIcon />
            </span>
            <span>{data?.poojaDay ?? ""}</span>
          </div>
        </div>
        <div className="card-participate--actions">
          <DarkBgButtonFw
            onClick={() => {
              setLoading(true);
              addIntoDataLayer();
              route.push(`/puja/${data?.poojaName}`);
            }}
            isLoading={loading}
          >
            {t("PARTICIPATE_NOW")}
          </DarkBgButtonFw>
          {path != "home" && (
            <span
              className="card-participate--actions-share"
              onClick={(e) => e.stopPropagation()}
            >
              <ShareButton
                size={20}
                url={shareUrl()}
                triggerComponent={<ShareBorderedIcon />}
              />
            </span>
          )}
        </div>
      </div>
    </a>
  );
};
export default DI(PujaCard);

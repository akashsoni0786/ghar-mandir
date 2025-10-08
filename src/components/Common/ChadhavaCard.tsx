import {
  CalenderWhiteIcon,
  ShareBorderedIcon,
  TempleWhiteIcon,
} from "@/assets/svgs";
import "../../styles/Listing.css";
import { useRouter } from "next/navigation";
import {
  formatTitles,
  transformToSelectItemEvent,
} from "@/constants/commonfunctions";
import { pushToDataLayerWithoutEvent } from "@/lib/gtm";
import { DarkBgButtonFw } from "./Buttons";
import { useState } from "react";
import useWindow from "@/customHooks/useWindows";
import ShareButton from "./ShareButton/ShareButton";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import useTrans from "@/customHooks/useTrans";
import { Tooltip } from "antd";
interface Props extends DIProps {
  data?: any;
  index?: any;
  path?: string;
  eventData?: any;
  listingPage?: boolean;
}

const ChadhavaCard = ({
  data,
  index,
  path,
  eventData,
  redux,
  listingPage,
}: Props) => {
  const t = useTrans(redux?.common?.language);
  const route = useRouter();
  const { width } = useWindow();
  const [loading, setLoading] = useState(false);

  const addIntoDataLayer = () => {
    pushToDataLayerWithoutEvent(
      transformToSelectItemEvent(
        data,
        "Chadhava List",
        "chadhava_list",
        index,
        "Chadhava"
      )
    );
  };

  function getTimeLeft(endDateObj) {
    if (!endDateObj)
      return <div className="card-participate--header">{"Ongoing"}</div>;

    const eventDate: any = new Date(
      endDateObj.year,
      endDateObj.month - 1,
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
    if (window.location.href.includes("/chadhava"))
      return `${window.location.href}/${data?.chadhaavaName}`;
    else return `${window.location.href}chadhava/${data?.chadhaavaName}`;
  };

  return (
    <a
      href={`/chadhava/${data?.chadhaavaName}`}
      onClick={() => {
        setLoading(true);
        addIntoDataLayer();
        route.push(`/chadhava/${data?.chadhaavaName}`);
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
          data.image ??
          "https://d28wmhrn813hkk.cloudfront.net/uploads/1751886008290-ukdwt.webp"
        })`,
      }}
    >
      {getTimeLeft(data?.chadhaavaEndDate)}
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

        {/* Offerings Section (Unique to ChadhavaCard) */}
        <div className="card-participate--offeringbox">
          <div className="card-participate--offering-content">
            <div className="card-participate--offering-imgs">
              {data?.offerings.slice(0, 4)?.map((img: any, idx: number) => (
                <img
                  key={idx}
                  className={`card-participate--offering-img chdw-img-${
                    idx + 1
                  }`}
                  alt="offering"
                  src={
                    img?.image ??
                    "https://cdn.cdnparenting.com/articles/2019/03/22170959/378178690-H.webp"
                  }
                />
              ))}
            </div>
            <p
              className="card-participate--offering-values"
              style={
                width > 551 || width < 330
                  ? { width: "150px" }
                  : { width: "200px" }
              }
            >
              {formatTitles(data?.offerings, 2) ?? ""}
            </p>
          </div>
        </div>

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
              route.push(`/chadhava/${data?.chadhaavaName}`);
              if (eventData) eventData();
            }}
            children={t("PARTICIPATE_NOW")}
            isLoading={loading}
          />
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

export default DI(ChadhavaCard);

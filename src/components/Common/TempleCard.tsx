import {
  BlessingIcon,
  CalenderWhiteIcon,
  HealingIcon,
  ProtectionIcon,
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
const TempleCard = ({ data, index }: any) => {
  const [loading, setLoading] = useState(false);
  const route = useRouter();
  const addIntoDataLayer = () => {
    // pushToDataLayerWithoutEvent(
    //   transformToSelectItemEvent(data, "Puja List", "puja_list", index, "Puja")
    // );
  };
  const shareUrl = () => {
   return `${window.location.href}temples/${data?.poojaName}`;
  };
  return (
    <div
      onClick={() => {
        setLoading(true);
        addIntoDataLayer();
        route.push(`/temples/${data?.poojaName}`);
      }}
      className="card-participate"
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
      <div className="card-participate--header2">
        {data?.tag ?? "Puja"}
      </div>
      <div className="card-participate--data">
        <h3 className="card-participate--title">
          {data.heading?.length > 35
            ? `${data.heading?.slice(0, 35)}...`
            : data.heading}
        </h3>
        <div className="card-participate--temple-date">
          <div className="card-participate--temple">
            <span>
              <TempleWhiteIcon />
            </span>

            <span>{data?.poojaTemple ?? ""}</span>
          </div>
        </div>
        <div className="horizontal-line"></div>
        <div className="flex-btw">
          <div className="flex-btw-col">
            <HealingIcon className="diety-label" />
            <p className="diety-label">Healing</p>
          </div>
          <div className="flex-btw-col">
            <ProtectionIcon />
            <p className="diety-label">Protection</p>
          </div>
          <div className="flex-btw-col">
            <BlessingIcon />
            <p className="diety-label">Blessing</p>
          </div>
        </div>
        <div className="card-participate--actions">
          <DarkBgButtonFw
            onClick={() => {
              setLoading(true);
              //   addIntoDataLayer();
              //   route.push(`/puja/${data?.poojaName}`);
            }}
            children={"Participate Now"}
            isLoading={loading}
          />
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
        </div>
      </div>
    </div>
  );
};
export default TempleCard;

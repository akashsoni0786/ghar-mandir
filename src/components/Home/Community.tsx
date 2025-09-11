import {
  FacebookClrIcon,
  InstagramClrIcon,
  ShieldRed,
  YoutubeClrIcon,
} from "@/assets/svgs";
import MakeInIndia from "../../assets/images/makeinindia.png";
import Startup from "../../assets/images/startup.png";
import Image from "next/image";
import { urlFetchCalls } from "@/constants/url";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import useTrans from "@/customHooks/useTrans";
const {
  SHARE_LINKS: { facebook, instagram, youtube },
} = urlFetchCalls;
const Community = ({ redux }: DIProps) => {
  const t = useTrans(redux?.common?.language);
  return (
    <div className="upcoming-events">
      <div>
        <h3 className="upcoming-events--heading">
          {t("JOIN_OUR_DIVINE_COMMUNITY")}
        </h3>
      </div>
      <div className="community-container ph-mob-16">
        <div className="community">
          <div
            className="community-item"
            onClick={() => {
              window.location.href = facebook;
            }}
          >
            <FacebookClrIcon />
            <span className="community-item--label">37K+ followers</span>
          </div>

          <div
            className="community-item"
            onClick={() => {
              window.location.href = instagram;
            }}
          >
            <InstagramClrIcon />
            <span className="community-item--label">62K+ followers</span>
          </div>

          <div
            className="community-item"
            onClick={() => {
              window.location.href = youtube;
            }}
          >
            <YoutubeClrIcon />
            <span className="community-item--label">1k+ subscribers</span>
          </div>
        </div>
      </div>
      <div className="startup-container ph-mob-16">
        <div className="community-enterpnur">
          <Image
            src={MakeInIndia}
            alt="makeinindia"
            className="startup-image"
          />

          <Image src={Startup} alt="makeinindia" className="startup-image" />

          {/* <Image src={DPIIT} alt="makeinindia" className="startup-image3" />
           */}
          <ShieldRed className="startup-image3" />
        </div>
      </div>
    </div>
  );
};
export default DI(Community);

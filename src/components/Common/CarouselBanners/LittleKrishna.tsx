import "../../../styles/Banner.css";
import { CalenderWhiteIcon, TempleWhiteIcon } from "@/assets/svgs";
import { DarkBgButton } from "../Buttons";
import useWindow from "@/customHooks/useWindows";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useTrans from "@/customHooks/useTrans";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import { Tooltip } from "antd";
interface Props extends DIProps {
  data?: any;
  type?: any;
  eventData?: any;
}
const LittleKrishnaBanner = ({ data, type, eventData, redux }: Props) => {
  const t = useTrans(redux?.common?.language);
  const { width } = useWindow();
  const route = useRouter();
  const [loading, setLoading] = useState(false);
  const [bannerData, setBannerData] = useState({
    heading: data?.heading,
    url: data?.name,
    location: data?.poojaTemple,
    time: data?.poojaDay,
    benefits: data?.topBenefits,
    image: data?.banners?.imageUrl,
  });
  useEffect(() => {
    setBannerData({
      heading: data?.heading,
      url: data?.name,
      location: data?.poojaTemple,
      time: data?.poojaDay,
      benefits: data?.topBenefits,
      image: data?.banners?.imageUrl,
    });
  }, [data]);
  return (
    Object.keys(bannerData).length > 0 && (
      <section className="puja-banner">
        <div className="banner-content">
          <h2 className="heading">
            <Tooltip placement="bottom" title={bannerData?.heading}>
              {bannerData?.heading?.slice(0, 30) + "...."}
            </Tooltip>
          </h2>
          <div className="temple-date">
            <div className="temple-date-flex">
              <span>
                <TempleWhiteIcon className="temple-date-icon" />
              </span>
              <span>{bannerData?.location}</span>
            </div>
            <div className="temple-date-flex">
              <span>
                <CalenderWhiteIcon className="temple-date-icon" />
              </span>
              <span>{bannerData?.time}</span>
            </div>
          </div>
          <div className="benefits">
            <div className="benefit-box">
              <span className="benefit">
                <img
                  className="benefit-box-icon"
                  src={bannerData.benefits?.[0]?.image}
                  alt={bannerData.benefits?.[0]?.title}
                />
              </span>
              <p className="benefit-box-label">
                {bannerData.benefits?.[0]?.title}
              </p>
            </div>
            <div className="benefit-box">
              <span className="benefit">
                <img
                  className="benefit-box-icon"
                  src={bannerData.benefits?.[1]?.image}
                  alt={bannerData.benefits?.[1]?.title}
                />
              </span>
              <p className="benefit-box-label">
                {bannerData.benefits?.[1]?.title}
              </p>
            </div>
            {width > 480 && (
              <div className="benefit-box">
                <span className="benefit">
                  <img
                    className="benefit-box-icon"
                    src={bannerData.benefits?.[2]?.image}
                    alt={bannerData.benefits?.[2]?.title}
                  />
                </span>
                <p className="benefit-box-label">
                  {bannerData.benefits?.[2]?.title}
                </p>
              </div>
            )}
            {width > 650 && (
              <div className="benefit-box">
                <span className="benefit">
                  <img
                    className="benefit-box-icon"
                    src={bannerData.benefits?.[3]?.image}
                    alt={bannerData.benefits?.[3]?.title}
                  />
                </span>
                <p className="benefit-box-label">
                  {bannerData.benefits?.[3]?.title}
                </p>
              </div>
            )}
          </div>
          {<div className="horizontal-line vertical-gap"></div>}
          {
            <div style={{ width: "300px" }}>
              <DarkBgButton
                children={t("PARTICIPATE_NOW")}
                onClick={() => {
                  if (eventData) eventData();
                  setLoading(true);
                  if (type == "home") {
                    if (data?.chadhaavaId)
                      route.push(`/chadhava/${bannerData?.url}`);
                    else route.push(`/puja/${bannerData?.url}`);
                  } else route.push(`/${type}/${bannerData?.url}`);
                }}
                isLoading={loading}
              />
            </div>
          }
        </div>

        <div className="banner-image">
          <img src={bannerData?.image} alt="Lord Krishna" />
          <div className="image-gradient-overlay"></div>
        </div>
      </section>
    )
  );
};

export default DI(LittleKrishnaBanner);

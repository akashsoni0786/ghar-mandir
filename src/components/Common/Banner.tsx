import { BannerDesign } from "@/assets/svgs";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import useTrans from "@/customHooks/useTrans";
import { useRouter } from "next/navigation";
import React from "react";

const SpiritualGuidanceBanner = ({ redux }: DIProps) => {
  const route = useRouter();
  const t = useTrans(redux?.common?.language);
  return (
    <div className="banner-wrapper ">
      <h2 className="banner-title">{t("SPIRITUAL_BANNER_HEAD")}</h2>
      <p className="banner-subtitle">{t("SPIRITUAL_BANNER_SUBHEAD_1")}</p>
      <p className="banner-subtitle">{t("SPIRITUAL_BANNER_SUBHEAD_2")}</p>
      <div className="banner-design-wrap">
        <BannerDesign className="banner-design" />
      </div>
      <div
        className="banner-button"
        onClick={() => {
          route.push("./contact-us");
          // window.location.href = whatsapp;
        }}
      >
        {t("SPIRITUAL_BANNER_BTN")}
      </div>
    </div>
  );
};

export default DI(SpiritualGuidanceBanner);

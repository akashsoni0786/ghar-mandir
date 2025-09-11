"use client";
import React from "react";
import { NoData } from "@/assets/svgs";
import "../../styles/NoFound.css";
import { DarkBgButton } from "@/components/Common/Buttons";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import useTrans from "@/customHooks/useTrans";
const SearchFilterEmpty = ({ redux }: DIProps) => {
  const t = useTrans(redux?.common?.language);
  return (
    <div className="container ph-16">
      <div className="content-box">
        <div className="emptyCartSvg">
          <NoData className="svg-width" />
        </div>
        <h1 className="title">{t("NO_MATCHING_RESULT")}</h1>
        <p className="message">{t("NO_MATCHING_RESULT_DESC")}</p>

        <div className="return-btn">
          <DarkBgButton
            children={"Try Again"}
            onClick={() => {
              window.location.reload();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DI(SearchFilterEmpty);

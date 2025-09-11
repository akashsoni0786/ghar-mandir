"use client";
import React from "react";
import { NoData } from "@/assets/svgs";
import "../../styles/NoFound.css";
import { DarkBgButton } from "@/components/Common/Buttons";
import useTrans from "@/customHooks/useTrans";
const DataNotFound = () => {
  const t = useTrans("");
  return (
    <div className="container ph-16">
      <div className="content">
        <div className="emptyCartSvg">
          <NoData className="svg-width" />
        </div>
        <h1 className="title">{t("DATA_NOT_FOUND")}</h1>
        <p className="message">{t("DATA_NOT_FOUND_DESC")}</p>

        <div className="return-btn">
          <DarkBgButton
            children={t("TRY_NOW")}
            onClick={() => {
              window.location.reload();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DataNotFound;

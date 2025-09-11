"use client";
import React from "react";
import { NoData } from "@/assets/svgs";
import "../../styles/NoFound.css";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import useTrans from "@/customHooks/useTrans";

const NoOffering = ({ redux }: DIProps) => {
  const t = useTrans(redux?.common?.language);
  return (
    <div className="container ph-16">
      <div className="content-box-block ">
        <div className="emptyCartSvg">
          <NoData className="svg-width" />
        </div>
        <h1 className="title">{t("NO_OFFERINGS_FOUND")}</h1>
        <p className="message">{t("NO_OFFERINGS_FOUND_DESC")}</p>
      </div>
    </div>
  );
};

export default DI(NoOffering);
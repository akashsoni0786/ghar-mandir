"use client";
import React from "react";
import { NoData } from "@/assets/svgs";
import "../../styles/NoFound.css";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import useTrans from "@/customHooks/useTrans";
interface Props extends DIProps {
  value: string;
}
const ZeroResponse = ({ value, redux }: Props) => {
  const t = useTrans(redux?.common?.language);
  return (
    <div className="container ph-16">
      <div className="content-box">
        <div className="emptyCartSvg">
          <NoData className="svg-width" />
        </div>
        <h1 className="title">
          {value} {t("NOT_AVAILABLE")}
        </h1>
        <p className="message">{t("NOT_AVAILABLE_DESC")}</p>
      </div>
    </div>
  );
};

export default DI(ZeroResponse);

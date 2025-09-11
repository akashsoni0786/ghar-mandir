"use client";
import React from "react";
import { EmptyCart } from "@/assets/svgs";
import "../../styles/NoFound.css";
import { DarkBgButton } from "@/components/Common/Buttons";
import { useRouter } from "next/navigation";
import useTrans from "@/customHooks/useTrans";
const EmptyCartPage = () => {
  const route = useRouter();
  const t = useTrans("");
  return (
    <div className="container ph-16">
      <div className="content">
        <div className="emptyCartSvg">
          <EmptyCart className="svg-width" />
        </div>
        <h1 className="title">{t("EMPTY_CART_HEAD")}</h1>
        <p className="message">{t("EMPTY_CART_DESC")}</p>

        <div className="return-btn">
          <DarkBgButton
            children={t("BRW_PROD")}
            onClick={() => {
              route.push("../");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmptyCartPage;

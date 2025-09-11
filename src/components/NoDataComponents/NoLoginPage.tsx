"use client";
import React, { useState } from "react";
import "../../styles/NoFound.css";
import { DarkBgButton } from "@/components/Common/Buttons";
import { Power } from "react-feather";
import useWindow from "@/customHooks/useWindows";
import Login from "../Login/Login";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import useTrans from "@/customHooks/useTrans";
const NoLoginPage = ({ redux }: DIProps) => {
  const t = useTrans(redux?.common?.language);
  const { width } = useWindow();
  const [loginCheck, setLoginCheck] = useState(false);
  return (
    <div className="container ph-16">
      <Login
        setLoginCheck={setLoginCheck}
        showPopup={loginCheck}
        hideName={true}
      />
      <div className="content">
        <div className="emptyCartSvg">
          <Power
            style={{
              width: "100px",
              marginBottom: "",
              color: "#af1e2e",
              height: width > 480 ? "80px" : "60px",
            }}
          />
        </div>
        <h1 className="title">{t("NOT_LOGGEDIN")}</h1>
        <p className="message">
          {t("NOT_LOGGEDIN_DESC_1")}
          <br />
          {t("NOT_LOGGEDIN_DESC_2")}
        </p>

        <div className="return-btn">
          <DarkBgButton
            onClick={() => {
              setLoginCheck(true);
            }}
          >
            {t("LOGIN_HERE")}
          </DarkBgButton>
        </div>
      </div>
    </div>
  );
};

export default DI(NoLoginPage);

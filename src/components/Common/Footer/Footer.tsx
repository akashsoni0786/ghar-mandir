import React from "react";
import {
  Gharmandir_Logo,
  InstagramIcon,
  WhatsappIcon,
  FacebookIcon,
  FooterBgSVG,
} from "@/assets/svgs";
import { urlFetchCalls } from "@/constants/url";
import useWindow from "@/customHooks/useWindows";
import "./Footer.css";
import { button_event, save_event } from "@/constants/eventlogfunctions";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import { useRouter } from "next/navigation";
import useTrans from "@/customHooks/useTrans";

const {
  SHARE_LINKS: { instagram, facebook, whatsapp, privacy_policy },
} = urlFetchCalls;

const Footer = ({ redux, location }: DIProps) => {
  const t = useTrans(redux?.common?.language);
  const { width } = useWindow();
  const route = useRouter();

  const hrefLinks = [
    { title: t("PUJA"), path: "/puja" },
    { title: t("CHADHAVA"), path: "/chadhava" },
    // { title: "VIP Puja", path: "/vip_puja" },
    { title: t("CONTACT_US"), path: "../contact-us" },
    // { title: "About Us", path: "/about" },
    // { title: "View Templates", path: "/temple" },
    // { title: "Our Blogs", path: "/blogs" },
  ];

  return (
    <footer className="footer">
      <span style={{ pointerEvents: "none" }}>
        <FooterBgSVG className="footer-bg" />
      </span>
      <div className="container ph-1">
        <div className="footer-upper">
          <div className="footer-upper--left">
            <span className="footer-upper--logo-container">
              <Gharmandir_Logo className="footer-upper--logo" />
              {width < 992 && <p className="footer-upper--sl">{t("SLOGAN")}</p>}
            </span>
            <p className="footer-upper--slogan">{t("SLOGAN")}</p>
            <div className="footer-upper--social-links">
              <span
                className="cursor-pointer"
                onClick={() => {
                  window.location.href = instagram;
                }}
              >
                <InstagramIcon />
              </span>
              <span
                className="cursor-pointer"
                onClick={() => {
                  window.location.href = whatsapp;
                }}
              >
                <WhatsappIcon />
              </span>
              <span
                className="cursor-pointer"
                onClick={() => {
                  window.location.href = facebook;
                }}
              >
                <FacebookIcon />
              </span>
            </div>

            {width <= 991 && (
              <div className="footer-upper--right-contact">
                <h4 className="footer-upper--right--links--heading">
                  {t("CONTACT_US")}
                </h4>
                <p className="footer-upper--right--links--list-item cursor-pointer">
                  +91 7039858794
                </p>
              </div>
            )}

            <div className="footer-left-hr" />
            <div className="footer-left-linklist">
              <h4 className="footer-upper--right--links--heading">
                {t("QUICK_LINKS")}
              </h4>
              <ul className="footer-upper--left--links">
                {hrefLinks.map((href, idx) => (
                  <li
                    key={idx}
                    className="footer-upper--right--links--list-item cursor-pointer"
                    onClick={() => route.push(href.path)}
                  >
                    <p className="footer-upper--right--link cursor-pointer">
                      {href.title}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            {/* <div className="footer-lower--policy-left">
              <p
                onClick={() => window.open(privacy_policy, "_blank")}
                className="footer-lower--policy-link cursor-pointer"
              >
                Privacy Policy
              </p>
              <p
                onClick={() => window.open(privacy_policy, "_blank")}
                className="footer-lower--term-policy-link cursor-pointer"
              >
                Terms of Use
              </p>
              <p
                onClick={() => window.open(privacy_policy, "_blank")}
                className="footer-lower--COOKIE-policy-link cursor-pointer"
              >
                Cookie Policy
              </p>
            </div> */}
          </div>

          <div className="footer-upper--right">
            <div className="footer-upper--right--links">
              <h4 className="footer-upper--right--links--heading">
                {t("QUICK_LINKS")}
              </h4>
              <ul className="footer-upper--right--links--list">
                {hrefLinks.slice(0, 4).map((item, idx) => (
                  <li
                    key={idx}
                    className="footer-upper--right--links--list-item cursor-pointer"
                    onClick={() => {
                      route.push(item.path);
                      save_event(redux.auth.authToken, location ?? "Home", [
                        button_event(item.title, "Footer:tab switching"),
                      ]);
                    }}
                  >
                    <p className="footer-upper--right--link cursor-pointer">
                      {item.title}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-upper--right--links">
              <ul className="footer-upper--right--links--list footer-upper--right--links-2">
                {hrefLinks.slice(4, 8).map((item, idx) => (
                  <li
                    key={idx}
                    className="footer-upper--right--links--list-item cursor-pointer"
                    onClick={() => {
                      route.push(item.path);
                      save_event(redux.auth.authToken, location ?? "Home", [
                        button_event(item.title, "Footer:tab switching"),
                      ]);
                    }}
                  >
                    <p className="footer-upper--right--link cursor-pointer">
                      {item.title}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {width > 991 && (
              <div className="footer-upper--right-contact">
                <h4 className="footer-upper--right--links--heading">
                  {t("CONTACT_US")}
                </h4>
                <p className="footer-upper--right--links--list-item cursor-pointer">
                  +91 7039858794
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="footer-hr"></div>
        <div className="footer-lower">
          <div className="footer-lower--copyright">
            © Copyright 2022, All Rights Reserved by Ghar Mandir
          </div>
          {/* <div className="footer-lower--policy">
            <p
              className="footer-lower--policy-link cursor-pointer"
              onClick={() => {
                window.open(privacy_policy, "_blank");
                save_event(redux.auth.authToken, location ?? "Home", [
                  button_event("Privacy Policy", "Footer:tab switching"),
                ]);
              }}
            >
              Privacy Policy
            </p>
            <p
              className="footer-lower--term-policy-link cursor-pointer"
              onClick={() => {
                window.open(privacy_policy, "_blank");
                save_event(redux.auth.authToken, location ?? "Home", [
                  button_event("Terms of Use", "Footer:tab switching"),
                ]);
              }}
            >
              Terms of Use
            </p>
            <p
              className="footer-lower--COOKIE-policy-link cursor-pointer"
              onClick={() => {
                window.open(privacy_policy, "_blank");
                save_event(redux.auth.authToken, location ?? "Home", [
                  button_event("Cookie Policy", "Footer:tab switching"),
                ]);
              }}
            >
              Cookie Policy
            </p>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default DI(Footer);

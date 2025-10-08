import { Gharmandir_Name_Logo, Globe_Icon, HamburgerIcon } from "@/assets/svgs";
import { useEffect, useState, useRef } from "react";
import Popup from "./Popup";
import ConfirmationBox from "./ConfirmationBox";
import useWindow from "@/customHooks/useWindows";
import { LightBgButton } from "./Buttons";
import { ShoppingCart, User, X } from "react-feather";
import Login from "../Login/Login";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import { useRouter } from "next/navigation";
import SmartPopover from "./Popover/SmartPopup";
import Account from "../Account/Account";
import {
  button_event,
  pageview_event,
  pathObj,
  save_event,
} from "@/constants/eventlogfunctions";
import useTrans from "@/customHooks/useTrans";
import GoogleTranslate from "../GoogleTranslate/GoogleTranslate";
const TopNavbar = ({ redux, location }: DIProps) => {
  const t = useTrans(redux?.common?.language);
  const route = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const { width } = useWindow();
  const navbarRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);
  const [loginCheck, setLoginCheck] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const publicRoute = [
    "Puja",
    "Chadhava",
    "About Us",
    "Home",
    "होम",
    "पूजा",
    "चढ़ावा",
    "हमारे बारे में",
  ];
  const fix_path = [
    {
      title: t("HOME"),
      path: "/",
    },
    {
      title: t("PUJA"),
      path: "/puja",
      active: location?.includes("/puja") ? true : false,
    },
    {
      title: t("CHADHAVA"),
      path: "/chadhava",
      active: location?.includes("/chadhava") ? true : false,
    },
    // {
    //   title: "Request a free kundali",
    //   path: "/kundali",
    //   active: location === "/kundali" ? true : false,
    // },
    {
      title: "My Bookings",
      path: "/bookings",
    },
    // {
    //   title: "Temples",
    //   path: "/temples",
    // },
    // {
    //   title: "Blogs",
    //   path: "/blogs",
    // },
    {
      title: t("ABOUT_US"),
      path: "/about",
    },
  ];
  const [routes, setRoutes] = useState(fix_path);
  const checkForLogin = () => {
    return redux.auth.authToken && redux.auth.authToken != "";
  };
  const handleCart = () => {
    // if (!checkForLogin()) {
    //   const eventbtn = button_event(
    //     "Cart Icon",
    //     "Navbar : Login Form open",
    //     location ?? "Home"
    //   );
    //   save_event(redux?.auth?.authToken, location ?? "Home", [eventbtn]);
    //   setLoginCheck(true);
    // } else {

    const eventbtn = button_event(
      "Cart Icon",
      "Navbar : action",
      location ?? "Home"
    );
    save_event(redux?.auth?.authToken, location ?? "Home", [eventbtn]);
    setLoginCheck(false);
    route.push("/checkout");

    // }
  };
  const handleAccount = () => {
    if (!checkForLogin()) {
      setLoginCheck(true);
    } else {
      setLoginCheck(false);
      route.push("/account");
    }
  };
  const language_switcher = (
    <div style={{ position: "relative" }}>
      <GoogleTranslate />
    </div>
    // <SmartPopover
    //   trigger={
    //     <div className="language-button">
    //       <Globe_Icon />{" "}
    //       <span className="language">
    //         {language_short[localStorage.getItem("language") ?? "en"]}
    //       </span>
    //     </div>
    //   }
    // >
    //   <LanguageSwitcher />
    // </SmartPopover>
  );
  useEffect(() => {
    setRoutes(
      fix_path.map((route) => ({
        ...route,
        active:
          location === route.path && route.path !== "/"
            ? true
            : route.path !== "/" && location?.includes(route.path)
            ? true
            : location === "/" && route.path === "/"
            ? true
            : false,
      }))
    );
  }, [location, setRoutes, redux.common]);

  // Close menu when clicking outside (only for mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if window width is 480px or less (mobile)
      if (
        window.innerWidth <= 480 &&
        isMenuOpen &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("menu-open");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    };
  }, [isMenuOpen]);
  useEffect(() => {
    setLoginCheck(sessionStorage.getItem("showLogin") == "true");
  }, [sessionStorage.getItem("showLogin")]);

  return (
    <nav className="navbar" ref={navbarRef}>
      <Login
        setLoginCheck={setLoginCheck}
        showPopup={loginCheck}
        hideName={true}
      />
      <div className="navbar-container">
        <div
          className="navbar-logo cursor-pointer"
          onClick={() => {
            route.push("/");
          }}
        >
          <Gharmandir_Name_Logo />
        </div>
        {confirm && (
          <Popup position={width < 768 ? "bottom" : "center"}>
            <ConfirmationBox setConfirm={setConfirm} />
          </Popup>
        )}

        {/* Desktop Navigation */}
        <ul className="navbar-links">
          {routes.map((item: any) => {
            return (
              <li
                className="cursor-pointer"
                key={item.title}
                onClick={() => {
                  save_event(
                    redux.auth.authToken,
                    pathObj[location ?? ""] ?? location ?? "Home",
                    [
                      pageview_event(
                        pathObj[location ?? ""] ?? location ?? "Home"
                      ),
                      button_event(item.title, "Navbar:tab switching"),
                    ]
                  );
                  if (!checkForLogin() && !publicRoute.includes(item.title)) {
                    setLoginCheck(true);
                  } else {
                    route.push(item.path);
                    window.innerWidth <= 480 && setIsMenuOpen(false);
                  }
                }}
              >
                <a
                  // href={item.path}
                  className={item?.active ? "nav-active" : ""}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="navbar-actions">
          {language_switcher}
          <a onClick={handleCart} className="cursor-pointer">
            <ShoppingCart size={18} />
          </a>
          <LightBgButton
            onClick={() => {
              const eventbtn = button_event(
                "Get Spiritual Help",
                "Navbar : action",
                location ?? "Home"
              );
              save_event(redux?.auth?.authToken, location ?? "Home", [
                eventbtn,
              ]);
              route.push("./contact-us");
            }}
          >
            {t("SPIRITUAL_BANNER_BTN")}
          </LightBgButton>

          {checkForLogin() ? (
            <SmartPopover
              trigger={
                // <img
                //   className="profile-image"
                //   src={"Genesha"}
                //   alt="profile"
                //   // onClick={() => {
                //   //   route.push("/account");
                //   // }}
                // />
                <User className="profile-image" />
              }
            >
              <Account />
            </SmartPopover>
          ) : (
            <User
              className="profile-image"
              onClick={() => {
                const eventbtn = button_event(
                  "Profile Icon",
                  "Navbar : Login Form open",
                  location ?? "Home"
                );
                save_event(redux?.auth?.authToken, location ?? "Home", [
                  eventbtn,
                ]);
                if (!checkForLogin()) setLoginCheck(true);
              }}
            />
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="hamburger  ">
          <div className="mobile-actions">
            {language_switcher}

            <a onClick={handleCart} className="cursor-pointer">
              <ShoppingCart size={18} />
            </a>
            <div className="language-button">
              <User
                size={24}
                className="profile-image"
                onClick={() => {
                  if (!checkForLogin()) {
                    const eventbtn = button_event(
                      "Profile Icon",
                      "Navbar : Login Form open",
                      location ?? "Home"
                    );
                    save_event(redux?.auth?.authToken, location ?? "Home", [
                      eventbtn,
                    ]);
                    setLoginCheck(true);
                  } else {
                    const eventbtn = button_event(
                      "Profile Icon",
                      "Navbar : Going to account",
                      location ?? "Home"
                    );
                    save_event(redux?.auth?.authToken, location ?? "Home", [
                      eventbtn,
                    ]);
                    route.push("/account");
                  }
                }}
              />
            </div>
            <div onClick={toggleMenu} ref={hamburgerRef}>
              {isMenuOpen ? <X size={24} /> : <HamburgerIcon />}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Popover */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <ul>
          {routes.map((item: any) => {
            return (
              <li
                className="cursor-pointer"
                key={item.title}
                onClick={() => {
                  save_event(
                    redux.auth.authToken,
                    pathObj[location ?? ""] ?? "Home",
                    [
                      pageview_event(
                        pathObj[location ?? ""] ?? location ?? "Home"
                      ),
                      button_event(item.title, "Navbar:tab switching"),
                    ]
                  );
                  if (!checkForLogin() && !publicRoute.includes(item.title)) {
                    setLoginCheck(true);
                  } else {
                    route.push(item.path);
                    window.innerWidth <= 480 && setIsMenuOpen(false);
                  }
                }}
              >
                <a>{item.title}</a>
              </li>
            );
          })}
          {/* <li
            key={"account"}
            onClick={() => window.innerWidth <= 480 && setIsMenuOpen(false)}
          >
            {checkForLogin() ? (
              <a href={"/account"}>Account</a>
            ) : (
              <a onClick={handleAccount}>Login</a>
            )}
          </li> */}
        </ul>
      </div>
    </nav>
  );
};

export default DI(TopNavbar);

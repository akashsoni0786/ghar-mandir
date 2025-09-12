import {
  AlertTriangle,
  Calendar,
  ChevronRight,
  Layers,
  LogOut,
  Mail,
  User,
  X,
} from "react-feather";
import "./Account.css";
import { useEffect, useMemo, useState } from "react";
import { updateMobFooter } from "@/store/slices/commonSlice";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import { GharmandirRed_Logo } from "@/assets/svgs";
import useWindow from "@/customHooks/useWindows";
import { useRouter } from "next/navigation";
import { Spinner } from "../Common/Loadings/Spinner";
import { resetReduxStore } from "@/store/store";
import { urlFetchCalls } from "@/constants/url";
import FullPageLoader from "../Common/Loadings/FullPageLoader";
import {
  button_event,
  pageview_event,
  save_event,
} from "@/constants/eventlogfunctions";
import useTrans from "@/customHooks/useTrans";
import { encryptStorageKey, fetchCurrency } from "@/constants/commonfunctions";
import { simpleEncrypt } from "@/utils/cryption";
import { pushToDataLayerWithoutEvent } from "@/lib/gtm";

const {
  GET: { users_getUserProfile },
  SHARE_LINKS: { whatsapp },
} = urlFetchCalls;

const Account = ({ redux, dispatch, toast, request, location }: DIProps) => {
  const { width } = useWindow();
  const t = useTrans(redux?.common?.language);
  const route = useRouter();
  const showPopoverLayout = width <= 270 || width > 768;
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    userId: "Loading....",
    mobileNo: "Loading....",
    timeOfBirth: "Loading....",
    address: {
      streetAddress: "Loading....",
      townCity: "Loading....",
      stateRegion: "Loading....",
      postalCode: "Loading....",
    },
    birthDate: "Loading....",
    email: "Loading....",
    familyMembers: ["Loading....", "Loading...."],
    name: "Loading....",
    gender: "Male",
    maritalStatus: "Unmarried",
    placeOfBirth: "Loading....",
    profileImage: "",
    countryCode: "+91",
  });
  const service_data = [
    { icon: <LogOut />, title: t("LOG_OUT"), color: "#D31A1A", loading: false },
  ];
  const [services, setServices] = useState(service_data);
  const tab_data = [
    { icon: <User />, title: t("PROFILE"), path: "/profile", loading: false },
    {
      icon: <Calendar />,
      title: t("BOOKINGS"),
      path: "/bookings",
      loading: false,
    },
    {
      icon: <Layers />,
      title: "Subscriptions",
      path: "/subscriptions",
      loading: false,
    },
    {
      icon: <Mail />,
      title: t("CONTACT_US"),
      path: "../contact-us",
      loading: false,
    },
  ];
  const [data, setData] = useState(tab_data);

  useEffect(() => {
    setData(tab_data);
    setServices(service_data);
  }, [redux]);
  const setCurrency = async () => {
    try {
      const data = await fetchCurrency();
      const countryKey = encryptStorageKey("country");
      const currencyKey = encryptStorageKey("currency");

      localStorage.setItem(
        countryKey,
        simpleEncrypt(data?.countryName ?? "IN")
      );
      localStorage.setItem(currencyKey, simpleEncrypt(data?.currency ?? "INR"));
    } catch (error) {
      console.error("Failed to set currency:", error);
      // Optionally set default values on error
      const defaultKey = encryptStorageKey("currency");
      localStorage.setItem(defaultKey, simpleEncrypt("INR"));
    }
  };
  const memoizedServices = useMemo(
    () => (
      <>
        {/* <div className="horizontal-line-gray" />
        <p className="service-heading container ph-16">Our Services</p> */}
        {services.map((item, idx) => (
          <div
            key={idx}
            className="account-option container"
            onClick={() => {
              const eventbtn = button_event(
                item.title,
                "Account : " + (item?.title ?? "")
              );
              save_event(redux?.auth?.authToken, location ?? "Home", [
                eventbtn,
              ]);
              pushToDataLayerWithoutEvent({
                event: "user_logout",
                user_id: redux?.auth?.authToken || "",
                // name: redux?.auth?.userName || redux?.auth?.name,
                mobile: redux?.auth?.mobile || redux?.auth?.mobileNo || "",
              });
              const temp = [...services];
              temp[idx].loading = true;
              setServices(temp);
              setCurrency();
              toast?.show("Logged out successfully", "success");
              route.push("/");
              resetReduxStore();
            }}
          >
            <span className="account-option-flex">
              <span
                className="account-option-icon"
                style={{ color: item.color }}
              >
                {item.icon}
              </span>
              <label
                className="account-option-label"
                style={{ color: item.color }}
              >
                {item.title}
              </label>
            </span>
            <span className="account-option-icon">
              {item.loading ? (
                <Spinner size={"medium"} />
              ) : (
                <ChevronRight color={item.color} size={14} />
              )}
            </span>
          </div>
        ))}
      </>
    ),
    [services, route, toast, redux.common]
  );

  useEffect(() => {
    dispatch?.(
      updateMobFooter({
        showMobFooter: {
          mobFooter: false,
          timeBanner: false,
        },
      })
    );
  }, [dispatch]);

  const getUserData = () => {
    const eventbtn = pageview_event("Account");
    save_event(redux?.auth?.authToken, location ?? "Account", [eventbtn]);

    setLoading(true);
    if (request) {
      request
        .GET(users_getUserProfile + "?userId=" + redux?.auth?.authToken)
        .then((res: any) => {
          if (res?.user) {
            setUserData(res?.user);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (Object.values(userData).some((e: any) => e == "Loading...."))
      getUserData();
  }, []);

  const renderUserInfo = () =>
    width <= 300 ? (
      <div className="account-data-flex">
        {userData?.profileImage && userData?.profileImage != "" ? (
          <img
            className="profile-user--box-img"
            src={userData?.profileImage}
            alt="user-pic"
          />
        ) : (
          <User className="account-data--img" />
        )}
        <div className="account-data--name-mail">
          <p className="account-data--name">
            {userData?.name ?? redux?.auth?.username ?? ""}
          </p>
          <p className="account-data--email">
            {userData?.email ?? userData?.mobileNo ?? redux?.auth?.mobile ?? ""}
          </p>
        </div>
      </div>
    ) : (
      <div className="account-data container ph-16">
        <User className="account-data--img" />
        <p className="account-data--name">{redux?.auth?.username ?? ""}</p>
        <p className="account-data--email">
          {userData?.email ?? redux?.auth?.mobile ?? ""}
        </p>
      </div>
    );

  const renderWarningBox = () => (
    <div
      className={
        showPopoverLayout ? "account-warn-box container" : "account-warn"
      }
    >
      <div
        className={`account-warn-flex ${showPopoverLayout ? "container" : ""}`}
      >
        <span className="account-warn-icon">
          <AlertTriangle className="alert-icon" />
        </span>
        <div className="account-warn-content">
          <div className="account-warn-content--upper">
            <p className="account-warn-content--upper-data">
              {t("COMPLETE_PROFILE_FOR_EXP")}
            </p>
            <span className="content-icon">
              <X size={12} />
            </span>
          </div>
          <div className="account-warn-content--lower">
            <p className="account-warn-content--lower-data">
              {t("COMPLETE_PROFILE")}
            </p>
            <span className="content-icon">
              <ChevronRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAssistanceBox = () => (
    <div
      className={
        showPopoverLayout ? "account-assist-box container" : "account-assist"
      }
    >
      <div
        className="account-warn-flex container cursor-pointer"
        onClick={() => {
          window.location.href = whatsapp;
        }}
      >
        <span>
          <GharmandirRed_Logo />
        </span>
        <div className="account-warn-content">
          <div className="account-warn-content--upper">
            <p className="account-assist-content--upper-data">
              {t("NEED_ASSISTANCE")}
            </p>
          </div>
          <div className="account-warn-content--lower">
            <p className="account-assist-content--upper-data">
              {t("GET_ASSISTANCE")}
            </p>
            <span className="content-icon">
              <ChevronRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return loading ? (
    <FullPageLoader />
  ) : (
    <div className={`account ${showPopoverLayout ? "contanier" : ""}`}>
      {renderUserInfo()}
      {/* {renderWarningBox()} */}

      {data.map((item, idx) => (
        <div
          key={idx}
          className="account-option container"
          onClick={() => {
            const eventbtn = button_event(
              item.title,
              "Account : " + (item?.title ?? "")
            );
            save_event(redux?.auth?.authToken, location ?? "Home", [eventbtn]);
            const temp: any = [...data];
            temp[idx].loading = true;
            setData(temp);
            route.push(item?.path);
          }}
        >
          <span className="account-option-flex">
            <span className="account-option-icon">{item.icon}</span>
            <label className="account-option-label">{item.title}</label>
          </span>
          <span className="account-option-icon">
            {item.loading ? (
              <Spinner size={"medium"} />
            ) : (
              <ChevronRight size={14} />
            )}
          </span>
        </div>
      ))}
      {memoizedServices}
      {renderAssistanceBox()}
    </div>
  );
};

export default DI(Account);

import "./Bookings.css";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "react-feather";
import SearchFilter from "../Common/SearchFilter";
import { bookings } from "@/commonvaribles/constant_variable";
import {
  ActiveCheckIconLight,
  CalenderIcon,
  GharmandirRed_Logo,
  TempleIcon,
} from "@/assets/svgs";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../Common/Loadings/LoadingSpinner";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import { urlFetchCalls } from "@/constants/url";
import FullPageLoader from "../Common/Loadings/FullPageLoader";
import ZeroResponse from "../NoDataComponents/ZeroResponse";
import {
  button_event,
  pageview_event,
  save_event,
} from "@/constants/eventlogfunctions";
import useTrans from "@/customHooks/useTrans";
import { Tooltip } from "antd";
import { updateVideo } from "@/store/slices/commonSlice";
import { Spinner } from "../Common/Loadings/Spinner";
import "./ViewBooking.css";
const {
  GET: { bookins_getAllBookings },
} = urlFetchCalls;

const Bookings = ({ request, redux, toast, location, dispatch }: DIProps) => {
  const t = useTrans(redux?.common?.language);
  const router = useRouter();
  const [loading, setLoading] = useState({ load: false, id: "" });
  const [data, setData] = useState<any>(undefined);
  const [cloneData, setCloneData] = useState<any>(undefined);
  const [filter, setFilter] = useState({});
  const [contactLoadings, setContactLoadings] = useState(false);

  useEffect(() => {
    if (request) {
      const eventbtn = pageview_event("Bookings");
      save_event(redux?.auth?.authToken, location ?? "Bookings", [eventbtn]);
      request
        .POST(bookins_getAllBookings, { userId: redux?.auth?.authToken })
        .then((res: any) => {
          if (res.success) {
            const dataVals: any = res?.data?.map((i) => ({
              ...i,
              my_booking_id: parseInt((Math.random() * 10000000).toString()),
            }));
            setData(dataVals ?? []);
            setCloneData(dataVals ?? []);
          } else toast?.show(t("NO_BOOKINGS_FOUND"), "error");
        });
    }
  }, []);

  const filterData = (data, filterObj, setData) => {
    const filteredByType = data.filter((item) => {
      if (filterObj.Type?.Puja && filterObj.Type?.Chadhava) {
        return item.type === "PUJA" || item.type === "CHADHAVAA";
      } else if (filterObj.Type?.Puja) {
        return item.type === "PUJA";
      } else if (filterObj.Type?.Chadhava) {
        return item.type === "CHADHAVAA";
      } else {
        return true;
      }
    });

    const filteredByStatus = filteredByType.filter((item) => {
      if (
        filterObj.Status?.["Active Booking"] &&
        !filterObj.Status?.["Past Booking"]
      ) {
        return item.status === "ORDER_PLACED";
      } else if (
        !filterObj.Status?.["Active Booking"] &&
        filterObj.Status?.["Past Booking"]
      ) {
        return item.status !== "ORDER_PLACED";
      } else {
        return true;
      }
    });

    const filteredBySearch = filterObj.search
      ? filteredByStatus.filter(
          (item) =>
            item.name?.toLowerCase().includes(filterObj.search.toLowerCase()) ||
            item.temple
              ?.toLowerCase()
              .includes(filterObj.search.toLowerCase()) ||
            item.bookingsId
              ?.toLowerCase()
              .includes(filterObj.search.toLowerCase())
        )
      : filteredByStatus;

    setData(filteredBySearch);
  };

  useEffect(() => {
    if (Object.keys(filter).length > 0) filterData(cloneData, filter, setData);
    else setData(cloneData);
  }, [filter]);
  if (dispatch) {
    dispatch(
      updateVideo({
        video_data: null,
      })
    );
  }
  return data ? (
    data?.length === 0 && Object.keys(filter).length === 0 ? (
      <ZeroResponse value={t("BOOKINGS")} />
    ) : (
      <div className="container booking ph-16">
        <div className="container checkout-header">
          <span
            style={{ cursor: "pointer" }}
            onClick={() => router.push("../")}
          >
            <ChevronLeft className="booking-header--name" />
          </span>
          <p className="booking-header--name">{t("BOOKINGS")}</p>
        </div>
        <SearchFilter
          type={t("SEARCH_BOOKING")}
          changedData={setFilter}
          filters={bookings}
          placeholder={t("SEARCH_PLACEHOLDER")}
        />
        <div className="booking-boxes">
          <p className="booking-boxes--heading">
            {t("ACTIVE_PAST_PUJA")} ({data?.length})
          </p>
          <div className="booking-boxes--container">
            {data.map((item: any, idx: number) => (
              <div
                key={idx}
                className={`booking-boxes--item ${
                  loading.load && item?.my_booking_id == loading?.id
                    ? "loading"
                    : ""
                }`}
                onClick={() => {
                  const eventbtn = button_event(
                    "Show Booking Details",
                    "Booking Id  : " + (item?.my_booking_id ?? ""),
                    "Show Booking Details",
                    { additionalData: item }
                  );
                  save_event(redux?.auth?.authToken, location ?? "Bookings", [
                    eventbtn,
                  ]);
                  setLoading({ load: true, id: item?.my_booking_id });
                  router.push(
                    `/bookings/${
                      item?.bookingsId +
                      "&" +
                      (item?.chadhavaId ? "chadhavaId" : "poojaId") +
                      "=" +
                      (item?.chadhavaId ? item?.chadhavaId : item?.poojaId)
                    }`
                  );
                }}
              >
                <div className="booking-boxes--item--img-container">
                  <img
                    className="booking-boxes--item--img"
                    src={
                      item.images[0] ??
                      "https://c4.wallpaperflare.com/wallpaper/741/711/759/krishna-hindu-gods-bhagwan-vishnu-narayan-hd-wallpaper-preview.jpg"
                    }
                    alt=""
                  />
                  {loading.load && item?.my_booking_id == loading?.id && (
                    <div className="image-spinner-overlay">
                      <LoadingSpinner />
                    </div>
                  )}
                </div>
                <div className="booking-boxes--item--details">
                  <p className="booking-boxes--item--name">
                    {item?.name?.length > 20 ? (
                      <Tooltip
                        placement="topRight"
                        title={item?.name}
                      >{`${item?.name?.slice(0, 30)}...`}</Tooltip>
                    ) : (
                      item?.name
                    )}
                  </p>
                  {/* <StatusBox
                      status={
                        item?.status === "ORDER_PLACED" &&
                        !isDateInPast(item.date)
                          ? "Active"
                          : "Completed"
                      }
                  /> */}
                </div>
                <div className="booking-boxes--item--temple-date">
                  <div className="booking-boxes--item--temple">
                    <span>
                      <TempleIcon className="icon-size" />
                    </span>
                    <span>{item?.temple}</span>
                  </div>
                  <div className="booking-boxes--item--date">
                    <span>
                      <CalenderIcon className="icon-size" />
                    </span>
                    <span>{item?.date}</span>
                  </div>
                </div>
                {item?.prasadData && (
                  <div className="booking-boxes--item--prasad">
                    <p className="booking-boxes--item--prasad-heading">
                      {t("PRASAD_STATUS")}
                    </p>
                    <div className="booking-boxes--item--prasad-data">
                      <span>
                        <ActiveCheckIconLight className="icon-size" />
                      </span>
                      <div className="booking-boxes--item--prasad-details">
                        <p className="booking-boxes--item--prasad-content">
                          {t("PRASAD_PACKED")}
                        </p>
                        <p className="booking-boxes--item--prasad-date">
                          {item?.prasadData}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{ margin: "16px 0" }}
          className="booking-view--actions-invoice booking-view--actions-contact"
          onClick={() => {
            setContactLoadings(true);
            router.push("../contact-us");
          }}
        >
          <div className="data-flex">
            <span>
              <GharmandirRed_Logo />
            </span>
            <label className="btn-label btn-label-contact ">
              {t("CONTACT_US")}
            </label>
          </div>
          {contactLoadings && <Spinner size="large" />}
        </div>
      </div>
    )
  ) : (
    <FullPageLoader />
  );
};

export default DI(Bookings);

import "../Bookings/Bookings.css";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "react-feather";
import SearchFilter from "../Common/SearchFilter";
import { CalenderIcon, TempleIcon } from "@/assets/svgs";
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
import StatusBox from "../Bookings/StatusBox";
import {
  updateSubscriptionData,
  updateVideo,
} from "@/store/slices/commonSlice";
import { formatTimestampToReadableDate } from "@/constants/commonfunctions";
import { videoSource } from "@/commonvaribles/constant_variable";

const {
  POST: { subscription_getUserSubscription },
} = urlFetchCalls;

const SubscriptionPage = ({
  request,
  redux,
  toast,
  location,
  dispatch,
}: DIProps) => {
  const t = useTrans(redux?.common?.language);
  const router = useRouter();
  const [loading, setLoading] = useState({ load: false, id: "" });
  const [data, setData] = useState<any>(undefined);
  const [cloneData, setCloneData] = useState<any>(undefined);
  const [filter, setFilter] = useState({});

  useEffect(() => {
    if (dispatch) {
      dispatch(
        updateVideo({
          video_data: videoSource,
        })
      );
    }
    if (request) {
      const eventbtn = pageview_event("Bookings");
      save_event(redux?.auth?.authToken, location ?? "Bookings", [eventbtn]);
      request
        .POST(subscription_getUserSubscription, {
          userId: redux?.auth?.authToken,
        })
        .then((res: any) => {
          if (res.success) {
            const dataVals: any = res?.data?.map((i) => ({
              ...i,
              my_subscription_id: parseInt(
                (Math.random() * 10000000).toString()
              ),
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
            item?.product?.poojaTemple
              ?.toLowerCase()
              .includes(filterObj.search.toLowerCase()) ||
            item?.product?.heading
              ?.toLowerCase()
              .includes(filterObj.search.toLowerCase()) ||
            item?.product?.subHeading
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

  return data ? (
    data?.length === 0 && Object.keys(filter).length === 0 ? (
      <ZeroResponse value={t("SUBSCRIPTIONS")} />
    ) : (
      <div className="container booking ph-16">
        <div className="container checkout-header">
          <span
            style={{ cursor: "pointer" }}
            onClick={() => router.push("../")}
          >
            <ChevronLeft className="booking-header--name" />
          </span>
          <p className="booking-header--name">{t("SUBSCRIPTIONS")}</p>
        </div>
        <SearchFilter
          type={"Search Subscriptions "}
          changedData={setFilter}
          filters={{}}
          placeholder={t("SEARCH_PLACEHOLDER")}
        />
        <div className="booking-boxes" style={{ borderTop: "none" }}>
          <p className="booking-boxes--heading">
            {"Active & Past Subscriptions"} ({data?.length})
          </p>
          <div className="booking-boxes--container">
            {data.map((item: any, idx: number) => {
              return (
                <div
                  key={idx}
                  className={`booking-boxes--item ${
                    loading.load && item?.my_subscription_id == loading?.id
                      ? "loading"
                      : ""
                  }`}
                  onClick={() => {
                    const eventbtn = button_event(
                      "Show Booking Details",
                      "Booking Id  : " + (item?.my_subscription_id ?? ""),
                      "Show Booking Details",
                      { additionalData: item }
                    );
                    save_event(
                      redux?.auth?.authToken,
                      location ?? "Subscriptions",
                      [eventbtn]
                    );
                    setLoading({ load: true, id: item?.my_subscription_id });
                    router.push(`/subscriptions/${item?._id}`);
                    if (dispatch)
                      dispatch(
                        updateSubscriptionData({ subscriptionData: item })
                      );
                  }}
                >
                  <div className="booking-boxes--item--img-container">
                    <img
                      className="booking-boxes--item--img"
                      src={
                        item?.product?.images?.[0] ??
                        "https://c4.wallpaperflare.com/wallpaper/741/711/759/krishna-hindu-gods-bhagwan-vishnu-narayan-hd-wallpaper-preview.jpg"
                      }
                      alt=""
                    />
                    {loading.load &&
                      item?.my_subscription_id == loading?.id && (
                        <div className="image-spinner-overlay">
                          <LoadingSpinner />
                        </div>
                      )}
                  </div>
                  <div className="booking-boxes--item--details">
                    <p className="booking-boxes--item--name">
                      {item?.product?.heading?.length > 20
                        ? `${item?.product?.heading?.slice(0, 20)}...`
                        : item?.product?.heading}
                    </p>
                    <StatusBox status={item?.status} />
                  </div>
                  <div className="booking-boxes--item--temple-date">
                    <div className="booking-boxes--item--temple">
                      <span>
                        <TempleIcon className="icon-size" />
                      </span>
                      <span>{item?.product.poojaTemple}</span>
                    </div>
                    <div className="booking-boxes--item--date">
                      <span>
                        <CalenderIcon className="icon-size" />
                      </span>
                      <span>
                        {formatTimestampToReadableDate(
                          item?.createdAt?.timestamp
                        )}{" "}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )
  ) : (
    <FullPageLoader />
  );
};

export default DI(SubscriptionPage);

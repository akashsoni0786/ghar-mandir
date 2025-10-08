import useWindow from "@/customHooks/useWindows";
import { ChevronDown, ChevronUp, XCircle } from "react-feather";
import TextField from "../Common/TextField";
import { Button } from "../Common/Buttons";
import "./ViewBooking.css";
import { useState } from "react";
import VideoSlideWithMsg from "../Common/VideoSlider/VideoSlideWithMsg";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import { urlFetchCalls } from "@/constants/url";
import VideoPlayer from "../Common/VideoSlider/VideoPlayer";
import { useEffect } from "react";
import { pushToDataLayerWithoutEvent } from "@/lib/gtm";
import useTrans from "@/customHooks/useTrans";
import { isDateInPast } from "@/constants/commonfunctions";
import { Alert } from "antd";
import AlertBox from "../Common/AlertBox/AlertBox";

interface Props extends DIProps {
  data: any;
}

const {
  POST: { bookings_updateMembers, orders_videoSeen },
} = urlFetchCalls;
const memberLength = (data) => {
  const arr = ["individual", "couple", "4", "6", "6+"];
  const memberObj: Record<number, number> = { 0: 1, 1: 2, 2: 4, 3: 6, 4: 6 };

  let member_idx = -1;
  const name_arr = (data ?? "").split(" ");
  name_arr.forEach((n_ar) => {
    n_ar = n_ar.toLowerCase();
    if (arr.includes(n_ar)) {
      member_idx = memberObj[arr.indexOf(n_ar)];
    }
  });
  return member_idx;
};
const ActiveBooking = ({ data, request, toast, redux }: Props) => {
  const t = useTrans(redux?.common?.language);
  const { width } = useWindow();

  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState<any>(
    data?.pitruNameIncluded ? data?.pitruNames ?? [] : data?.members ?? []
  );
  const [saving, setSaving] = useState(false);
  const toggleAccordion = () => setIsOpen(!isOpen);
  const handleSaveMembers = () => {
    setSaving(true);
    request
      ?.POST(bookings_updateMembers, {
        userId: redux?.auth?.authToken,
        orderId: data?.bookingsId,
        ...(data?.pitruNameIncluded
          ? { pitruNames: members.filter((i) => i && i.trim() != "") }
          : { members: members.filter((i) => i && i.trim() != "") }),
      })
      .then((res) => {
        if (res.success) {
          toast?.show(res.message ?? t("MEMBERS_UPDATED"), "success");
        } else {
          toast?.show(res.message, "error");
        }
      })
      .finally(() => {
        setSaving(false);
        setMembers(members.filter((i) => i && i.trim() != ""));
      });
  };
  const handleAddMember = () => {
    const member_idx = memberLength(data.family_package);
    if (member_idx - 1 > members.length) {
      setMembers((prev) => [...prev, ""]);
    } else {
      toast?.show(t("MAX_LIMIT_REACHED"), "error");
    }
  };
  const formatAddress = () => {
    const { street_address, city, state, pincode } = data.address || {};
    return [street_address, city, state, pincode].filter(Boolean).join(", ");
  };
  function isFromSeptember23_2025(timestamp) {
    return new Date(timestamp) >= new Date("2025-09-23");
  }
  const handleVideoClick = (link) => {
    request?.POST(orders_videoSeen, {
      ...(data.chadhavaId
        ? { chadhavaId: data.chadhavaId }
        : { poojaId: data.poojaId }),
      orderId: data?.bookingsId,
      videoUrl: link,
    });
  };
  useEffect(() => {
    const mantras = data?.panditmessages?.mantras;
    if (Array.isArray(mantras) && mantras.length > 0) {
      pushToDataLayerWithoutEvent({
        event: "Visit_Mantra_Shown_Web",
        user_id: redux?.auth?.authToken,
        booking_id: data?.bookingsId,
        name: redux?.auth?.userName,
        data: mantras,
        mobile: redux?.auth?.mobileNo || redux?.auth?.mobile || null,
      });
    }
  }, [data?.panditmessages?.mantras]);

  return (
    <>
      {!data?.order_status && width <= 768 && (
        <div className="horizontal-line-gray ph-16" />
      )}

      {!data?.order_status && (
        <div className="booking-view--box ph-16">
          <h3 className="booking-view--box-heading">{t("BEFORE_RITUAL")}</h3>
          <div className="booking-view--box-content">
            <ul className="booking-view--box-rituals">
              {[
                t("RITUAL_TIP_1"),
                t("RITUAL_TIP_2"),
                t("RITUAL_TIP_3"),
                t("RITUAL_TIP_4"),
              ].map((tip, idx) => (
                <li key={idx}>
                  •{"   "}
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {width <= 768 && <div className="horizontal-line-gray ph-16" />}
      <div className="booking-view--box ph-16">
        <h3 className="booking-view--box-heading">
          {data?.pitruNameIncluded ? "Pitru Names" : t("FAMILY_MEMBERS")}
        </h3>
        <div className="booking-view--box-content">
          <div className="booking-view--accordion">
            <button
              className="accordion-header"
              onClick={toggleAccordion}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "12px",
                background: "#f5f5f5",
                border: "none",
                cursor: "pointer",
              }}
            >
              <span>
                {data?.pitruNameIncluded ? "Pitru Names" : t("MEMBERS_COUNT")} (
                {members.length})
              </span>
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {isOpen && (
              <>
                <div
                  className="booking-view--box-members"
                  style={{ gap: "8px", padding: "12px" }}
                >
                  {members &&
                    members?.map((member, idx) => (
                      <TextField
                        key={idx}
                        placeholder="Enter full name"
                        value={member}
                        withIcon={true}
                        iconPosition="right"
                        onChange={(e) => {
                          let temp = [...members];
                          temp[idx] = e;
                          setMembers(temp);
                        }}
                        disabled={data?.order_status}
                        icon={
                          members.length > 1 && !data?.order_status ? (
                            <span
                              onClick={() => {
                                let temp = structuredClone(members);
                                temp.splice(idx, 1);
                                setMembers(temp);
                              }}
                            >
                              <XCircle
                                color="#af1e2e"
                                style={{ cursor: "pointer" }}
                              />
                            </span>
                          ) : (
                            <span>
                              <XCircle color="#D18F96" cursor={"not-allowed"} />
                            </span>
                          )
                        }
                      />
                    ))}
                </div>
                {!isDateInPast(data.date) && (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "end",
                      margin: "8px 0",
                      gap: "4px",
                    }}
                  >
                    {memberLength(data.family_package) > 0 && (
                      <Button
                        disabled={data?.order_status}
                        onClick={handleAddMember}
                        size="medium"
                      >
                        {t("ADD")}
                      </Button>
                    )}
                    <Button
                      disabled={data?.order_status}
                      isLoading={saving}
                      onClick={handleSaveMembers}
                      size="medium"
                    >
                      {t("SAVE_MEMBERS")}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {width <= 768 && <div className="horizontal-line-gray ph-16" />}

      {data.address && data?.order_status && (
        <div className="booking-view--box ph-16">
          <h3 className="booking-view--box-heading">{t("ADDRESS")}</h3>
          <div className="booking-view--box-content">
            <div className="booking-view--box-address">{formatAddress()}</div>
          </div>
        </div>
      )}

      {data?.bookingTime && isFromSeptember23_2025(data?.bookingTime) && (
        <>
          {data?.poojaCompleteVideo && data?.poojaCompleteVideo?.length > 0 ? (
            <div className="booking-view--box ph-16">
              <h3 className="booking-view--box-heading">Offering Video</h3>

              <div style={{ marginLeft: "-38px" }}>
                <VideoSlideWithMsg
                  devineExperience={data.poojaCompleteVideo}
                  onPlayVideo={handleVideoClick}
                />
              </div>
            </div>
          ) : (
            <div style={{ padding: "0 16px" }}>
              <AlertBox type="warning">
                Your sankalp video is in process, it will be live in 2-3 days
                once puja/chadhava is done.
              </AlertBox>
            </div>
          )}
        </>
      )}
      {width <= 768 && <div className="horizontal-line-gray ph-16" />}
      <div className="booking-completed">
        {/* Mantra Recommended */}
        {/* <div className="booking-status-wrap">
          <span className="booking-view--box-check">{check}</span>
          <div className="booking-status-step-1 booking-status-step-done">
            <h3 className="booking-view--box-heading-step">{t("MANTRAS")}</h3>
            <div className="booking-view--box-content-mantra">
              <div className="booking-view--box-mantra">
                {data?.panditmessages?.mantras?.length > 0
                  ? data.panditmessages.mantras.map(
                      (mantra: any, idx: number) => (
                        <li key={idx}>{mantra?.text ?? ""}</li>
                      )
                    )
                  : t("NO_MANTRAS")}
              </div>
            </div>
          </div>
        </div> */}

        {/* Puja Started */}
        {/* <div className="booking-status-wrap">
          <span className="booking-view--box-check">
            {data?.poojaStart ? check : uncheck}
          </span>
          <div
            className={`booking-status-step ${
              data?.poojaStart
                ? "booking-status-step-done"
                : "booking-status-step-notdone"
            }`}
          >
            <h3 className="booking-view--box-heading-step">
              {t("PUJA_STARTED")}
            </h3>
            {data?.poojaStart && (
              <div className="booking-view--box-content">
                <VideoPlayer devineExperience={data.poojaStart[0]} />
              </div>
            )}
          </div>
        </div> */}

        {/* Puja End */}
        {/* <div className="booking-status-wrap">
          <span className="booking-view--box-check">
            {data?.poojaEnd ? check : uncheck}
          </span>
          <div
            className={`booking-status-step ${
              data?.poojaEnd
                ? "booking-status-step-done"
                : "booking-status-step-notdone"
            }`}
          >
            <h3 className="booking-view--box-heading-step">
              {t("PUJA_ENDED")}
            </h3>
            {data?.poojaEnd && (
              <div className="booking-view--box-content">
                <VideoPlayer devineExperience={data.poojaEnd[0]} />
              </div>
            )}
          </div>
        </div> */}

        {/* Puja Complete */}
        {/* <div className="booking-status-wrap">
          <span className="booking-view--box-check">
            {data?.poojaCompleteVideo ? check : uncheck}
          </span>
          <div>
            <h3 className="booking-view--box-heading-step">
              {t("PUJA_COMPLETE")}
            </h3>
            {!data.poojaCompleteVideo && (
              <p className="booking-view--box-subheading ph-16">
                {t("VIDEO_NOTE")}
              </p>
            )}
            {data.poojaCompleteVideo && (
              <div className="booking-view--box-content">
                <VideoSlideWithMsg devineExperience={data.poojaCompleteVideo} />
              </div>
            )}
          </div>
        </div> */}
      </div>
    </>
  );
};

export default DI(ActiveBooking);

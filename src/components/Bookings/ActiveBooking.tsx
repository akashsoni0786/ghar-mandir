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

interface Props extends DIProps {
  data: any;
}

const {
  POST: { bookings_updateMembers },
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
    (memberLength(data.family_package) >=
      [
        data?.userName,
        ...(data?.pitruNameIncluded
          ? data?.pitruNames ?? []
          : data?.members ?? []),
      ].length)
      ? [
          data?.userName,
          ...(data?.pitruNameIncluded
            ? data?.pitruNames ?? []
            : data?.members ?? []),
        ]
      : [
          ...(data?.pitruNameIncluded
            ? data?.pitruNames ?? []
            : data?.members ?? []),
        ]
  );
  const [saving, setSaving] = useState(false);
  const uncheck = (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "50%",
        border: "1px solid #999999 ",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width > 480 ? "24" : "18"}
        height={width > 480 ? "24" : "18"}
        viewBox={"0 0 42 42"}
        fill="none"
      >
        <circle
          cx="21"
          cy="21"
          r="16.5"
          fill="white"
          stroke="#999999"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
  const check = (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "50%",
        border: "1px solid #5BA61A",
      }}
    >
      <svg
        width={width > 480 ? "24" : "18"}
        height={width > 480 ? "24" : "18"}
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17 3.83989C18.5083 4.71075 19.7629 5.96042 20.6398 7.46519C21.5167 8.96997 21.9854 10.6777 21.9994 12.4192C22.0135 14.1608 21.5725 15.8758 20.72 17.3946C19.8676 18.9133 18.6332 20.1831 17.1392 21.0782C15.6452 21.9733 13.9434 22.4627 12.2021 22.498C10.4608 22.5332 8.74055 22.1131 7.21155 21.2791C5.68256 20.4452 4.39787 19.2264 3.48467 17.7434C2.57146 16.2604 2.06141 14.5646 2.005 12.8239L2 12.4999L2.005 12.1759C2.061 10.4489 2.56355 8.76585 3.46364 7.29089C4.36373 5.81592 5.63065 4.59934 7.14089 3.75977C8.65113 2.92021 10.3531 2.48629 12.081 2.50033C13.8089 2.51437 15.5036 2.97589 17 3.83989ZM15.707 9.79289C15.5348 9.62072 15.3057 9.51729 15.0627 9.502C14.8197 9.48672 14.5794 9.56064 14.387 9.70989L14.293 9.79289L11 13.0849L9.707 11.7929L9.613 11.7099C9.42058 11.5607 9.18037 11.4869 8.9374 11.5022C8.69444 11.5176 8.46541 11.621 8.29326 11.7932C8.12112 11.9653 8.01768 12.1943 8.00235 12.4373C7.98702 12.6803 8.06086 12.9205 8.21 13.1129L8.293 13.2069L10.293 15.2069L10.387 15.2899C10.5624 15.426 10.778 15.4998 11 15.4998C11.222 15.4998 11.4376 15.426 11.613 15.2899L11.707 15.2069L15.707 11.2069L15.79 11.1129C15.9393 10.9205 16.0132 10.6802 15.9979 10.4372C15.9826 10.1942 15.8792 9.96509 15.707 9.79289Z"
          fill="#5BA61A"
        />
      </svg>
    </div>
  );

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
    if (member_idx > members.length) {
      setMembers((prev) => [...prev, ""]);
    } else {
      toast?.show(t("MAX_LIMIT_REACHED"), "error");
    }
  };

  const formatAddress = () => {
    const { street_address, city, state, pincode } = data.address || {};
    return [street_address, city, state, pincode].filter(Boolean).join(", ");
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

import { useEffect, useState } from "react";
import { DarkBgButtonFw } from "./Buttons";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import { updateMobFooter } from "@/store/slices/commonSlice";

interface Props extends DIProps {
  button_name: string;
  left_section: React.ReactNode;
  onClick?: () => void;
  setLoading?: (e: boolean) => void;
  loading?: boolean;
  // Scroll behavior props
  hideOnScroll?: boolean;
  showThreshold?: number;
  scrollDebounce?: number;
  // New banner props
  showTopBanner?: boolean;
  bannerContent?: React.ReactNode;
  timedata?: any;
  disabled_btn?: boolean;
  showWhatsapp?: boolean;
}

const MobileFooter = ({
  button_name,
  left_section,
  onClick,
  loading,
  setLoading,
  hideOnScroll = false,
  showThreshold = 100,
  scrollDebounce = 100,
  showTopBanner = false,
  bannerContent = "Special Offer!",
  disabled_btn,
  timedata = {
    day: 0,
    month: 0,
    year: 0,
    hour: 0,
    min: 0,
    sec: 0,
  },
  dispatch,
  showWhatsapp = true,
}: Props) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timedata);

  useEffect(() => {
    const allZero = Object.values(timedata).every((val) => val === 0);
    if (!timedata || allZero) return;

    const { day, month, year, hour, min } = timedata;
    const targetDate = new Date(year, month - 1, day, hour, min);

    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({
          day: 0,
          hour: 0,
          min: 0,
          sec: 0,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        day: days,
        hour: hours,
        min: mins,
        sec: secs,
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [timedata]);

  useEffect(() => {
    if (!hideOnScroll) {
      setIsVisible(true);
      return;
    }

    let timeout: NodeJS.Timeout;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const atBottom =
        window.innerHeight + currentScrollY >=
        document.body.offsetHeight - showThreshold;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (currentScrollY > lastScrollY && currentScrollY > 10) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY || atBottom) {
          setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
      }, scrollDebounce);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [hideOnScroll, showThreshold, scrollDebounce, lastScrollY]);

  useEffect(() => {
    if (dispatch) {
      dispatch(
        updateMobFooter({
          showMobFooter: {
            mobFooter: isVisible && showWhatsapp,
            timeBanner: showTopBanner && showWhatsapp,
          },
        })
      );
    }
  }, [isVisible, showTopBanner, dispatch, showWhatsapp]);

  return (
    <div
      className={`package-selection-footer ${
        !isVisible ? "footer-hidden" : ""
      } `}
    >
      {showTopBanner && (
        <div className="mobile-footer-banner">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              fontWeight: "bold",
            }}
          >
            {timeLeft.day + timeLeft.hour + timeLeft.min + timeLeft.sec <= 0 ? (
              "Offer expired!"
            ) : (
              <>
                {/* 🚀 keep countdown safe from Google Translate */}
                <span translate="no">
                  {timeLeft.day} Days | {timeLeft.hour} Hrs | {timeLeft.min}{" "}
                  Mins |{" "}
                  {isNaN(Math.floor(timeLeft.sec))
                    ? 0
                    : Math.floor(timeLeft.sec)}{" "}
                  Sec
                </span>
              </>
            )}
          </div>
          {/* This part still gets translated */}
          {/* {bannerContent && (
            <div style={{ marginTop: "4px", textAlign: "center" }}>
              {bannerContent}
            </div>
          )} */}
        </div>
      )}
      <div className="container">
        <div className="package-selection-footer-data ">
          <div className="package-selection-footer--box">{left_section}</div>
          <div className="package-selection-footer--button">
            <DarkBgButtonFw
              isLoading={loading ?? false}
              onClick={() => {
                onClick?.();
                setLoading?.(true);
              }}
              disabled={disabled_btn}
            >
              {button_name}
            </DarkBgButtonFw>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DI(MobileFooter);

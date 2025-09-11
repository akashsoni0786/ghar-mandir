import { useEffect, useState } from "react";
import { DarkBgButtonFw } from "./Buttons";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import { updateMobFooter } from "@/store/slices/commonSlice";

interface Props extends DIProps {
  button_name: string;
  button_name_2?: string;
  left_section: React.ReactNode;
  onClick?: () => void;
  onClick_2?: () => void;
  loading_2?: boolean;
  setLoading_2?: (e: boolean) => void;
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

const MobileFooterMultipleActions = ({
  button_name,
  left_section,
  onClick,
  button_name_2,
  onClick_2,
  loading_2,
  setLoading_2,
  loading,
  setLoading,
  hideOnScroll = false,
  showThreshold = 100,
  scrollDebounce = 100,
  showTopBanner = false, // Hidden by default
  bannerContent = "Special Offer!", // Default content
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
    if (!timedata) return;

    const { day, month, year, hour, min } = timedata;
    const targetDate = new Date(year, month - 1, day, hour, min); // Note: month is 0-indexed

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

    // Initial call to avoid 1-second delay
    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []); // Add timedata as dependency

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
  }, [isVisible, showTopBanner]);
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
            {false ? (
              "Offer expired!"
            ) : (
              <>
                {timeLeft.day} Days | {timeLeft.hour} Hrs | {timeLeft.min} Mins
                |{" "}
                {isNaN(Math.floor(timeLeft.sec)) ? 0 : Math.floor(timeLeft.sec)}{" "}
                Sec
              </>
            )}
          </div>
          {/* {bannerContent} */}
        </div>
      )}
      <div className="container">
        <div className="package-selection-footer-data ">
          <div className="package-selection-footer--box">{left_section}</div>
          <div
            className="package-selection-footer--button"
            style={{ display: "flex", gap: "10px", alignItems: "center" }}
          >
            {button_name_2 && (
              <DarkBgButtonFw
                isLoading={loading_2 ?? false}
                onClick={() => {
                  onClick_2?.();
                  setLoading_2?.(true);
                }}
                disabled={disabled_btn}
              >
                {button_name_2}
              </DarkBgButtonFw>
            )}
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

export default DI(MobileFooterMultipleActions);

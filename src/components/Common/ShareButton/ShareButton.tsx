"use client";

import React, { useState, useEffect } from "react";
import { X, Copy } from "react-feather";

interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
  className?: string;
  size?: number;
  iconColor?: string;
  buttonStyle?: React.CSSProperties;
  modalStyle?: React.CSSProperties;
  triggerComponent: any;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  url = typeof window !== "undefined" ? window.location.href : "",
  title = document?.title || "",
  text = "Checkout this puja at Ghar Mandir",
  iconColor = "#af1e2e",
  modalStyle = {},
  triggerComponent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleShareMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsCopied(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text)}`;
    window.open(tweetUrl, "_blank", "width=550,height=420");
  };

  const shareOnFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(fbUrl, "_blank", "width=580,height=296");
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}`;
    window.open(linkedInUrl, "_blank", "width=550,height=420");
  };

  const shareViaEmail = () => {
    const emailUrl = `mailto:?subject=${encodeURIComponent(
      title
    )}&body=${encodeURIComponent(text + "\n\n" + url)}`;
    window.location.href = emailUrl;
  };

  const renderShareOptions = () => {
    // Function to handle native device sharing
    const handleNativeShare = async () => {
      try {
        if (navigator.share) {
          await navigator.share({
            title: title,
            text: text,
            url: url,
          });
        } else {
          // Fallback if Web Share API not supported
          copyToClipboard();
        }
      } catch (err) {
        console.error("Error sharing:", err);
      }
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          padding: "16px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Copy Link */}
        <button
          onClick={copyToClipboard}
          className="share-menu-item"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            borderRadius: "12px",
            backgroundColor: "#F3F4F6",
            border: "none",
            cursor: "pointer",
            color: iconColor,
            transition: "transform 0.2s ease, background-color 0.2s ease",
          }}
          aria-label="Copy link"
        >
          <Copy size={24} color={iconColor} />
          {isCopied && (
            <span
              style={{
                fontSize: "12px",
                marginTop: "4px",
                color: iconColor,
              }}
            >
              Copied!
            </span>
          )}
        </button>

        {/* Twitter */}
        <button
          onClick={shareOnTwitter}
          className="share-menu-item"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            borderRadius: "12px",
            backgroundColor: "#F3F4F6",
            border: "none",
            cursor: "pointer",
            color: iconColor,
            transition: "transform 0.2s ease, background-color 0.2s ease",
          }}
          aria-label="Share on Twitter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="36px"
            height="36px"
          >
            <path d="M13.674,10.163L19.672,3h-1.957l-4.948,5.909L8.5,3H4.035C3.743,3.57,3.69,3.674,3.399,4.244l6.126,8.482L2.652,21h1.95	l5.829-7.018L15.5,21h4.62c0.262-0.512,0.31-0.606,0.572-1.119L13.674,10.163z" />
          </svg>
          {/* <Twitter size={24} color={iconColor} /> */}
        </button>

        {/* Facebook */}
        <button
          onClick={shareOnFacebook}
          className="share-menu-item"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            borderRadius: "12px",
            backgroundColor: "#F3F4F6",
            border: "none",
            cursor: "pointer",
            color: iconColor,
            transition: "transform 0.2s ease, background-color 0.2s ease",
          }}
          aria-label="Share on Facebook"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="48px"
            height="48px"
          >
            <linearGradient
              id="Ld6sqrtcxMyckEl6xeDdMa"
              x1="9.993"
              x2="40.615"
              y1="9.993"
              y2="40.615"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#2aa4f4" />
              <stop offset="1" stopColor="#007ad9" />
            </linearGradient>
            <path
              fill="url(#Ld6sqrtcxMyckEl6xeDdMa)"
              d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
            />
            <path
              fill="#fff"
              d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
            />
          </svg>
          {/* <Facebook size={24} color={iconColor} /> */}
        </button>

        {/* LinkedIn */}
        <button
          onClick={shareOnLinkedIn}
          className="share-menu-item"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            borderRadius: "12px",
            backgroundColor: "#F3F4F6",
            border: "none",
            cursor: "pointer",
            color: iconColor,
            transition: "transform 0.2s ease, background-color 0.2s ease",
          }}
          aria-label="Share on LinkedIn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="48px"
            height="48px"
          >
            <path
              fill="#0078d4"
              d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5	V37z"
            />
            <path
              d="M30,37V26.901c0-1.689-0.819-2.698-2.192-2.698c-0.815,0-1.414,0.459-1.779,1.364	c-0.017,0.064-0.041,0.325-0.031,1.114L26,37h-7V18h7v1.061C27.022,18.356,28.275,18,29.738,18c4.547,0,7.261,3.093,7.261,8.274	L37,37H30z M11,37V18h3.457C12.454,18,11,16.528,11,14.499C11,12.472,12.478,11,14.514,11c2.012,0,3.445,1.431,3.486,3.479	C18,16.523,16.521,18,14.485,18H18v19H11z"
              opacity=".05"
            />
            <path
              d="M30.5,36.5v-9.599c0-1.973-1.031-3.198-2.692-3.198c-1.295,0-1.935,0.912-2.243,1.677	c-0.082,0.199-0.071,0.989-0.067,1.326L25.5,36.5h-6v-18h6v1.638c0.795-0.823,2.075-1.638,4.238-1.638	c4.233,0,6.761,2.906,6.761,7.774L36.5,36.5H30.5z M11.5,36.5v-18h6v18H11.5z M14.457,17.5c-1.713,0-2.957-1.262-2.957-3.001	c0-1.738,1.268-2.999,3.014-2.999c1.724,0,2.951,1.229,2.986,2.989c0,1.749-1.268,3.011-3.015,3.011H14.457z"
              opacity=".07"
            />
            <path
              fill="#fff"
              d="M12,19h5v17h-5V19z M14.485,17h-0.028C12.965,17,12,15.888,12,14.499C12,13.08,12.995,12,14.514,12	c1.521,0,2.458,1.08,2.486,2.499C17,15.887,16.035,17,14.485,17z M36,36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698	c-1.501,0-2.313,1.012-2.707,1.99C24.957,25.543,25,26.511,25,27v9h-5V19h5v2.616C25.721,20.5,26.85,19,29.738,19	c3.578,0,6.261,2.25,6.261,7.274L36,36L36,36z"
            />
          </svg>
          {/* <Linkedin size={24} color={iconColor} /> */}
        </button>

        {/* Email */}
        <button
          onClick={shareViaEmail}
          className="share-menu-item"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            borderRadius: "12px",
            backgroundColor: "#F3F4F6",
            border: "none",
            cursor: "pointer",
            color: iconColor,
            transition: "transform 0.2s ease, background-color 0.2s ease",
          }}
          aria-label="Share via Email"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="48px"
            height="48px"
          >
            <path
              fill="#4caf50"
              d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"
            />
            <path
              fill="#1e88e5"
              d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"
            />
            <polygon
              fill="#e53935"
              points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"
            />
            <path
              fill="#c62828"
              d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"
            />
            <path
              fill="#fbc02d"
              d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"
            />
          </svg>
          {/* <Mail size={24} color={iconColor} /> */}
        </button>

        {/* WhatsApp */}
        <button
          onClick={() => {
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
              text + " " + url
            )}`;
            window.open(whatsappUrl, "_blank");
          }}
          className="share-menu-item"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            borderRadius: "12px",
            backgroundColor: "#F3F4F6",
            border: "none",
            cursor: "pointer",
            color: iconColor,
            transition: "transform 0.2s ease, background-color 0.2s ease",
          }}
          aria-label="Share on WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="48px"
            height="48px"
            fillRule="evenodd"
            clipRule="evenodd"
          >
            <path
              fill="#fff"
              d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"
            />
            <path
              fill="#fff"
              d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"
            />
            <path
              fill="#cfd8dc"
              d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"
            />
            <path
              fill="#40c351"
              d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"
            />
            <path
              fill="#fff"
              fillRule="evenodd"
              d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Instagram */}
        <button
          onClick={() => {
            // Note: Instagram doesn't have a direct share URL, this opens the app if installed
            const instagramUrl = `https://www.instagram.com/`;
            window.open(instagramUrl, "_blank");
          }}
          className="share-menu-item"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            borderRadius: "12px",
            backgroundColor: "#F3F4F6",
            border: "none",
            cursor: "pointer",
            color: iconColor,
            transition: "transform 0.2s ease, background-color 0.2s ease",
          }}
          aria-label="Share on Instagram"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 48 48"
            width="48px"
            height="48px"
            fillRule="evenodd"
          >
            <defs>
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFr"
                x1="23.89"
                x2="24.09"
                y1="40.21"
                y2="10.82"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fffefc" />
                <stop offset=".18" stopColor="#fffdf9" />
                <stop offset=".36" stopColor="#fff9f7" />
                <stop offset=".55" stopColor="#fff5f9" />
                <stop offset=".71" stopColor="#fdf6f9" />
                <stop offset=".86" stopColor="#f9f5fe" />
                <stop offset="1" stopColor="#f8f7ff" />
              </linearGradient>
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFs"
                x1="23.89"
                x2="24.09"
                y1="40.22"
                y2="10.81"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fffefa" />
                <stop offset=".18" stopColor="#fffcf5" />
                <stop offset=".36" stopColor="#fff5f2" />
                <stop offset=".55" stopColor="#ffeff5" />
                <stop offset=".71" stopColor="#fcf1f5" />
                <stop offset=".86" stopColor="#f6effd" />
                <stop offset="1" stopColor="#f4f2ff" />
              </linearGradient>
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFt"
                x1="23.89"
                x2="24.09"
                y1="40.22"
                y2="10.81"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fffdf9" />
                <stop offset=".18" stopColor="#fffbf1" />
                <stop offset=".36" stopColor="#fff2ed" />
                <stop offset=".55" stopColor="#feeaf2" />
                <stop offset=".71" stopColor="#faecf2" />
                <stop offset=".86" stopColor="#f2eafd" />
                <stop offset="1" stopColor="#f0eefe" />
              </linearGradient>
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFu"
                x1="23.89"
                x2="24.09"
                y1="40.22"
                y2="10.81"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fffdf7" />
                <stop offset=".18" stopColor="#fffbee" />
                <stop offset=".36" stopColor="#ffeee9" />
                <stop offset=".55" stopColor="#fee5ee" />
                <stop offset=".71" stopColor="#f9e7ef" />
                <stop offset=".86" stopColor="#efe5fd" />
                <stop offset="1" stopColor="#ede9fe" />
              </linearGradient>
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFv"
                x1="23.89"
                x2="24.09"
                y1="40.22"
                y2="10.81"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fffdf5" />
                <stop offset=".18" stopColor="#fffaea" />
                <stop offset=".36" stopColor="#ffeae4" />
                <stop offset=".55" stopColor="#fedfea" />
                <stop offset=".71" stopColor="#f8e2eb" />
                <stop offset=".86" stopColor="#ecdffc" />
                <stop offset="1" stopColor="#e9e4fe" />
              </linearGradient>
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFw"
                x1="23.89"
                x2="24.09"
                y1="40.22"
                y2="10.81"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fffcf4" />
                <stop offset=".18" stopColor="#fff9e6" />
                <stop offset=".36" stopColor="#ffe7df" />
                <stop offset=".55" stopColor="#fddae7" />
                <stop offset=".71" stopColor="#f6dde8" />
                <stop offset=".86" stopColor="#e8dafc" />
                <stop offset="1" stopColor="#e5e0fd" />
              </linearGradient>
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFa"
                x1="23.89"
                x2="24.09"
                y1="40.21"
                y2="10.82"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fffcf2" />
                <stop offset=".18" stopColor="#fff8e2" />
                <stop offset=".36" stopColor="#ffe3da" />
                <stop offset=".55" stopColor="#fdd4e3" />
                <stop offset=".71" stopColor="#f5d8e4" />
                <stop offset=".86" stopColor="#e5d4fb" />
                <stop offset="1" stopColor="#e1dbfd" />
              </linearGradient>
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFb"
                x1="23.89"
                x2="24.15"
                y1="33.31"
                y2="11.98"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fffffe" />
                <stop offset=".18" stopColor="#fffefc" />
                <stop offset=".36" stopColor="#fffcfb" />
                <stop offset=".55" stopColor="#fffafc" />
                <stop offset=".71" stopColor="#fefbfc" />
                <stop offset=".86" stopColor="#fcfaff" />
                <stop offset="1" stopColor="#fcfbff" />
              </linearGradient>
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFc"
                x1="23.89"
                x2="24.15"
                y1="33.32"
                y2="11.97"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fffefc" />
                <stop offset=".18" stopColor="#fffdf8" />
                <stop offset=".36" stopColor="#fff8f5" />
                <stop offset=".55" stopColor="#fff4f8" />
                <stop offset=".71" stopColor="#fcf5f8" />
                <stop offset=".86" stopColor="#f8f4fe" />
                <stop offset="1" stopColor="#f7f6ff" />
              </linearGradient>
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFd"
                x1="23.89"
                x2="24.15"
                y1="33.33"
                y2="11.96"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fffefa" />
                <stop offset=".18" stopColor="#fffcf3" />
                <stop offset=".36" stopColor="#fff4f0" />
                <stop offset=".55" stopColor="#feedf4" />
                <stop offset=".71" stopColor="#fbeff4" />
                <stop offset=".86" stopColor="#f4edfe" />
                <stop offset="1" stopColor="#f3f0fe" />
              </linearGradient>
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFe"
                x1="23.89"
                x2="24.15"
                y1="33.33"
                y2="11.96"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fffef8" />
                <stop offset=".18" stopColor="#fffbef" />
                <stop offset=".36" stopColor="#fff0eb" />
                <stop offset=".55" stopColor="#fee7f0" />
                <stop offset=".71" stopColor="#faeaf0" />
                <stop offset=".86" stopColor="#f1e7fd" />
                <stop offset="1" stopColor="#efebfe" />
              </linearGradient>
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFf"
                x1="23.89"
                x2="24.15"
                y1="33.33"
                y2="11.96"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fffdf6" />
                <stop offset=".18" stopColor="#fffaeb" />
                <stop offset=".36" stopColor="#ffebe5" />
                <stop offset=".55" stopColor="#fee1eb" />
                <stop offset=".71" stopColor="#f8e4ec" />
                <stop offset=".86" stopColor="#ede1fc" />
                <stop offset="1" stopColor="#eae6fe" />
              </linearGradient>
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFg"
                x1="23.89"
                x2="24.15"
                y1="33.32"
                y2="11.97"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fffdf4" />
                <stop offset=".18" stopColor="#fff9e6" />
                <stop offset=".36" stopColor="#ffe7e0" />
                <stop offset=".55" stopColor="#fddae7" />
                <stop offset=".71" stopColor="#f7dee8" />
                <stop offset=".86" stopColor="#e9dafc" />
                <stop offset="1" stopColor="#e6e0fd" />
              </linearGradient>
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFx"
                x1="23.89"
                x2="24.15"
                y1="33.31"
                y2="11.98"
                xlinkHref="#Ci2Qxa6DtmVe1jz96f9FFa"
              />
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFy"
                x1="30.99"
                x2="31.01"
                y1="15.24"
                y2="16.85"
                xlinkHref="#Ci2Qxa6DtmVe1jz96f9FFb"
              />
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFz"
                x1="30.99"
                x2="31.01"
                y1="15.14"
                y2="16.96"
                xlinkHref="#Ci2Qxa6DtmVe1jz96f9FFc"
              />
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFA"
                x1="30.99"
                x2="31.01"
                y1="15.08"
                y2="17.02"
                xlinkHref="#Ci2Qxa6DtmVe1jz96f9FFd"
              />
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFB"
                x1="30.99"
                x2="31.01"
                y1="15.06"
                y2="17.05"
                xlinkHref="#Ci2Qxa6DtmVe1jz96f9FFe"
              />
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFC"
                x1="30.99"
                x2="31.01"
                y1="15.08"
                y2="17.02"
                xlinkHref="#Ci2Qxa6DtmVe1jz96f9FFf"
              />
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFD"
                x1="30.99"
                x2="31.01"
                y1="15.14"
                y2="16.96"
                xlinkHref="#Ci2Qxa6DtmVe1jz96f9FFg"
              />
              <linearGradient
                id="Ci2Qxa6DtmVe1jz96f9FFE"
                x1="30.99"
                x2="31.01"
                y1="15.24"
                y2="16.85"
                xlinkHref="#Ci2Qxa6DtmVe1jz96f9FFa"
              />
              <radialGradient
                id="Ci2Qxa6DtmVe1jz96f9FFh"
                cx="21.95"
                cy="38.67"
                r="35.34"
                fx="21.95"
                fy="38.67"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fff9e6" />
                <stop offset=".18" stopColor="#fff1c4" />
                <stop offset=".36" stopColor="#ffc7b5" />
                <stop offset=".55" stopColor="#fcaac7" />
                <stop offset=".71" stopColor="#ebb2c8" />
                <stop offset=".86" stopColor="#cbaaf8" />
                <stop offset="1" stopColor="#c2b7fb" />
              </radialGradient>
              <radialGradient
                id="Ci2Qxa6DtmVe1jz96f9FFi"
                cx="21.85"
                cy="38.79"
                r="35.63"
                fx="21.85"
                fy="38.79"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fff8e0" />
                <stop offset=".18" stopColor="#ffeeb7" />
                <stop offset=".36" stopColor="#ffbba5" />
                <stop offset=".55" stopColor="#fb97bb" />
                <stop offset=".71" stopColor="#e6a1bc" />
                <stop offset=".86" stopColor="#bf97f6" />
                <stop offset="1" stopColor="#b5a7fa" />
              </radialGradient>
              <radialGradient
                id="Ci2Qxa6DtmVe1jz96f9FFj"
                cx="21.76"
                cy="38.88"
                r="35.9"
                fx="21.76"
                fy="38.88"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fff6db" />
                <stop offset=".18" stopColor="#ffebaa" />
                <stop offset=".36" stopColor="#ffae94" />
                <stop offset=".55" stopColor="#fa84ae" />
                <stop offset=".71" stopColor="#e290b0" />
                <stop offset=".86" stopColor="#b484f5" />
                <stop offset="1" stopColor="#a797f9" />
              </radialGradient>
              <radialGradient
                id="Ci2Qxa6DtmVe1jz96f9FFk"
                cx="21.67"
                cy="38.97"
                r="36.16"
                fx="21.67"
                fy="38.97"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fff5d5" />
                <stop offset=".18" stopColor="#ffe89d" />
                <stop offset=".36" stopColor="#ffa284" />
                <stop offset=".55" stopColor="#fa71a2" />
                <stop offset=".71" stopColor="#dd7fa4" />
                <stop offset=".86" stopColor="#a871f3" />
                <stop offset="1" stopColor="#9a87f9" />
              </radialGradient>
              <radialGradient
                id="Ci2Qxa6DtmVe1jz96f9FFl"
                cx="21.59"
                cy="39.04"
                r="36.4"
                fx="21.59"
                fy="39.04"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fff3cf" />
                <stop offset=".18" stopColor="#ffe590" />
                <stop offset=".36" stopColor="#ff9574" />
                <stop offset=".55" stopColor="#f95e95" />
                <stop offset=".71" stopColor="#d96e98" />
                <stop offset=".86" stopColor="#9c5ef2" />
                <stop offset="1" stopColor="#8c77f8" />
              </radialGradient>
              <radialGradient
                id="Ci2Qxa6DtmVe1jz96f9FFm"
                cx="21.51"
                cy="39.09"
                r="36.62"
                fx="21.51"
                fy="39.09"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fff2ca" />
                <stop offset=".18" stopColor="#ffe183" />
                <stop offset=".36" stopColor="#ff8963" />
                <stop offset=".55" stopColor="#f84c89" />
                <stop offset=".71" stopColor="#d45c8b" />
                <stop offset=".86" stopColor="#914cf0" />
                <stop offset="1" stopColor="#7f68f7" />
              </radialGradient>
              <radialGradient
                id="Ci2Qxa6DtmVe1jz96f9FFn"
                cx="21.44"
                cy="39.13"
                r="36.83"
                fx="21.44"
                fy="39.13"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#fff0c4" />
                <stop offset=".18" stopColor="#ffde76" />
                <stop offset=".36" stopColor="#ff7c53" />
                <stop offset=".55" stopColor="#f7397c" />
                <stop offset=".71" stopColor="#d04b7f" />
                <stop offset=".86" stopColor="#8539ef" />
                <stop offset="1" stopColor="#7158f6" />
              </radialGradient>
              <radialGradient
                id="Ci2Qxa6DtmVe1jz96f9FFo"
                cx="21.38"
                cy="39.16"
                r="37.02"
                fx="21.38"
                fy="39.16"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#ffefbe" />
                <stop offset=".18" stopColor="#ffdb69" />
                <stop offset=".36" stopColor="#ff7043" />
                <stop offset=".55" stopColor="#f72670" />
                <stop offset=".71" stopColor="#cb3a73" />
                <stop offset=".86" stopColor="#7926ed" />
                <stop offset="1" stopColor="#6448f6" />
              </radialGradient>
              <radialGradient
                id="Ci2Qxa6DtmVe1jz96f9FFp"
                cx="21.32"
                cy="39.17"
                r="37.19"
                fx="21.32"
                fy="39.17"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#ffedb9" />
                <stop offset=".18" stopColor="#ffd85c" />
                <stop offset=".36" stopColor="#ff6332" />
                <stop offset=".55" stopColor="#f61363" />
                <stop offset=".71" stopColor="#c72967" />
                <stop offset=".86" stopColor="#6e13ec" />
                <stop offset="1" stopColor="#5638f5" />
              </radialGradient>
              <radialGradient
                id="Ci2Qxa6DtmVe1jz96f9FFq"
                cx="21.26"
                cy="39.16"
                r="37.34"
                fx="21.26"
                fy="39.16"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#ffecb3" />
                <stop offset=".18" stopColor="#ffd54f" />
                <stop offset=".36" stopColor="#ff5722" />
                <stop offset=".55" stopColor="#f50057" />
                <stop offset=".71" stopColor="#c2185b" />
                <stop offset=".86" stopColor="#6200ea" />
                <stop offset="1" stopColor="#4928f4" />
              </radialGradient>
            </defs>
            <path
              fill="url(#Ci2Qxa6DtmVe1jz96f9FFh)"
              fillRule="evenodd"
              d="m31.37,42h-14.74c-5.87,0-10.63-4.76-10.63-10.63v-14.74c0-5.87,4.76-10.63,10.63-10.63h14.74c5.87,0,10.63,4.76,10.63,10.63v14.74c0,5.87-4.76,10.63-10.63,10.63Z"
            />
            <rect
              width="35.33"
              height="35.33"
              x="6.33"
              y="6.33"
              fill="url(#Ci2Qxa6DtmVe1jz96f9FFi)"
              rx="10.34"
              ry="10.34"
            />
            <rect
              width="34.67"
              height="34.67"
              x="6.67"
              y="6.67"
              fill="url(#Ci2Qxa6DtmVe1jz96f9FFj)"
              rx="10.05"
              ry="10.05"
            />
            <rect
              width="34"
              height="34"
              x="7"
              y="7"
              fill="url(#Ci2Qxa6DtmVe1jz96f9FFk)"
              rx="9.75"
              ry="9.75"
            />
            <rect
              width="33.33"
              height="33.33"
              x="7.33"
              y="7.33"
              fill="url(#Ci2Qxa6DtmVe1jz96f9FFl)"
              rx="9.46"
              ry="9.46"
            />
            <rect
              width="32.67"
              height="32.67"
              x="7.67"
              y="7.67"
              fill="url(#Ci2Qxa6DtmVe1jz96f9FFm)"
              rx="9.17"
              ry="9.17"
            />
            <rect
              width="32"
              height="32"
              x="8"
              y="8"
              fill="url(#Ci2Qxa6DtmVe1jz96f9FFn)"
              rx="8.88"
              ry="8.88"
            />
            <rect
              width="31.33"
              height="31.33"
              x="8.33"
              y="8.33"
              fill="url(#Ci2Qxa6DtmVe1jz96f9FFo)"
              rx="8.58"
              ry="8.58"
            />
            <rect
              width="30.67"
              height="30.67"
              x="8.67"
              y="8.67"
              fill="url(#Ci2Qxa6DtmVe1jz96f9FFp)"
              rx="8.29"
              ry="8.29"
            />
            <rect
              width="30"
              height="30"
              x="9"
              y="9"
              fill="url(#Ci2Qxa6DtmVe1jz96f9FFq)"
              rx="8"
              ry="8"
            />
            <g>
              <path
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFr)"
                d="m18,12c-3.36,0-6,2.64-6,6v12c0,3.36,2.64,6,6,6h12c3.36,0,6-2.64,6-6v-12c0-3.36-2.64-6-6-6h-12Zm12,26h-12c-4.49,0-8-3.51-8-8v-12c0-4.49,3.51-8,8-8h12c4.49,0,8,3.51,8,8v12c0,4.49-3.51,8-8,8Z"
              />
              <path
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFs)"
                d="m18,11.9c-3.42,0-6.1,2.68-6.1,6.1v12c0,3.42,2.68,6.1,6.1,6.1h12c3.42,0,6.1-2.68,6.1-6.1v-12c0-3.42-2.68-6.1-6.1-6.1h-12Zm12,26h-12c-4.43,0-7.9-3.47-7.9-7.9v-12c0-4.43,3.47-7.9,7.9-7.9h12c4.43,0,7.9,3.47,7.9,7.9v12c0,4.43-3.47,7.9-7.9,7.9Z"
              />
              <path
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFt)"
                d="m18,11.79c-3.48,0-6.21,2.73-6.21,6.21v12c0,3.48,2.73,6.21,6.21,6.21h12c3.48,0,6.21-2.73,6.21-6.21v-12c0-3.48-2.73-6.21-6.21-6.21h-12Zm12,26h-12c-4.37,0-7.79-3.42-7.79-7.79v-12c0-4.37,3.42-7.79,7.79-7.79h12c4.37,0,7.79,3.42,7.79,7.79v12c0,4.37-3.42,7.79-7.79,7.79Z"
              />
              <path
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFu)"
                d="m18,11.69c-3.54,0-6.31,2.77-6.31,6.31v12c0,3.54,2.77,6.31,6.31,6.31h12c3.54,0,6.31-2.77,6.31-6.31v-12c0-3.54-2.77-6.31-6.31-6.31h-12Zm12,26h-12c-4.31,0-7.69-3.38-7.69-7.69v-12c0-4.31,3.38-7.69,7.69-7.69h12c4.31,0,7.69,3.38,7.69,7.69v12c0,4.31-3.38,7.69-7.69,7.69Z"
              />
              <path
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFv)"
                d="m18,11.58c-3.6,0-6.42,2.82-6.42,6.42v12c0,3.6,2.82,6.42,6.42,6.42h12c3.6,0,6.42-2.82,6.42-6.42v-12c0-3.6-2.82-6.42-6.42-6.42h-12Zm12,26h-12c-4.25,0-7.58-3.33-7.58-7.58v-12c0-4.25,3.33-7.58,7.58-7.58h12c4.25,0,7.58,3.33,7.58,7.58v12c0,4.25-3.33,7.58-7.58,7.58Z"
              />
              <path
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFw)"
                d="m18,11.48c-3.66,0-6.52,2.86-6.52,6.52v12c0,3.66,2.86,6.52,6.52,6.52h12c3.66,0,6.52-2.86,6.52-6.52v-12c0-3.66-2.86-6.52-6.52-6.52h-12Zm12,26h-12c-4.19,0-7.48-3.28-7.48-7.48v-12c0-4.19,3.29-7.48,7.48-7.48h12c4.19,0,7.48,3.28,7.48,7.48v12c0,4.19-3.29,7.48-7.48,7.48Z"
              />
              <path
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFa)"
                d="m18,11.38c-3.71,0-6.62,2.91-6.62,6.62v12c0,3.71,2.91,6.62,6.62,6.62h12c3.71,0,6.62-2.91,6.62-6.62v-12c0-3.71-2.91-6.62-6.62-6.62h-12Zm12,26h-12c-4.14,0-7.38-3.24-7.38-7.38v-12c0-4.14,3.24-7.38,7.38-7.38h12c4.14,0,7.38,3.24,7.38,7.38v12c0,4.14-3.24,7.38-7.38,7.38Z"
              />
            </g>
            <g>
              <path
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFb)"
                d="m24,19c-2.76,0-5,2.24-5,5s2.24,5,5,5,5-2.24,5-5-2.24-5-5-5Zm0,12c-3.86,0-7-3.14-7-7s3.14-7,7-7,7,3.14,7,7-3.14,7-7,7Z"
              />
              <path
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFc)"
                d="m24,18.9c-2.81,0-5.1,2.29-5.1,5.1s2.29,5.1,5.1,5.1,5.1-2.29,5.1-5.1-2.29-5.1-5.1-5.1Zm0,12c-3.8,0-6.9-3.09-6.9-6.9s3.09-6.9,6.9-6.9,6.9,3.09,6.9,6.9-3.09,6.9-6.9,6.9Z"
              />
              <path
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFd)"
                d="m24,18.79c-2.87,0-5.21,2.34-5.21,5.21s2.34,5.21,5.21,5.21,5.21-2.34,5.21-5.21-2.34-5.21-5.21-5.21Zm0,12c-3.74,0-6.79-3.05-6.79-6.79s3.05-6.79,6.79-6.79,6.79,3.05,6.79,6.79-3.05,6.79-6.79,6.79Z"
              />
              <path
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFe)"
                d="m24,18.69c-2.93,0-5.31,2.38-5.31,5.31s2.38,5.31,5.31,5.31,5.31-2.38,5.31-5.31-2.38-5.31-5.31-5.31Zm0,12c-3.69,0-6.69-3-6.69-6.69s3-6.69,6.69-6.69,6.69,3,6.69,6.69-3,6.69-6.69,6.69Z"
              />
              <path
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFf)"
                d="m24,18.58c-2.99,0-5.42,2.43-5.42,5.42s2.43,5.42,5.42,5.42,5.42-2.43,5.42-5.42-2.43-5.42-5.42-5.42Zm0,12c-3.63,0-6.58-2.95-6.58-6.58s2.95-6.58,6.58-6.58,6.58,2.95,6.58,6.58-2.95,6.58-6.58,6.58Z"
              />
              <path
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFg)"
                d="m24,18.48c-3.04,0-5.52,2.48-5.52,5.52s2.48,5.52,5.52,5.52,5.52-2.48,5.52-5.52-2.48-5.52-5.52-5.52Zm0,12c-3.57,0-6.48-2.91-6.48-6.48s2.91-6.48,6.48-6.48,6.48,2.91,6.48,6.48-2.91,6.48-6.48,6.48Z"
              />
              <path
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFx)"
                d="m24,18.38c-3.1,0-5.62,2.52-5.62,5.62s2.52,5.62,5.62,5.62,5.62-2.52,5.62-5.62-2.52-5.62-5.62-5.62Zm0,12c-3.52,0-6.38-2.86-6.38-6.38s2.86-6.38,6.38-6.38,6.38,2.86,6.38,6.38-2.86,6.38-6.38,6.38Z"
              />
            </g>
            <g>
              <circle
                cx="31"
                cy="16"
                r="1"
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFy)"
              />
              <circle
                cx="31"
                cy="16"
                r=".9"
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFz)"
              />
              <circle
                cx="31"
                cy="16"
                r=".8"
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFA)"
              />
              <circle
                cx="31"
                cy="16"
                r=".69"
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFB)"
              />
              <circle
                cx="31"
                cy="16"
                r=".59"
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFC)"
              />
              <circle
                cx="31"
                cy="16"
                r=".49"
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFD)"
              />
              <circle
                cx="31"
                cy="16"
                r=".39"
                fill="url(#Ci2Qxa6DtmVe1jz96f9FFE)"
              />
            </g>
          </svg>
        </button>

        {/* Native Share */}
        {typeof navigator !== "undefined" &&
          typeof navigator.share === "function" && (
            <button
              onClick={handleNativeShare}
              className="share-menu-item"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "64px",
                height: "64px",
                borderRadius: "12px",
                backgroundColor: "#F3F4F6",
                border: "none",
                cursor: "pointer",
                color: iconColor,
                transition: "transform 0.2s ease, background-color 0.2s ease",
              }}
              aria-label="More sharing options"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0,0,256,256"
                width="36px"
                height="36px"
                fillRule="nonzero"
              >
                <g
                  fill="#af1e2e"
                  fillRule="nonzero"
                  stroke="none"
                  strokeWidth="1"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  strokeMiterlimit="10"
                  strokeDasharray=""
                  strokeDashoffset="0"
                  fontFamily="none"
                  fontWeight="none"
                  fontSize="none"
                  textAnchor="none"
                  style={{ mixBlendMode: "normal" }}
                >
                  <g transform="scale(5.33333,5.33333)">
                    <path d="M38.1,31.2l-18.7,-7.2l18.7,-7.2c1.5,-0.6 2.3,-2.3 1.7,-3.9c-0.6,-1.5 -2.3,-2.3 -3.9,-1.7l-26,10c-1.1,0.4 -1.9,1.6 -1.9,2.8c0,1.2 0.8,2.4 1.9,2.8l26,10c0.4,0.1 0.7,0.2 1.1,0.2c1.2,0 2.3,-0.7 2.8,-1.9c0.6,-1.6 -0.2,-3.3 -1.7,-3.9z"></path>
                    <path d="M11,17c-3.86599,0 -7,3.13401 -7,7c0,3.86599 3.13401,7 7,7c3.86599,0 7,-3.13401 7,-7c0,-3.86599 -3.13401,-7 -7,-7zM37,7c-3.86599,0 -7,3.13401 -7,7c0,3.86599 3.13401,7 7,7c3.86599,0 7,-3.13401 7,-7c0,-3.86599 -3.13401,-7 -7,-7zM37,27c-3.86599,0 -7,3.13401 -7,7c0,3.86599 3.13401,7 7,7c3.86599,0 7,-3.13401 7,-7c0,-3.86599 -3.13401,-7 -7,-7z"></path>
                  </g>
                </g>
              </svg>
            </button>
          )}
      </div>
    );
  };

  return (
    <>
      <div onClick={toggleShareMenu}>{triggerComponent}</div>
      {/* Mobile Bottom Drawer */}
      {isOpen && isMobile && (
        <div
          style={{
            position: "fixed",
            bottom: "0",
            left: "0",
            right: "0",
            zIndex: "50",
            backgroundColor: "white",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)",
            padding: "16px",
            maxHeight: "80vh",
            overflowY: "auto",
            ...modalStyle,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              paddingBottom: "8px",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", margin: "0" }}>
              Share
            </h3>
            <button
              onClick={closeModal}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <X size={20} color={iconColor} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {renderShareOptions()}
          </div>
        </div>
      )}

      {/* Desktop Modal */}
      {isOpen && !isMobile && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: "50",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "400px",
              padding: "24px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              ...modalStyle,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h3 style={{ fontSize: "20px", fontWeight: "600", margin: "0" }}>
                Share
              </h3>
              <button
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={24} color={"#af1e2e"} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {renderShareOptions()}
            </div>
          </div>
        </div>
      )}

      {/* Overlay for both mobile and desktop */}
      {isOpen && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: "40",
            touchAction: "none"
          }}
        />
      )}

      <style jsx global>{`
        .share-button-main:hover {
          background-color: #e5e7eb !important;
        }

        .share-menu-item:hover {
          background-color: #f3f4f6 !important;
        }
      `}</style>
    </>
  );
};

export default ShareButton;

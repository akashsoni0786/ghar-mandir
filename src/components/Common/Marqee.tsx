// components/Marquee.tsx
import React from "react";

interface MarqueeProps {
  content: React.ReactNode;
  speed?: number; // pixels per second
  direction?: "left" | "right";
  backgroundColor?: string;
  textColor?: string;
  height?: string;
  sticky?: boolean; // New prop to control sticky behavior
  stickyOffset?: string; // New prop for sticky position offset
  // New button props
  showButton?: boolean;
  buttonText?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  onButtonClick?: () => void;
}

const Marquee: React.FC<MarqueeProps> = ({
  content,
  speed = 10,
  direction = "left",
  backgroundColor = "linear-gradient(#d29c66, #f6ddc6 30%, #f6ddc6 70%, #d29c66)",
  textColor = "#404040",
  // height = '40px',
  sticky = false, // Default to non-sticky
  stickyOffset = "0", // Default offset
  // Button props with defaults
  showButton = false,
  buttonText = "Action",
  buttonBackgroundColor = "#ffffff",
  buttonTextColor = "#404040",
  onButtonClick,
}) => {
  return (
    <div
      style={{
        position: sticky ? "sticky" : "relative",
        top: sticky ? stickyOffset : "auto",
        zIndex: sticky ? 1 : "auto",
        overflow: "hidden",
        whiteSpace: "nowrap",
        width: "100%",
        background: backgroundColor,
        color: textColor,
        display: "flex",
        alignItems: "center",
        boxShadow: sticky ? "0 2px 5px rgba(0,0,0,0.1)" : "none",
        padding: "4px 0", // Added some padding for better spacing
      }}
    >
      {/* Marquee Content Container */}
      <div
        style={{
          flex: showButton ? "1" : "none",
          overflow: "hidden",
          minWidth: 0, // Important for flex shrinking
        }}
      >
        <div
          style={{
            display: "inline-block",
            paddingLeft: "100%",
            animation: `marquee ${speed}s linear infinite`,
            animationDirection: direction === "left" ? "normal" : "reverse",
          }}
        >
          {content}
        </div>
      </div>

      {/* Button */}
      {showButton && (
        <button
          onClick={onButtonClick}
          style={{
            backgroundColor: buttonBackgroundColor,
            color: buttonTextColor,
            border: "none",
            padding: "6px 12px",
            margin: "0 10px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "12px",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.8";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {buttonText}
        </button>
      )}

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default Marquee;

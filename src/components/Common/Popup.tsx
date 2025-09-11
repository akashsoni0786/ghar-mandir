import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type PopupPosition = "top" | "bottom" | "left" | "right" | "center";

interface PopupProps {
  children: React.ReactNode;
  position?: PopupPosition;
  offset?: number | string;
  width?: string;
  maxWidth?: string;
  className?: string;
  style?: React.CSSProperties;
  onClose?: () => void;
  updateState?: () => void;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean; // New prop to control close button visibility
  closeButtonStyle?: React.CSSProperties; // Style for the close button
  isEscape?: boolean;
}

const Popup: React.FC<PopupProps> = ({
  children,
  position = "bottom",
  offset = "16px",
  width = "calc(100% - 16px)",
  maxWidth = "600px",
  className = "",
  style = {},
  onClose,
  updateState,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  showCloseButton = true, // Default to true
  closeButtonStyle = {},
  isEscape = false,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const portalRoot = document.getElementById("popup-root") || createPopupRoot();

  // Handle outside clicks
  useEffect(() => {
    if (!closeOnOutsideClick || !onClose) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeOnOutsideClick, onClose]);

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !onClose) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeOnEscape, onClose]);

  const positionStyles = getPositionStyles(position, offset);

  // Create portal to render popup directly in body
  return createPortal(
    <div className={isEscape ? "popup-overlay" : ""}>
      <div
        onClick={() => {
          if (isEscape && onClose) onClose();
        }}
        ref={popupRef}
        className={`popup-container ${className}`}
        style={{
          position: "fixed",
          zIndex: 1000,
          ...positionStyles,
          ...style,
        }}
      >
        <div
          className="popup-content"
          style={{
            width,
            maxWidth,
            position: "relative", // Needed for absolute positioning of close button
          }}
          onClick={(e) => e.stopPropagation()} 
        >
          {showCloseButton && (onClose || updateState) && (
            <button
              className="popup-close-button"
              onClick={() => {
                if (onClose) onClose();
                if (updateState) updateState();
              }}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "40px",
                padding: "4px",
                lineHeight: "1",
                color: "#888",
                ...closeButtonStyle,
              }}
              aria-label="Close popup"
            >
              &times;
            </button>
          )}
          {children}
        </div>
      </div>
    </div>,
    portalRoot
  );
};

// Helper to create popup root if it doesn't exist
const createPopupRoot = () => {
  const popupRoot = document.createElement("div");
  popupRoot.id = "popup-root";
  document.body.appendChild(popupRoot);
  return popupRoot;
};

// Position styles helper (same as before)
const getPositionStyles = (
  position: PopupPosition,
  offset: number | string
): React.CSSProperties => {
  const numericOffset = typeof offset === "number" ? `${offset}px` : offset;

  switch (position) {
    case "top":
      return {
        top: numericOffset,
        bottom: "auto",
        left: 0,
        right: 0,
        justifyContent: "center",
      };
    case "bottom":
      return {
        bottom: numericOffset,
        top: "auto",
        left: 0,
        right: 0,
        justifyContent: "center",
      };
    case "left":
      return {
        left: numericOffset,
        right: "auto",
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "flex-start",
      };
    case "right":
      return {
        right: numericOffset,
        left: "auto",
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "flex-end",
      };
    case "center":
      return {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
      };
    default:
      return {
        bottom: numericOffset,
        top: "auto",
        left: 0,
        right: 0,
        justifyContent: "center",
      };
  }
};

export default Popup;

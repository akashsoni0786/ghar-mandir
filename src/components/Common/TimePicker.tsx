import React, { useState, useRef, useEffect } from "react";
import { CSSProperties } from "react";
import { Clock } from "react-feather";

interface TimePickerProps {
  heading?: string;
  value?: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  readOnly?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  onBlur?: () => void;
  isLoading?: boolean;
  disableWhileLoading?: boolean;
  iconColor?: string;
  customClockIcon?: React.ReactNode;
  inputId?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
  heading,
  value = "",
  onChange,
  style,
  inputStyle,
  readOnly = false,
  disabled = false,
  error = false,
  helperText,
  required = false,
  onBlur,
  isLoading = false,
  disableWhileLoading = true,
  iconColor = "#AF1E2E",
  customClockIcon,
  inputId = `time-picker-${Math.random().toString(36).substr(2, 9)}`,
}) => {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmPm] = useState("AM");
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const ampmOptions = ['AM', 'PM'];

  const isDisabled = disabled || (isLoading && disableWhileLoading);

  useEffect(() => {
    if (value) {
      const [time, period] = value.split(' ');
      if (time && period) {
        const [h, m] = time.split(':');
        setHour(h);
        setMinute(m);
        setAmPm(period);
      }
    }
  }, [value]);

  const handleTimeChange = (h: string, m: string, a: string) => {
    if (h) setHour(h);
    if (m) setMinute(m);
    if (a) setAmPm(a);
    
    if (h && m && a) {
      const newTime = `${h}:${m} ${a}`;
      onChange?.(newTime);
    }
  };

  const togglePopover = () => {
    if (!isDisabled && !readOnly) {
      setShowPopover(!showPopover);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      setShowPopover(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formattedTime = hour!= "" ? `${hour}:${minute} ${ampm}`:"";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        width: "100%",
        position: "relative",
        ...style,
      }}
    >
      {heading && (
        <label
          style={{
            color: error ? "#AF1E2E" : "#333",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "normal",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {heading}
          {required && (
            <span style={{ color: "#AF1E2E", fontSize: "12px" }}>*</span>
          )}
        </label>
      )}

      <div
        style={{
          display: "flex",
          height: "45px",
          padding: "8px 16px 8px 16px",
          alignItems: "center",
          gap: "8px",
          borderRadius: "32px",
          border: error ? "1px solid #AF1E2E" : "1px solid #D1D1D1",
          background: isDisabled ? "#F5F5F5" : "#FFF",
          position: "relative",
          transition: "border-color 0.2s ease",
          ...(!isDisabled && !readOnly
            ? { ":hover": { borderColor: error ? "#AF1E2E" : "#888" } }
            : {}),
        }}
        onClick={togglePopover}
      >
        <input
          id={inputId}
          type="text"
          placeholder="Select time"
          value={formattedTime}
          readOnly
          disabled={isDisabled}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "inherit",
            fontSize: "16px",
            color: isDisabled ? "#888" : error ? "#AF1E2E" : "#333",
            cursor: isDisabled ? "not-allowed" : "pointer",
            paddingRight: "32px",
            minWidth: 0,
            ...inputStyle,
          }}
          onBlur={onBlur}
        />

        {isLoading && (
          <div
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid rgba(0, 0, 0, 0.1)",
                borderTop: "2px solid #333",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
        )}

        {!isLoading && (
          <div
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isDisabled ? "not-allowed" : "pointer",
              opacity: isDisabled ? 0.5 : 1,
            }}
          >
            {customClockIcon || (
              <Clock color={error ? "#AF1E2E" : iconColor} />
            )}
          </div>
        )}
      </div>

      {showPopover && (
        <div
          ref={popoverRef}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            width: "200px",
            height: "300px",
            backgroundColor: "#FFF",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            zIndex: 1000,
            overflow: "hidden",
            display: "flex",
            padding: "8px 0",
          }}
        >
          {/* Hours Column */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            <div style={{
              padding: "8px",
              textAlign: "center",
              fontWeight: 500,
              fontSize: "14px",
              color: "#888",
              position: "sticky",
              top: 0,
              backgroundColor: "#FFF",
              borderBottom: "1px solid #eee",
            }}>
              Hrs
            </div>
            {hours.map((h) => (
              <div
                key={h}
                style={{
                  padding: "10px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: hour === h ? "#F5F5F5" : "transparent",
                  // ":hover": {
                  //   backgroundColor: "#F5F5F5",
                  // },
                }}
                onClick={() => handleTimeChange(h, minute, ampm)}
              >
                {h}
              </div>
            ))}
          </div>

          {/* Minutes Column */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            <div style={{
              padding: "8px",
              textAlign: "center",
              fontWeight: 500,
              fontSize: "14px",
              color: "#888",
              position: "sticky",
              top: 0,
              backgroundColor: "#FFF",
              borderBottom: "1px solid #eee",
            }}>
              Mins
            </div>
            {minutes.map((m) => (
              <div
                key={m}
                style={{
                  padding: "10px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: minute === m ? "#F5F5F5" : "transparent",
                  // ":hover": {
                  //   backgroundColor: "#F5F5F5",
                  // },
                }}
                onClick={() => handleTimeChange(hour, m, ampm)}
              >
                {m}
              </div>
            ))}
          </div>

          {/* AM/PM Column */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            <div style={{
              padding: "8px",
              textAlign: "center",
              fontWeight: 500,
              fontSize: "14px",
              color: "#888",
              position: "sticky",
              top: 0,
              backgroundColor: "#FFF",
              borderBottom: "1px solid #eee",
            }}>
              AM/PM
            </div>
            {ampmOptions.map((a) => (
              <div
                key={a}
                style={{
                  padding: "10px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: ampm === a ? "#F5F5F5" : "transparent",
                  // ":hover": {
                  //   backgroundColor: "#F5F5F5",
                  // },
                }}
                onClick={() => handleTimeChange(hour, minute, a)}
              >
                {a}
              </div>
            ))}
          </div>
        </div>
      )}

      {helperText && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "2px",
            marginLeft: "12px",
            minHeight: "16px",
          }}
        >
          <span
            style={{
              color: error ? "#AF1E2E" : "#888",
              fontSize: "12px",
              flex: 1,
            }}
          >
            {helperText}
          </span>
        </div>
      )}
    </div>
  );
};

export default TimePicker;
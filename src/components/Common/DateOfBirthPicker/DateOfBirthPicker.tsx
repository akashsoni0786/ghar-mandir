import React, { useState, useEffect } from "react";
import { CSSProperties } from "react";
import Select from "../Select";

interface DateOfBirthPickerProps {
  heading?: string;
  value?: string[]; // Format: ['dd', 'mm', 'yyyy']
  onChange?: (value: string[]) => void;
  style?: CSSProperties;
  readOnly?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  onBlur?: () => void;
  isLoading?: boolean;
  disableWhileLoading?: boolean;
  iconColor?: string;
  inputId?: string;
}

const DateOfBirthPicker: React.FC<DateOfBirthPickerProps> = ({
  heading,
  value = [],
  onChange,
  style,
  readOnly = false,
  disabled = false,
  error = false,
  helperText,
  required = false,
  onBlur,
  isLoading = false,
  disableWhileLoading = true,
  iconColor = "#AF1E2E",
  inputId = `dob-picker-${Math.random().toString(36).substr(2, 9)}`,
}) => {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [internalError, setInternalError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [selectionOrder, setSelectionOrder] = useState<("day" | "month" | "year")[]>([]);

  const isDisabled = disabled || (isLoading && disableWhileLoading);

  // Check screen width on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 320);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Generate days (1-31)
  const days = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1).padStart(2, '0'),
  }));

  // Months
  const months = [
    { value: "1", label: "Jan" },
    { value: "2", label: "Feb" },
    { value: "3", label: "Mar" },
    { value: "4", label: "Apr" },
    { value: "5", label: "May" },
    { value: "6", label: "Jun" },
    { value: "7", label: "Jul" },
    { value: "8", label: "Aug" },
    { value: "9", label: "Sep" },
    { value: "10", label: "Oct" },
    { value: "11", label: "Nov" },
    { value: "12", label: "Dec" },
  ];

  // Generate years (current year - 13 to current year - 100)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 0 - (currentYear - 100) + 1 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  }));

  // Parse initial value
  useEffect(() => {
    if (value && value.length === 3) {
      const [d, m, y] = value;
      if (y) setYear(y);
      if (m) setMonth(m);
      if (d) setDay(d);
    }
  }, [value]);

  const handleDayChange = (value: string) => {
    setDay(value);
    setSelectionOrder([...selectionOrder, 'day']);
    validateDate(value, month, year);
  };

  const handleMonthChange = (value: string) => {
    setMonth(value);
    setSelectionOrder([...selectionOrder, 'month']);
    validateDate(day, value, year);
  };

  const handleYearChange = (value: string) => {
    // Check if year is being selected before day/month
    if ((!day || !month) && value) {
      setInternalError("Please select day and month first");
      return;
    }
    
    setYear(value);
    setSelectionOrder([...selectionOrder, 'year']);
    validateDate(day, month, value);
  };

  // Validate date and trigger onChange
  const validateDate = (d: string, m: string, y: string) => {
    if (d && m && y) {
      // Validate the date
      const date = new Date(Number(y), Number(m) - 1, Number(d));
      const isValid = (
        date.getFullYear() === Number(y) &&
        date.getMonth() === Number(m) - 1 &&
        date.getDate() === Number(d)
      );

      if (isValid) {
        setInternalError("");
        onChange?.([d, m, y]);
      } else {
        setInternalError("Invalid date");
      }
    } else if (d || m || y) {
      // Partial selection
      if (y && (!d || !m)) {
        setInternalError("Please select day and month first");
      } else {
        setInternalError("Please complete the date");
      }
    } else {
      // No selection
      setInternalError("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        width: "100%",
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
          gap: "8px",
          width: "100%",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* Day Select */}
        <div style={{ flex: isMobile ? undefined : 1, minWidth: isMobile ? undefined : "80px" }}>
          <Select
            placeholder="Day"
            value={day}
            onChange={handleDayChange}
            options={days}
            disabled={isDisabled}
            readOnly={readOnly}
            error={error || !!internalError}
            selectStyle={{
              borderRadius: "32px",
              ...(error || internalError ? { borderColor: "#AF1E2E" } : {}),
            }}
          />
        </div>

        {/* Month Select */}
        <div style={{ flex: isMobile ? undefined : 1, minWidth: isMobile ? undefined : "100px" }}>
          <Select
            placeholder="Month"
            value={month}
            onChange={handleMonthChange}
            options={months}
            disabled={isDisabled}
            readOnly={readOnly}
            error={error || !!internalError}
            selectStyle={{
              borderRadius: "32px",
              ...(error || internalError ? { borderColor: "#AF1E2E" } : {}),
            }}
          />
        </div>

        {/* Year Select */}
        <div style={{ flex: isMobile ? undefined : 1, minWidth: isMobile ? undefined : "90px" }}>
          <Select
            placeholder="Year"
            value={year}
            onChange={handleYearChange}
            options={years}
            disabled={isDisabled}
            readOnly={readOnly}
            error={error || !!internalError}
            selectStyle={{
              borderRadius: "32px",
              ...(error || internalError ? { borderColor: "#AF1E2E" } : {}),
            }}
          />
        </div>
      </div>

      {(helperText || internalError) && (
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
              color: error || internalError ? "#AF1E2E" : "#888",
              fontSize: "12px",
              flex: 1,
            }}
          >
            {internalError || helperText}
          </span>
        </div>
      )}
    </div>
  );
};

export default DateOfBirthPicker;
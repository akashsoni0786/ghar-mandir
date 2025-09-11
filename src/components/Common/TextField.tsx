import React, { useState, useRef, useEffect } from "react";
import { CSSProperties } from "react";
import { countryCodes } from "../../constants/countrycode";
import useWindow from "@/customHooks/useWindows";

// Default Calendar Icon Component
const CalendarIcon = ({
  color = "#AF1E2E",
  size = 20,
}: {
  color?: string;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.6947 13.7H15.7037M15.6947 16.7H15.7037M11.9955 13.7H12.0045M11.9955 16.7H12.0045M8.29431 13.7H8.30329M8.29431 16.7H8.30329"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Search Icon Component
const SearchIcon = ({
  color = "#888",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 22L20 20"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Country flag component using SVG images
const CountryFlag = ({ code }: { code: string }) => {
  const flagUrl = `https://flagcdn.com/${code.toLowerCase()}.svg`;

  return (
    <div
      style={{
        width: "24px",
        height: "16px",
        marginRight: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: "2px",
      }}
    >
      <img
        src={flagUrl}
        alt={`${code} flag`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        onError={(e) => {
          // Fallback to generic flag if the specific one doesn't load
          (e.target as HTMLImageElement).src = "https://flagcdn.com/xx.svg";
        }}
      />
    </div>
  );
};

interface TextFieldProps {
  heading?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?:
    | "text"
    | "password"
    | "email"
    | "number"
    | "tel"
    | "date"
    | "datetime-local"
    | "month"
    | "week"
    | "time";
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  readOnly?: boolean;
  disabled?: boolean;
  withIcon?: boolean;
  iconPosition?: "left" | "right" | "both";
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
  helperText?: string;
  maxLength?: number;
  showCharCount?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  onBlur?: () => void;
  isLoading?: boolean;
  disableWhileLoading?: boolean;
  minDate?: string;
  maxDate?: string;
  dateRestriction?: "past" | "future" | "none";
  iconColor?: string;
  customCalendarIcon?: React.ReactNode;
  hideNativeCalendarIcon?: boolean;
  inputId?: string;
  countryCode?: string;
  onCountryCodeChange?: (code: string) => void;
}

const Spinner = ({ size = 16 }: { size?: number }) => {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: "2px solid rgba(0, 0, 0, 0.1)",
        borderTop: "2px solid #333",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
  );
};

const TextField: React.FC<TextFieldProps> = ({
  heading,
  placeholder = "",
  value = "",
  onChange,
  type = "text",
  style,
  inputStyle,
  readOnly = false,
  disabled = false,
  withIcon = false,
  iconPosition = "left",
  icon,
  rightIcon,
  error = false,
  helperText,
  maxLength,
  showCharCount = false,
  required = false,
  autoFocus = false,
  onBlur,
  isLoading = false,
  disableWhileLoading = true,
  minDate,
  maxDate,
  dateRestriction = "none",
  iconColor = "#AF1E2E",
  customCalendarIcon,
  hideNativeCalendarIcon = true,
  inputId = `text-field-${Math.random().toString(36).substr(2, 9)}`,
  countryCode = "+91",
  onCountryCodeChange,
}) => {
  const { width } = useWindow();
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [validationError, setValidationError] = useState<string | undefined>(
    undefined
  );
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countryCodes.find((c) => c.code === countryCode);

  // Validate phone number length for tel type
  const validatePhoneNumber = (inputValue: string) => {
    if (type !== "tel" || !selectedCountry) return;

    // Skip validation if input is empty
    if (!inputValue) {
      setValidationError(undefined);
      return;
    }

    // Calculate the length of the phone number (excluding country code)
    const phoneLength = inputValue.replace(/\D/g, "").length;
    const countryCodeLength = selectedCountry.code.replace(/\D/g, "").length;
    const minLength = selectedCountry.minlen - countryCodeLength;
    const maxLength = selectedCountry.maxlen - countryCodeLength;

    if (phoneLength < minLength) {
      setValidationError(
        `Phone number must be at least ${minLength} digits long`
      );
    } else if (phoneLength > maxLength) {
      setValidationError(`Phone number cannot exceed ${maxLength} digits`);
    } else {
      setValidationError(undefined);
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (type === "tel" && selectedCountry) {
      validatePhoneNumber(newValue);
    } else if (maxLength && newValue.length > maxLength) {
      return;
    }
    onChange?.(newValue);
  };

  // Handle country selection
  const handleCountrySelect = (code: string) => {
    const newCountry = countryCodes.find((c) => c.code === code);
    if (newCountry && onChange && value) {
      // Truncate the phone number if it exceeds the new country's maxlen
      const countryCodeLength = newCountry.code.replace(/\D/g, "").length;
      const maxLength = newCountry.maxlen - countryCodeLength;
      const digits = value.replace(/\D/g, "");
      if (digits.length > maxLength) {
        onChange(digits.slice(0, maxLength));
      }
    }
    onCountryCodeChange?.(code);
    setShowCountryDropdown(false);
    setSearchTerm("");
    validatePhoneNumber(value); // Re-validate after country change
  };

  // Validate on country code change or value change
  useEffect(() => {
    if (type === "tel") {
      validatePhoneNumber(value);
    }
  }, [value, countryCode, type]);

  const isDateType = [
    "date",
    "datetime-local",
    "month",
    "week",
    "time",
  ].includes(type);
  const isTelType = type === "tel";
  const isDisabled = disabled || (isLoading && disableWhileLoading);
  const showRightContent =
    (withIcon && (iconPosition === "right" || iconPosition === "both")) ||
    (showCharCount && maxLength);

  // Calculate date restrictions
  const getDateRestrictions = () => {
    if (!isDateType || dateRestriction === "none") return {};

    const today = new Date();
    let dateString = "";

    switch (type) {
      case "date":
        dateString = today.toISOString().split("T")[0];
        break;
      case "datetime-local":
        dateString = new Date(
          today.getTime() - today.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16);
        break;
      case "month":
        dateString = today.toISOString().substring(0, 7);
        break;
      case "week":
      case "time":
        return {};
      default:
        return {};
    }

    return dateRestriction === "past"
      ? { max: dateString }
      : { min: dateString };
  };

  const dateRestrictions = getDateRestrictions();
  const showLeftIcon =
    withIcon && (iconPosition === "left" || iconPosition === "both");
  const showRightIcon =
    withIcon && (iconPosition === "right" || iconPosition === "both");

  // Hide native calendar icon styles
  const hideNativePickerIcon: any =
    isDateType && hideNativeCalendarIcon
      ? {
          "::webkitCalendarPickerIndicator": {
            display: "none !important",
            appearance: "none",
            WebkitAppearance: "none",
          },
          "::mozCalendarPickerIndicator": {
            display: "none !important",
          },
        }
      : {};

  // Handle calendar icon click
  const handleCalendarIconClick = () => {
    if (!isDisabled) {
      const input = document.getElementById(inputId) as HTMLInputElement;
      if (input) input.showPicker();
    }
  };

  const filteredCountries = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.includes(searchTerm)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            color: error || validationError ? "#AF1E2E" : "#333",
            fontSize: width > 480 ?"14px":"10px",
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
        style={
          width > 480
            ? {
                display: "flex",
                height: "45px",
                padding: showLeftIcon
                  ? "8px 8px 8px 12px"
                  : "8px 16px 8px 16px",
                alignItems: "center",
                gap: "8px",
                borderRadius: "32px",
                border:
                  error || validationError
                    ? "1px solid #AF1E2E"
                    : "1px solid #D1D1D1",
                background: isDisabled ? "#F5F5F5" : "#FFF",
                position: "relative",
                transition: "border-color 0.2s ease",
                ...(!isDisabled && !readOnly
                  ? {
                      ":hover": {
                        borderColor:
                          error || validationError ? "#AF1E2E" : "#888",
                      },
                    }
                  : {}),
              }
            : {
                display: "flex",
                height: "35px",
                padding: showLeftIcon
                  ? "8px 8px 8px 12px"
                  : "8px 16px 8px 16px",
                alignItems: "center",
                gap: "8px",
                borderRadius: "24px",
                border:
                  error || validationError
                    ? "1px solid #AF1E2E"
                    : "1px solid #D1D1D1",
                background: isDisabled ? "#F5F5F5" : "#FFF",
                position: "relative",
                transition: "border-color 0.2s ease",
                ...(!isDisabled && !readOnly
                  ? {
                      ":hover": {
                        borderColor:
                          error || validationError ? "#AF1E2E" : "#888",
                      },
                    }
                  : {}),
              }
        }
      >
        {showLeftIcon && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: error || validationError ? "#AF1E2E" : "#888",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}

        {isTelType && onCountryCodeChange && (
          <div style={{ position: "relative" }} ref={countryDropdownRef}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.5 : 1,
                padding: "4px 8px",
                borderRadius: "4px",
                backgroundColor: showCountryDropdown
                  ? "#f5f5f5"
                  : "transparent",
              }}
              onClick={() =>
                !isDisabled && setShowCountryDropdown(!showCountryDropdown)
              }
            >
              {selectedCountry && (
                <>
                  <CountryFlag code={selectedCountry.iso} />
                  <span
                    style={{
                      fontSize: width > 480 ? "16px" : "14px",
                      color: isDisabled
                        ? "#888"
                        : error || validationError
                        ? "#AF1E2E"
                        : "#333",
                    }}
                  >
                    {selectedCountry.code}
                  </span>
                </>
              )}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  transform: showCountryDropdown
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              >
                <path
                  d="M19 9L12 16L5 9"
                  stroke={
                    isDisabled
                      ? "#888"
                      : error || validationError
                      ? "#AF1E2E"
                      : "#333"
                  }
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {showCountryDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "300px",
                  maxHeight: "300px",
                  backgroundColor: "#FFF",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  zIndex: 1000,
                  overflow: "hidden",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <SearchIcon color="#888" size={16} />
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      border: "none",
                      outline: "none",
                      width: "100%",
                      fontSize: width > 480 ? "16px" : "14px",
                    }}
                    autoFocus
                  />
                </div>
                <div
                  style={{
                    maxHeight: "250px",
                    overflowY: "auto",
                  }}
                >
                  {filteredCountries.map((country) => (
                    <div
                      key={`${country.code}-${country.name}`}
                      style={{
                        padding: "10px 16px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        backgroundColor:
                          country.code === countryCode
                            ? "#f5f5f5"
                            : "transparent",
                      }}
                      onClick={() => handleCountrySelect(country.code)}
                    >
                      <CountryFlag code={country.iso} />
                      <span style={{ fontWeight: 500, minWidth: "50px" }}>
                        {country.code}
                      </span>
                      <span style={{ color: "#666" }}>{country.name}</span>
                    </div>
                  ))}
                  {filteredCountries.length === 0 && (
                    <div
                      style={{
                        padding: "16px",
                        textAlign: "center",
                        color: "#888",
                      }}
                    >
                      No countries found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <input
          id={inputId}
          type={type}
          placeholder={isDateType ? undefined : placeholder}
          value={value}
          onChange={handleChange}
          readOnly={readOnly || isLoading}
          disabled={isDisabled}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "inherit",
            fontSize: width > 480 ? "16px" : "12px",
            color: isDisabled
              ? "#888"
              : error || validationError
              ? "#AF1E2E"
              : "#333",
            cursor: isDisabled ? "not-allowed" : "text",
            paddingRight:
              isLoading ||
              showRightContent ||
              (isDateType && hideNativeCalendarIcon)
                ? "32px"
                : "0",
            minWidth: 0,
            ...(isDateType
              ? {
                  appearance: "none",
                  WebkitAppearance: "none",
                  colorScheme: "light",
                }
              : {}),
            ...hideNativePickerIcon,
            ...inputStyle,
          }}
          maxLength={
            type === "tel" && selectedCountry
              ? selectedCountry.maxlen -
                selectedCountry.code.replace(/\D/g, "").length
              : maxLength
          }
          min={minDate || dateRestrictions.min}
          max={maxDate || dateRestrictions.max}
          autoFocus={autoFocus}
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
            <Spinner size={16} />
          </div>
        )}

        {!isLoading && showRightIcon && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: error || validationError ? "#AF1E2E" : "#888",
              flexShrink: 0,
            }}
          >
            {iconPosition === "both" ? rightIcon : icon}
          </div>
        )}

        {!isLoading && isDateType && hideNativeCalendarIcon && (
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
            onClick={handleCalendarIconClick}
          >
            {customCalendarIcon || (
              <CalendarIcon
                color={error || validationError ? "#AF1E2E" : iconColor}
              />
            )}
          </div>
        )}

        {!isLoading && showCharCount && maxLength && !isDateType && (
          <span
            style={{
              fontSize: "12px",
              color: error || validationError ? "#AF1E2E" : "#888",
              whiteSpace: "nowrap",
              marginLeft: "4px",
              flexShrink: 0,
            }}
          >
            {value?.length || 0}/{maxLength}
          </span>
        )}
      </div>

      {(helperText ||
        validationError ||
        (maxLength && showCharCount && !isLoading && !isDateType)) && (
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
          {(helperText || validationError) && (
            <span
              style={{
                color: error || validationError ? "#AF1E2E" : "#888",
                fontSize: "12px",
                flex: 1,
              }}
            >
              {validationError || helperText}
            </span>
          )}

          {!helperText &&
            !validationError &&
            maxLength &&
            showCharCount &&
            !isLoading &&
            !isDateType && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#888",
                  marginLeft: "auto",
                }}
              >
                {value?.length || 0}/{maxLength}
              </span>
            )}
        </div>
      )}
    </div>
  );
};

export default TextField;

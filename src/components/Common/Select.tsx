import React, { useState, useRef, useEffect } from "react";
import { CSSProperties } from "react";

// Chevron Icons
const ChevronDownIcon = ({
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
      d="M19 9L12 16L5 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronUpIcon = ({
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
      d="M5 15L12 8L19 15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Spinner Component (for loading state)
const Spinner = ({ size = 16 }: { size?: number }) => (
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

interface SelectProps {
  heading?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
  style?: CSSProperties;
  selectStyle?: CSSProperties;
  readOnly?: boolean;
  disabled?: boolean;
  withIcon?: boolean;
  iconPosition?: "left" | "right";
  icon?: React.ReactNode;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  autoFocus?: boolean;
  onBlur?: () => void;
  isLoading?: boolean;
  disableWhileLoading?: boolean;
  iconColor?: string;
  customDropdownIcon?: React.ReactNode;
  inputId?: string;
}

const Select: React.FC<SelectProps> = ({
  heading,
  placeholder = "Select an option",
  value = "",
  onChange,
  options = [],
  style,
  selectStyle,
  readOnly = false,
  disabled = false,
  withIcon = false,
  iconPosition = "left",
  icon,
  error = false,
  helperText,
  required = false,
  autoFocus = false,
  onBlur,
  isLoading = false,
  disableWhileLoading = true,
  iconColor = "#AF1E2E",
  customDropdownIcon,
  inputId = `select-field-${Math.random().toString(36).substr(2, 9)}`,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

  const isDisabled = disabled || (isLoading && disableWhileLoading);
  const showLeftIcon = withIcon && iconPosition === "left";

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
      ref={selectRef}
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
          padding: showLeftIcon ? "8px 8px 8px 12px" : "8px 16px 8px 16px",
          alignItems: "center",
          gap: "8px",
          borderRadius: "32px",
          border: error ? "1px solid #AF1E2E" : "1px solid #D1D1D1",
          background: isDisabled ? "#F5F5F5" : "#FFF",
          cursor: isDisabled ? "not-allowed" : "pointer",
          transition: "border-color 0.2s ease",
          ...(!isDisabled && !readOnly
            ? { ":hover": { borderColor: error ? "#AF1E2E" : "#888" } }
            : {}),
          ...selectStyle,
        }}
        onClick={() => !isDisabled && !readOnly && setIsOpen(!isOpen)}
      >
        {showLeftIcon && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: error ? "#AF1E2E" : "#888",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}

        <div
          style={{
            flex: 1,
            fontFamily: "inherit",
            fontSize: "16px",
            color: isDisabled ? "#888" : error ? "#AF1E2E" : value ? "#333" : "#888",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {selectedLabel}
        </div>

        {isLoading ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Spinner size={16} />
          </div>
        ) : (
          <div style={{ color: error ? "#AF1E2E" : "#888" }}>
            {customDropdownIcon || (isOpen ? (
              <ChevronUpIcon color={error ? "#AF1E2E" : iconColor} size={16} />
            ) : (
              <ChevronDownIcon color={error ? "#AF1E2E" : iconColor} size={16} />
            ))}
          </div>
        )}
      </div>

      {/* Custom Dropdown Options */}
      {isOpen && !isDisabled && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            backgroundColor: "#FFF",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                // backgroundColor: value === option.value ? "#F5F5F5" : "transparent",
                // ":hover": {
                //   backgroundColor: "#F5F5F5",
                // },
              }}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
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

export default Select;
import React from "react";
import { CSSProperties } from "react";

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: CSSProperties;
  labelStyle?: CSSProperties;
  checkboxStyle?: CSSProperties;
  className?: string;
  id?: string;
  indeterminate?: boolean;
  required?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  style,
  labelStyle,
  checkboxStyle,
  className = "",
  id = `checkbox-${Math.random().toString(36).substr(2, 9)}`,
  indeterminate = false,
  required = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div
      className={`checkbox-container ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "16px",
          height: "16px",
        }}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          ref={(el) => {
            if (el) {
              el.indeterminate = indeterminate;
            }
          }}
          style={{
            position: "absolute",
            opacity: 0,
            width: "100%",
            height: "100%",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
          className="checkbox-input"
        />
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "4px",
            border: checked 
              ? "1px solid #AF1E2E" 
              : "1px solid #D0D5DD",
            backgroundColor: checked 
              ? "#AF1E2E" 
              : "#FFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            ...checkboxStyle,
          }}
        >
          {checked && (
            <svg
              width="10"
              height="8"
              viewBox="0 0 10 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 4L4 7L9 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {indeterminate && !checked && (
            <div
              style={{
                width: "8px",
                height: "2px",
                backgroundColor: "#AF1E2E",
                borderRadius: "1px",
              }}
            />
          )}
        </div>
      </div>
      {label && (
        <label
          htmlFor={id}
          style={{
            color: disabled ? "#888" : "#333",
            fontSize: "14px",
            cursor: disabled ? "not-allowed" : "pointer",
            ...labelStyle,
          }}
          className="checkbox-label"
        >
          {label}
          {required && (
            <span style={{ color: "#AF1E2E", marginLeft: "4px" }}>*</span>
          )}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
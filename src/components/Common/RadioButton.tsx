import React from "react";
import { CSSProperties } from "react";

interface RadioOption {
  label: string;
  value: string;
}

interface RadioButtonProps {
  options: RadioOption[];
  selectedValue?: string;
  onChange: (value: string) => void;
  direction?: "horizontal" | "vertical";
  gap?: number;
  label?: string;
  error?: boolean;
  required?: boolean;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  options,
  selectedValue,
  onChange,
  direction = "horizontal",
  gap = 16,
  label,
  error = false,
  required = false,
}) => {
  // Container style
  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: direction === "horizontal" ? "row" : "column",
    gap: `${gap}px`,
    flexWrap: "wrap",
  };

  // Label styling to match TextField
  const labelStyle: CSSProperties = {
    color: error ? "#AF1E2E" : "#333",
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "normal",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginBottom: "8px",
  };

  // Base option style
  const getOptionStyle = (isSelected: boolean): CSSProperties => ({
    display: "flex",
    height: "32px",
    padding: "0px 16px",
    alignItems: "center",
    gap: "8px",
    borderRadius: "26px",
    border: `1px solid ${isSelected ? "#AF1E2E" : "#D0D5DD"}`,
    background: isSelected ? "#AF1E2E" : "#FFF",
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  // Selected text style
  const selectedTextStyle: CSSProperties = {
    color: "#FFF",
    fontSize: "14px",
    fontWeight: 500,
  };

  // Unselected text style
  const unselectedTextStyle: CSSProperties = {
    color: "#344054",
    fontSize: "14px",
    fontWeight: 500,
  };

  return (
    <div>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && (
            <span style={{ color: "#AF1E2E", fontSize: "12px" }}>*</span>
          )}
        </label>
      )}
      <div style={containerStyle}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <div
              key={option.value}
              style={getOptionStyle(isSelected)}
              onClick={() => onChange(option.value)}
            >
              <span style={isSelected ? selectedTextStyle : unselectedTextStyle}>
                {option.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RadioButton;
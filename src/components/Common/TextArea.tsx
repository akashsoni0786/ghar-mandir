import React from "react";
import { CSSProperties } from "react";

interface TextAreaProps {
  heading?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  readOnly?: boolean;
  disabled?: boolean;
  withIcon?: boolean;
  iconPosition?: "left" | "right";
  icon?: React.ReactNode;
  error?: boolean;
  helperText?: string;
  maxLength?: number;
  showCharCount?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  onBlur?: () => void;
  isLoading?: boolean;
  disableWhileLoading?: boolean;
  rows?: number;
  resize?: "none" | "both" | "horizontal" | "vertical";
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

const TextArea: React.FC<TextAreaProps> = ({
  heading,
  placeholder = "",
  value = "",
  onChange,
  style,
  inputStyle,
  readOnly = false,
  disabled = false,
  withIcon = false,
  iconPosition = "left",
  icon,
  error = false,
  helperText,
  maxLength,
  showCharCount = false,
  required = false,
  autoFocus = false,
  onBlur,
  isLoading = false,
  disableWhileLoading = true,
  rows = 3,
  resize = "vertical",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (maxLength && e.target.value.length > maxLength) return;
    onChange?.(e.target.value);
  };

  const isDisabled = disabled || (isLoading && disableWhileLoading);
  const showRightContent = (withIcon && iconPosition === "right") || (showCharCount && maxLength);

  return (
    <div
      style={{
        display: "flex", 
        flexDirection: "column", 
        gap: "4px",
        width: "100%",
        ...style 
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
          flexDirection: "column",
          position: "relative",
          borderRadius: "12px",
          border: error ? "1px solid #AF1E2E" : "1px solid #D1D1D1",
          background: isDisabled ? "#F5F5F5" : "#FFF",
          transition: "border-color 0.2s ease",
          ...(!isDisabled && !readOnly ? { ':hover': { borderColor: error ? "#AF1E2E" : "#888" } } : {}),
        }}
      >
        {withIcon && iconPosition === "left" && (
          <div style={{ 
            position: "absolute",
            left: "12px",
            top: "12px",
            display: "flex", 
            alignItems: "center",
            color: error ? "#AF1E2E" : "#888",
            zIndex: 1,
          }}>
            {icon}
          </div>
        )}
        
        <textarea
          placeholder={placeholder}
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
            fontSize: "16px",
            color: isDisabled ? "#888" : error ? "#AF1E2E" : "#333",
            cursor: isDisabled ? "not-allowed" : "text",
            padding: "12px",
            paddingLeft: withIcon && iconPosition === "left" ? "40px" : "12px",
            paddingRight: isLoading || showRightContent ? "40px" : "12px",
            minWidth: 0,
            minHeight: `${rows * 24}px`,
            resize: resize,
            ...inputStyle,
          }}
          maxLength={maxLength}
          autoFocus={autoFocus}
          onBlur={onBlur}
          rows={rows}
        />
        
        {isLoading && (
          <div style={{
            position: "absolute",
            right: "12px",
            bottom: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Spinner size={16} />
          </div>
        )}

        {!isLoading && withIcon && iconPosition === "right" && (
          <div style={{ 
            position: "absolute",
            right: "12px",
            top: "12px",
            display: "flex", 
            alignItems: "center",
            color: error ? "#AF1E2E" : "#888",
          }}>
            {icon}
          </div>
        )}
        
        {!isLoading && showCharCount && maxLength && (
          <div style={{ 
            position: "absolute",
            right: "12px",
            bottom: "8px",
            fontSize: "12px", 
            color: error ? "#AF1E2E" : "#888",
            background: "rgba(255,255,255,0.7)",
            padding: "2px 4px",
            borderRadius: "4px",
          }}>
            {value?.length || 0}/{maxLength}
          </div>
        )}
      </div>
      
      {helperText && (
        <div style={{ 
          marginTop: "2px",
          marginLeft: "12px",
        }}>
          <span style={{ 
            color: error ? "#AF1E2E" : "#888", 
            fontSize: "12px",
          }}>
            {helperText}
          </span>
        </div>
      )}
    </div>
  );
};

export default TextArea;
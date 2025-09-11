import React from "react";
import "./AlertBox.css";

const AlertBox = ({
  type = "info",
  title,
  message,
  children,
  closable = false,
  onClose,
  className = "",
  ...props
}: any) => {
  const handleClose = (e: any) => {
    e.preventDefault();
    onClose && onClose();
  };

  return (
    <div className={`alert alert-${type} ${className}`} role="alert" {...props}>
      <div className="alert-content">
        {title && <h4 className="alert-title">{title}</h4>}
        <div className="alert-message">{message || children}</div>
      </div>
      {closable && (
        <button className="alert-close" onClick={handleClose}>
          &times;
        </button>
      )}
    </div>
  );
};

export default AlertBox;

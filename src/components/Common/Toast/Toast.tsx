// components/Toast/Toast.tsx
import React, { useEffect } from "react";
import { X } from "react-feather";

export type ToastType = "error" | "warn" | "success" | "info";

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type,
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warn":
        return "⚠";
      case "info":
        return "i";
      default:
        return "";
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={() => onClose(id)}>
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;

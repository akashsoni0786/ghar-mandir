import React from "react";
import Toast, { ToastType } from "./Toast";
import './Toast.css'
export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}
const ToastContainer: React.FC<{
  toasts: ToastItem[];
  onClose: (id: string) => void;
}> = ({ toasts, onClose }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export default ToastContainer;

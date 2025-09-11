import { X } from "react-feather";
import { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "error";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  onClose?: () => void;
  className?: string;
  showClose?: boolean;
  onClick?: () => void;
  size?: string;
}

const Badge = ({
  children,
  variant = "default",
  onClose,
  className = "",
  showClose,
  onClick,
  size='' // can be 'small'
}: BadgeProps) => {
  return (
    <div
      onClick={onClick}
      className={`badge ${size} badge--${variant} ${className}`}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <span className="badge__content">{children}</span>
      {showClose && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the badge's onClick
            onClose?.();
          }}
          className="badge__close-button"
          aria-label="Remove badge"
        >
          <X size={14} />
        </button>
      )}
      <style>{`
        .badge {
          display: inline-flex;
          height: 32px;
          padding: 4px 12px;
          align-items: center;
          gap: 6px;
          border-radius: 24px;
          border: 1px solid;
          background: #fff;
          font-size: 14px;
          line-height: 1;
          width: max-content;
        }
        

        .badge__content {
          white-space: nowrap;
        }
        .small {
          height: 24px;
          padding: 2px 8px;
          gap: 3px;
          border-radius: 18px;
          font-size:11px;
        }

        .badge__close-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          margin-left: 2px;
          margin-right: -4px;
          border: none;
          background: none;
          cursor: pointer;
          border-radius: 50%;
          transition: background-color 0.2s ease;
        }

        .badge__close-button:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }

        .badge__close-button:active {
          background-color: rgba(0, 0, 0, 0.2);
        }

        .badge--default {
          border-color: #999;
          background-color: #f8f8f8;
          color: #666;
        }

        .badge--success {
          border-color: #5ba61a;
          background-color: #f5faf0;
          color: #5ba61a;
        }

        .badge--warning {
          border-color: #e6a700;
          background-color: #fff9e6;
          color: #b38600;
        }

        .badge--error {
          border-color: #d93c3c;
          background-color: #fdf0f0;
          color: #d93c3c;
        }`}</style>
    </div>
  );
};

export default Badge;

import useWindow from "@/customHooks/useWindows";
import React, { useState, useEffect, useRef } from "react";

type ButtonSize = "small" | "medium" | "large";
type ButtonVariant = "contained" | "outlined" | "text";
type IconCarouselMode = "none" | "start" | "end";

interface BaseButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
  style?: React.CSSProperties;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  color?: "primary" | "secondary" | "default";
  isLoading?: boolean;
  disableWhileLoading?: boolean;
  iconCarousel?: IconCarouselMode;
  carouselIcons?: React.ReactNode[];
  carouselSpeed?: number;
}

interface DarkButtonProps extends BaseButtonProps {
  dark?: boolean;
}

interface LightButtonProps extends BaseButtonProps {
  light?: boolean;
}

const LoadingSpinner = ({ size }: { size: ButtonSize }) => {
  const spinnerSize = {
    small: "12px",
    medium: "16px",
    large: "20px",
  };

  return (
    <div
      className="button__spinner"
      style={{
        width: spinnerSize[size],
        height: spinnerSize[size],
        border: `2px solid rgba(255, 255, 255, 0.3)`,
        borderTop: `2px solid white`,
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
  );
};

const IconCarousel = ({
  icons,
  speed = 2000,
  size,
}: {
  icons: React.ReactNode[];
  speed?: number;
  size: ButtonSize;
}) => {
  const { width } = useWindow();
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const iconSize = {
    small: width > 480 ? "14px" : "12px",
    medium: width > 480 ? "18px" : "16px",
    large: width > 480 ? "22px" : "18px",
  };

  useEffect(() => {
    if (icons.length > 1) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % icons.length);
      }, speed);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [icons.length, speed]);

  if (icons.length === 0) return null;

  return (
    <div
      className="button__icon-carousel"
      style={{
        width: iconSize[size],
        height: iconSize[size],
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="button__icon-carousel-inner"
        style={{
          display: "flex",
          width: `${icons.length * 100}%`,
          height: "100%",
          transform: `translateX(-${activeIndex * (100 / icons.length)}%)`,
          transition: "transform 500ms ease-in-out",
        }}
      >
        {icons.map((icon, index) => (
          <div
            key={index}
            style={{
              width: `${100 / icons.length}%`,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Button = ({
  children,
  onClick,
  disabled = false,
  size = "medium",
  variant = "contained",
  className = "",
  style,
  type = "button",
  fullWidth = false,
  startIcon,
  endIcon,
  dark,
  light,
  color = "primary",
  isLoading = false,
  disableWhileLoading = true,
  iconCarousel = "none",
  carouselIcons = [],
  carouselSpeed = 10000,
  ...rest
}: DarkButtonProps & LightButtonProps) => {
  const buttonClass = [
    "button",
    `button--${size}`,
    `button--${variant}`,
    `button--${color}`,
    dark ? "button--dark" : "",
    light ? "button--light" : "",
    fullWidth ? "button--fullWidth" : "",
    disabled || (isLoading && disableWhileLoading) ? "button--disabled" : "",
    isLoading ? "button--loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  // Determine which icon to show based on carousel mode
  const shouldShowStartCarousel = iconCarousel === "start" && carouselIcons.length > 0;
  const shouldShowEndCarousel = iconCarousel === "end" && carouselIcons.length > 0;
  const shouldShowStartIcon = !shouldShowStartCarousel && startIcon;
  const shouldShowEndIcon = !shouldShowEndCarousel && endIcon;

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || (isLoading && disableWhileLoading)}
      type={type}
      style={style}
      {...rest}
    >
      {isLoading ? (
        <LoadingSpinner size={size} />
      ) : (
        <>
          {shouldShowStartCarousel && (
            <IconCarousel icons={carouselIcons} speed={carouselSpeed} size={size} />
          )}
          {shouldShowStartIcon && (
            <span className="button__icon--start">{startIcon}</span>
          )}
          <span className="button__content">{children}</span>
          {shouldShowEndIcon && (
            <span className="button__icon--end">{endIcon}</span>
          )}
          {shouldShowEndCarousel && (
            <IconCarousel icons={carouselIcons} speed={carouselSpeed} size={size} />
          )}
        </>
      )}
    </button>
  );
};

// Your existing specific button variants remain the same
export const DarkBgButton = (props: DarkButtonProps) => (
  <Button dark variant="contained" fullWidth={false} {...props} />
);

export const DarkBgButtonFw = (props: DarkButtonProps) => (
  <Button dark variant="contained" fullWidth {...props} />
);

export const LightBgButton = (props: LightButtonProps) => (
  <Button variant="outlined" {...props} />
);

export const LightBgButtonBr = (props: LightButtonProps) => (
  <Button light variant="outlined" fullWidth {...props} />
);

export const TextButton = (props: BaseButtonProps) => (
  <Button variant="text" color="primary" {...props} />
);

// Example usage with carousel:
export const CarouselButton = ({
  carouselPosition = "start",
  carouselIcons,
  ...props
}: BaseButtonProps & {
  carouselPosition?: IconCarouselMode;
  carouselIcons: React.ReactNode[];
}) => (
  <Button
    iconCarousel={carouselPosition}
    carouselIcons={carouselIcons}
    {...props}
  />
);
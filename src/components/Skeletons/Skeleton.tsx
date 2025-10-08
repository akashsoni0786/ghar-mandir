import "./Skeleton.css";

type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  className?: string;
  bgColor?: string; // NEW
};

export const SkeletonLine = ({
  width = "100%",
  height = "1rem",
  className,
  bgColor, // NEW
}: SkeletonProps) => {
  return (
    <div
      className={`skeletonLine ${className || ""}`}
      style={{
        width,
        height,
        ...(bgColor && {
          background: bgColor,
          backgroundSize: "200% 100%",
          animation: "loading 1.5s infinite",
        }), // override gradient
      }}
    ></div>
  );
};

export const SkeletonParagraph = ({
  lines = 3,
  lineHeight = "1rem",
  spacing = "0.5rem",
  className,
  bgColor, // NEW
}: {
  lines?: number;
  lineHeight?: string | number;
  spacing?: string | number;
  className?: string;
  bgColor?: string;
}) => {
  return (
    <div
      className={`skeletonParagraph ${className || ""}`}
      style={{ display: "flex", flexDirection: "column", gap: spacing }}
    >
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonLine
          key={index}
          height={lineHeight}
          width={index === lines - 1 ? "80%" : "100%"}
          bgColor={bgColor} // pass it down
        />
      ))}
    </div>
  );
};

export const SkeletonAvatar = ({
  size = "3rem",
  className,
  bgColor, // NEW
}: {
  size?: string | number;
  className?: string;
  bgColor?: string;
}) => {
  return (
    <div
      className={`skeletonAvatar ${className || ""}`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        ...(bgColor && {
          background: bgColor,
          backgroundSize: "200% 100%",
          animation: "loading 1.5s infinite",
        }),
      }}
    ></div>
  );
};

export const SkeletonBox = ({
  width = "100%",
  height = "200px",
  className,
  bgColor, // NEW
}: SkeletonProps) => {
  return (
    <div
      className={`skeletonBox ${className || ""}`}
      style={{
        width,
        height,
        ...(bgColor && {
          background: bgColor,
          backgroundSize: "200% 100%",
          animation: "loading 1.5s infinite",
        }),
      }}
    ></div>
  );
};

export const SkeletonCard = ({
  children,
  width,
  height = "auto",
  className,
  bgColor, // NEW
}: {
  children?: React.ReactNode;
  width?: string | number;
  height?: string | number;
  className?: string;
  bgColor?: string;
}) => {
  return (
    <div
      className={`skeletonCard ${className || ""}`}
      style={{
        width,
        height,
        ...(bgColor && {
          background: bgColor,
          backgroundSize: "200% 100%",
          animation: "loading 1.5s infinite",
        }),
      }}
    >
      {children}
    </div>
  );
};

export const Skeleton = {
  Line: SkeletonLine,
  Paragraph: SkeletonParagraph,
  Avatar: SkeletonAvatar,
  Box: SkeletonBox,
  Card: SkeletonCard,
};

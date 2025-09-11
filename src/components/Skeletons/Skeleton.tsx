import "./Skeleton.css";

type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  className?: string;
};

export const SkeletonLine = ({
  width = "100%",
  height = "1rem",
  className,
}: SkeletonProps) => {
  const style = className ? {} : { width, height };
  return <div className={`skeletonLine ${className || ""}`} style={style}></div>;
};

export const SkeletonParagraph = ({
  lines = 3,
  lineHeight = "1rem",
  spacing = "0.5rem",
  className,
}: {
  lines?: number;
  lineHeight?: string | number;
  spacing?: string | number;
  className?: string;
}) => {
  return (
    <div className={`skeletonParagraph ${className || ""}`} style={{ gap: spacing }}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonLine
          key={index}
          height={lineHeight}
          width={index === lines - 1 ? "80%" : "100%"}
        />
      ))}
    </div>
  );
};

export const SkeletonAvatar = ({
  size = "3rem",
  className,
}: {
  size?: string | number;
  className?: string;
}) => {
  const style = className ? {} : { width: size, height: size };
  return <div className={`skeletonAvatar ${className || ""}`} style={style}></div>;
};

export const SkeletonBox = ({
  width = "100%",
  height = "200px",
  className,
}: SkeletonProps) => {
  const style = className ? {} : { width, height };
  return <div className={`skeletonBox ${className || ""}`} style={style}></div>;
};

export const SkeletonCard = ({
  children,
  width = "300px",
  height = "auto",
  className,
}: {
  children?: React.ReactNode;
  width?: string | number;
  height?: string | number;
  className?: string;
}) => {
  const style = className ? {} : { width, height };
  return (
    <div className={`skeletonCard ${className || ""}`} style={style}>
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

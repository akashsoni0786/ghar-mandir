import "./Loading.css";
type ButtonSize = "small" | "medium" | "large";
export const Spinner = ({ size }: { size: ButtonSize }) => {
  const spinnerSize = {
    small: "12px",
    medium: "16px",
    large: "20px",
  };

  return (
    <div
  style={{
    width: spinnerSize[size],
    height: spinnerSize[size],
    borderRadius: "50%",
    background: `
      conic-gradient(
        from 0deg,
        rgb(200 46 63) 0%,
        #dc7c7c 30%,
        #c5c5c5 55%,
        #c5c5c5 70%,
        transparent 100%
      )
    `,
    mask: "radial-gradient(transparent 50%, black 51%)", // Creates the ring effect
    animation: "spin 1s linear infinite",
    display: "inline-block",
    boxSizing: "border-box",
  }}
/>
  );
};

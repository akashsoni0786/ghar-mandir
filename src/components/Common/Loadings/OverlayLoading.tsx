import LoadingSpinner from "./LoadingSpinner";
import "./Loading.css";
const OverlayLoading = () => {
  return (
    <div className="loading-overlay">
      <LoadingSpinner />
    </div>
  );
};
export default OverlayLoading;

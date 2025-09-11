import React from "react";
import "./Card.css";
import { ChevronDown, ChevronRight, ChevronUp } from "react-feather";
import useWindow from "@/customHooks/useWindows";
// Define the Props interface
interface Props {
  imageSrc: string;
  title: string;
  subtitle: string;
  description: string;
}

const DetailPanditCard = ({
  imageSrc,
  title,
  subtitle,
  description,
}: Props) => {
  const { width } = useWindow();
  const [showDetails, setShowDetails] = React.useState(false);
  return (
    <div className="detailedCard-container">
      {/* Image*/}
      <div className="detailedCard-image-container">
        <img src={imageSrc} alt="Card image" className="detailedCard-image" />
      </div>
      <div className="detailedCard-data-container">
        {/* Title */}
        <h3 className="detailedCard-title">{title}</h3>

        {/* Subtitle */}
        <p className="detailedCard-subtitle">{subtitle}</p>

        {/* Description */}
        <div
          className="detailedCard-viewDetails"
          onClick={() => setShowDetails(!showDetails)}
        >
          <p className="detailedCard-viewDetails-txt">View Details </p>
          <span>
            {showDetails ? (
              <ChevronDown size={12} color="#AF1E2E" />
            ) : (
              <ChevronRight size={12} color="#AF1E2E" />
            )}
          </span>
        </div>
        {(showDetails || width > 480) && (
          <p className="detailedCard-description">{description}</p>
        )}
      </div>
    </div>
  );
};

export default DetailPanditCard;

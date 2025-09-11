import React from "react";
import "./Card.css"; // Import the CSS file for styling
// Define the Props interface
interface Props {
  imageSrc: string;
  title: string;
  subtitle: string;
  description: string;
}

const PanditDataCard = ({ imageSrc, title, subtitle, description }: Props) => {
  return (
    <div className="panditcard-container">
      {/* Image*/}
      <div className="panditcard-image-container">
        <img
          src={imageSrc}
          alt="Card image"
          width={56}
          height={56}
          className="panditcard-image"
        />
      </div>
      <div>
        {/* Title */}
        <h3 className="panditcard-title">{title}</h3>

        {/* Subtitle */}
        <p className="panditcard-subtitle">{subtitle}</p>
      </div>
      {/* Description */}
      <p className="panditcard-description">{description}</p>
    </div>
  );
};

export default PanditDataCard;

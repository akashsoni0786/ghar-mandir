"use client";
import React, { useState } from "react";

import Image from "next/image";
import useWindow from "@/customHooks/useWindows";
interface Props {
  aboutTemple: any;
}
const TempleImage = "https://d28wmhrn813hkk.cloudfront.net/uploads/1757600665605-56bdb.webp"; 
const AboutTemple = ({ aboutTemple }: Props) => {
  const width = typeof window !== "undefined" ? useWindow().width : 0;
  const [showmore, setShowmore] = useState(false);
  const handleReadToggle = () => {
    setShowmore(!showmore);
  };
  const renderDescription = () => {
    return (
      <p
        className="temple-description"
        dangerouslySetInnerHTML={{ __html: aboutTemple?.description || "" }}
      />
    );
    // Always show full description on desktop
    if (width > 768) {
      return <p className="temple-description">{aboutTemple?.description}</p>;
    }

    // Mobile/tablet view with truncation
    if (width <= 768) {
      const showFullText = showmore || aboutTemple?.description?.length <= 200;

      return (
        <p className="temple-description">
          {showFullText
            ? aboutTemple?.description
            : `${aboutTemple?.description.slice(0, 200)}...`}
          {aboutTemple?.description?.length > 200 && (
            <span className="read-more" onClick={handleReadToggle}>
              {showFullText ? " Show Less" : " Read More"}
            </span>
          )}
        </p>
      );
    }

    // Fallback (shouldn't reach here)
    return (
      <p className="temple-description">{aboutTemple?.description ?? ""}</p>
    );
  };
  return (
    <section className="about-temple">
      <div className="about-temple-container">
        <div className="about-temple-content">
          <div className="temple-image-container">
            {aboutTemple?.templeImage && aboutTemple?.templeImage != "" ? (
              <img
                src={aboutTemple?.templeImage}
                alt="Shri Omkareshwar Jyotirlinga Temple"
                className="temple-image"
              />
            ) : (
              <Image
                src={TempleImage}
                alt="Shri Omkareshwar Jyotirlinga Temple"
                className="temple-image"
              />
            )}
          </div>

          <div className="temple-text-content">
            <h2 className="temple-name">
              {aboutTemple?.title ?? "Temple details"}
            </h2>

            {renderDescription()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTemple;

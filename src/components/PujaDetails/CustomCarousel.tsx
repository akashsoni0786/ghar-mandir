import { useState, useEffect } from "react";
import Image from "next/image";
import Krishna from "../../assets/images/card-img_5.png";
import Vishnu from "../../assets/images/card-img_6.png";
const CustomCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = [
    { id: 1, src: Krishna, alt: "Slide 1" },
    { id: 2, src: Vishnu, alt: "Slide 2" },
    { id: 3, src: Krishna, alt: "Slide 3" },
    { id: 4, src: Vishnu, alt: "Slide 4" },
  ];

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`carousel-item ${index === activeIndex ? "active" : ""}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="carousel-image"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="carousel-control prev"
        onClick={goToPrev}
      >
        <span className="control-icon">
          <svg className="control-svg" viewBox="0 0 6 10">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>

      <button
        type="button"
        className="carousel-control next"
        onClick={goToNext}
      >
        <span className="control-icon">
          <svg className="control-svg" viewBox="0 0 6 10">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default CustomCarousel;

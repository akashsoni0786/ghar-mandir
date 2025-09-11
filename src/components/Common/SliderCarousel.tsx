import { ChevronIcon } from "@/assets/svgs";
import { useEffect, useState } from "react";
import useWindow from "@/customHooks/useWindows";
import Popup from "./Popup";
interface Props {
  images: any;
}
const SliderCarousel = ({ images }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = useWindow();
  const [isZoomed, setIsZoomed] = useState(false);
  const [imgZoomed, setImgZoomed] = useState("");

  // Auto-play logic (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 3000); // Change slide every 3 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentIndex]); // Reset interval when currentIndex changes

  // Go to next slide
  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Go to previous slide
  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return width > 480 ? (
    <div className="pujadetails-carousel">
      {/* For desktop and tab view */}
      <img
        className="pujadetails-carousel-img"
        src={images[currentIndex]}
        alt="Vishnu"
      />
      <div className="pujadetails-carousel-icons">
        {/* Left Chevron (Previous) */}
        <span className="pujadetails-carousel-icon-left" onClick={goToPrev}>
          <ChevronIcon />
        </span>

        {/* Right Chevron (Next) */}
        <span className="pujadetails-carousel-icon-right" onClick={goToNext}>
          <ChevronIcon />
        </span>
      </div>

      {/* Optional: Dots indicator */}
      <div className="pujadetails-carousel-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="mob-slider">
      <div className="pujadetails-carousel">
        {images.map((item, index) => (
          <img
            className="pujadetails-carousel-img-mob"
            src={item}
            alt={index.toString()}
            key={index}
            onClick={() => {
              setImgZoomed(item);
              setIsZoomed(true);
            }}
          />
        ))}
      </div>

      {isZoomed && (
        <Popup
          position="center"
          isEscape={true}
          closeOnOutsideClick={true}
          onClose={() => setIsZoomed(false)}
          showCloseButton={false}
        >
          <img src={imgZoomed} alt={imgZoomed} />
        </Popup>
      )}
    </div>
  );
};

export default SliderCarousel;

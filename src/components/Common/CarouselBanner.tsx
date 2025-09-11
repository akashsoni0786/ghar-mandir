import { useEffect, useState, useRef } from "react";

const CarouselBanner = ({ itemList }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isScrolling = useRef(false);
  const isManualScroll = useRef(false);

  // Create extended array for seamless looping
  const extendedItems = [...itemList, ...itemList, ...itemList];
  const middleIndex = itemList.length; // Start in the middle segment

  // Center the active image
  const centerActiveImage = (index: number, immediate = false) => {
    if (carouselRef.current && imageRefs.current[index]) {
      isScrolling.current = true;
      const container = carouselRef.current;
      const activeImage = imageRefs.current[index] as HTMLDivElement;
      const containerWidth = container.offsetWidth;
      const imageWidth = activeImage.offsetWidth;
      const scrollLeft = activeImage.offsetLeft - (containerWidth / 2 - imageWidth / 2);

      container.scrollTo({
        left: scrollLeft,
        behavior: immediate ? "auto" : "smooth",
      });

      // Reset scrolling flag after animation completes
      setTimeout(() => {
        isScrolling.current = false;
      }, immediate ? 0 : 500);
    }
  };

  // Auto-scroll every 3 seconds when not hovered/touched
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isScrolling.current && !isManualScroll.current && !isHovered) {
        const nextIndex = activeIndex + 1;
        setActiveIndex(nextIndex);
        centerActiveImage(nextIndex + middleIndex);
        
        // If we're at the end of the extended array, reset to middle segment
        if (nextIndex >= itemList.length) {
          setTimeout(() => {
            setActiveIndex(0);
            centerActiveImage(middleIndex, true);
          }, 500);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex, itemList.length, middleIndex, isHovered]);

  // Initialize to center position
  useEffect(() => {
    if (carouselRef.current) {
      centerActiveImage(middleIndex, true);
    }
  }, [middleIndex]);

  // Handle manual scroll
  const handleScroll = () => {
    if (isScrolling.current || !carouselRef.current) return;
    
    isManualScroll.current = true;
    const container = carouselRef.current;
    const containerWidth = container.offsetWidth;
    const scrollPosition = container.scrollLeft + containerWidth / 2;
    
    // Find which image is closest to center
    let closestIndex = 0;
    let minDistance = Infinity;

    imageRefs.current.forEach((img, index) => {
      if (img) {
        const distance = Math.abs(
          img.offsetLeft + img.offsetWidth / 2 - scrollPosition
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      }
    });

    // Calculate the "virtual" index in the original itemList
    const virtualIndex = (closestIndex - middleIndex + itemList.length) % itemList.length;
    setActiveIndex(virtualIndex);

    // Check if we need to jump to the middle segment
    if (closestIndex < itemList.length || closestIndex >= 2 * itemList.length) {
      const targetIndex = virtualIndex + middleIndex;
      setTimeout(() => {
        centerActiveImage(targetIndex, true);
      }, 0);
    }

    // Reset manual scroll flag after a delay
    setTimeout(() => {
      isManualScroll.current = false;
    }, 1000);
  };

  // Handle bubble click
  const handleBubbleClick = (index: number) => {
    setActiveIndex(index);
    centerActiveImage(index + middleIndex);
  };

  return (
    itemList?.length > 0 && (
      <div className="banner-carousel-container">
        <div
          className="banner-carousel"
          onScroll={handleScroll}
          ref={carouselRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {extendedItems?.map((item, index) => (
            <div
              key={index}
              className="banner-carousel-box"
              ref={(el) => {
                imageRefs.current[index] = el;
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="banner-carousel-bubbles">
          {itemList?.map((_, index) => (
            <div
              key={index}
              className={`banner-carousel-bubble ${
                index === activeIndex ? "active" : ""
              }`}
              onClick={() => handleBubbleClick(index)}
            />
          ))}
        </div>
      </div>
    )
  );
};

export default CarouselBanner;
import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    activeCarouselCard?: {
      element: Element;
      id: string | null;
      index: number;
      data: DOMStringMap;
    };
  }
}
import { PlayButtonSvg } from "@/assets/svgs";
import "./VideoSlider.css";
import "../../Bookings/ViewBooking.css";
interface Props {
  devineExperience: any;
}

const VideoPlayer = ({ devineExperience }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [size, setSize] = useState({ width: 320, height: 180 });
  const [videoData, setVideoData] = useState("");

  const handlePlayClick = () => setIsVideoOpen(true);
  const handleCloseVideo = () => setIsVideoOpen(false);

  useEffect(() => {
    const carousel = document.querySelector(".date-temple-cards");
    const cards: any = document.querySelectorAll(".date-temple-card");
    const bubbles = document.querySelectorAll(".bubble");

    const handleVisibility = (entries: any) => {
      entries.forEach((entry: any) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
          const activeCard = entry.target;
          const cardIndex = Array.from(cards).indexOf(activeCard);
          setActiveIndex(cardIndex);
          window.activeCarouselCard = {
            element: activeCard,
            id: activeCard.id,
            index: cardIndex,
            data: cards[cardIndex].dataset,
          };
          bubbles.forEach((bubble, i) => {
            bubble.classList.toggle("active", i === cardIndex);
          });
        }
      });
    };

    const observer = new IntersectionObserver(handleVisibility, {
      threshold: [0, 0.3, 0.7, 1],
      root: carousel,
    });

    cards.forEach((card: any) => observer.observe(card));
    return () => observer.disconnect();
  }, [devineExperience.length]);
  // Drag functionality
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX - position.x;
      startY = e.clientY - position.y;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - startX,
        y: e.clientY - startY,
      });
    };

    const handleMouseUp = () => {
      isDragging = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    videoEl.addEventListener("mousedown", handleMouseDown);
    return () => {
      videoEl.removeEventListener("mousedown", handleMouseDown);
    };
  }, [position]);
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      el.style.left = `${e.clientX - offsetX}px`;
      el.style.top = `${e.clientY - offsetY}px`;
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    el.addEventListener("mousedown", onMouseDown);
    return () => {
      el.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  // Resize functionality
  const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(200, startWidth + (e.clientX - startX));
      const newHeight = Math.max(100, startHeight + (e.clientY - startY));
      setSize({ width: newWidth, height: newHeight });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
  const convertToEmbedUrl = (url: string): string => {
    // Handle YouTube Shorts URL (e.g., https://www.youtube.com/shorts/VIDEO_ID)
    const shortsMatch = url.match(/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }

    // Handle shortened youtu.be URL (e.g., https://youtu.be/VIDEO_ID)
    const youtuBeMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (youtuBeMatch) {
      return `https://www.youtube.com/embed/${youtuBeMatch[1]}`;
    }

    // Handle standard YouTube watch URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
    const watchMatch = url.match(/v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }

    // Return original URL if no match found
    return url;
  };
  
  return (
    <div className="date-temple-container">
      <div className="booking-view--box-thumbnail-container">
        <div className="booking-view--box-video">
          <img
            className="booking-view--box-thumbnail"
            src={
              devineExperience?.videoThumbnail ??
              "https://images.unsplash.com/photo-1597131267491-b28fc433ea3c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGdhbmdhJTIwYWFydGl8ZW58MHx8MHx8fDA%3D"
            }
            alt="puja-img"
          />
          {devineExperience.videoUrl && devineExperience.videoUrl != "" && (
            <span
              onClick={() => {
                handlePlayClick();
                setVideoData(devineExperience.videoUrl);
              }}
              className="booking-view--box-playbtn cursor-pointer"
            >
              <PlayButtonSvg className="play-icon" />
            </span>
          )}
        </div>
       {devineExperience?.text && devineExperience?.text != "" && <p className="booking-view--box-thumbnail-msg">
          {devineExperience?.text ?? ""}
        </p>}
      </div>
      {/* Floating YouTube Video */}
      {isVideoOpen && (
        <div
          ref={videoRef}
          className="floating-video-player draggable"
          style={{
            bottom: position.y,
            right: position.x,
            width: size.width,
            height: size.height,
            position: "fixed",
          }}
        >
          <iframe
            src={convertToEmbedUrl(
              devineExperience.videoUrl && devineExperience.videoUrl != ""
                ? devineExperience.videoUrl
                : "https://youtube.com/shorts/YAWj1JZ-CiA?si=z37xQ4Fnm_bqpUop"
            )}
            title="YouTube player"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ width: "100%", height: "100%" }}
          ></iframe>
          <button className="close-video-btn" onClick={handleCloseVideo}>
            ✕
          </button>
          <div className="resize-handle" onMouseDown={handleResize}></div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;

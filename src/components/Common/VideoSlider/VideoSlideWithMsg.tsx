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
import Image from "next/image";
import "./VideoSlider.css";
import "../../Bookings/ViewBooking.css";
interface Props {
  devineExperience: any;
  componentType?: string;
  onPlayVideo?: (link) => void;
}
const templeThumbnail =
  "https://d28wmhrn813hkk.cloudfront.net/uploads/1757600524685-sw0ke.webp";
const VideoSlideWithMsg = ({
  devineExperience,
  componentType,
  onPlayVideo,
}: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 120, y: 120 });
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
  function getDriveVideoUrl(
    link: string,
    type: "preview" | "download" = "preview"
  ): string {
    const match = link.match(/\/d\/([^/]+)\//);
    if (!match) return "";

    const fileId = match[1];

    if (type === "download") {
      // This one gives a download link (may show virus warning for large files)
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    // Default: Google’s inline preview player (plays video inside iframe)
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  function getDriveImageUrl(link: string): string {
    const match = link.match(/\/d\/([^/]+)\//);
    if (!match) return "";

    const fileId = match[1];

    // Direct image link (can be used in <img src="...">)
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  return devineExperience.length > 0 ? (
    <div className="date-temple-container">
      <div className="date-temple-cards-booking ph-1">
        {devineExperience.map((card, index) => (
          <span key={index}>
            <div className="date-temple-card">
              <div className="thumbnail-container">
                {card.videoThumbnail && card?.videoThumbnail != "" ? (
                  <img
                    src={card.videoThumbnail}
                    alt={card.title}
                    className="temple-thumbnail"
                  />
                ) : (
                  <Image
                    src={templeThumbnail}
                    alt={""}
                    className="temple-thumbnail"
                  />
                )}
                {card.videoUrl && card.videoUrl != "" && (
                  <button
                    className="play-button"
                    onClick={() => {
                      handlePlayClick();
                      setVideoData(getDriveVideoUrl(card?.videoUrl));
                      if (onPlayVideo)
                        onPlayVideo(card?.videoUrl);
                    }}
                  >
                    <PlayButtonSvg className="play-icon" />
                  </button>
                )}
              </div>
            </div>

            {/* {card?.text && card?.text != "" && (
              <div style={{ marginTop: "4px" }}>
                <p className="booking-view--box-thumbnail-msg">
                  {card?.text ?? ""}
                </p>
              </div>
            )} */}
            <div style={{ padding: "4px 0" }}>
              {card?.sankalpTime && card?.sankalpTime != "" && (
                <div className="date-temple-card--date">
                  Sankalp time: {card.sankalpTime}
                </div>
              )}
              {card?.chadhavaTime && card?.chadhavaTime != "" && (
                <div className="date-temple-card--date">
                  Mandir Darshan: {card.chadhavaTime}
                </div>
              )}
              {card?.offeringName && card?.offeringName != "" && (
                <div className="date-temple-card--temple-title">
                  Your Offerings: {card.offeringName}
                </div>
              )}
            </div>
          </span>
        ))}
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
            zIndex: "10000000000",
          }}
        >
          <iframe
            src={convertToEmbedUrl(
              videoData == ""
                ? "https://youtube.com/shorts/YAWj1JZ-CiA?si=z37xQ4Fnm_bqpUop"
                : videoData
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
  ) : (
    <></>
  );
};

export default VideoSlideWithMsg;

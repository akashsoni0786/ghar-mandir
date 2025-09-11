import useWindow from "@/customHooks/useWindows";
import { useEffect, useRef, useState } from "react";
import "./VideoBox.css";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import { Minimize, X } from "react-feather";
import ThumbnailImg from "../../../assets/images/video-thumbnail.webp";
const VideoBox = ({ redux }: DIProps) => {
  const { width } = useWindow();
  const [isVisible, setIsVisible] = useState(
    (sessionStorage.getItem("video") ?? "") != "hidden"
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const videoRef: any = useRef<HTMLVideoElement>(null);
  const videoWrapperRef: any = useRef<HTMLDivElement>(null);
  const dragRef: any = useRef<HTMLDivElement>(null);

  // Reset video state when video source changes
  useEffect(() => {
    if (videoRef.current && redux?.common?.video_data) {
      // Reset playback state
      setIsPlaying(false);
      setUserInteracted(false);

      // Force video reload with new source
      videoRef.current.pause();
      videoRef.current.load(); // This will reload the video with the new source

      // Auto-play the new video (muted if needed)
      const tryPlay = async () => {
        try {
          videoRef.current.muted = false;
          await videoRef.current.play();
          setIsPlaying(true);
          setIsMuted(false);
        } catch (err) {
          console.log("Autoplay with sound failed, trying muted:", err);
          try {
            videoRef.current.muted = true;
            await videoRef.current.play();
            setIsPlaying(true);
            setIsMuted(true);
            setShowControls(true);
          } catch (mutedErr) {
            console.error("Muted autoplay failed:", mutedErr);
            setShowControls(true);
          }
        }
      };

      tryPlay();
    }
  }, [redux?.common?.video_data]); // This effect runs when video_data changes

  // Handle autoplay for initial load
  useEffect(() => {
    if (isVisible && videoRef.current && redux?.common?.video_data) {
      const tryPlay = async () => {
        try {
          videoRef.current.muted = false;
          await videoRef.current.play();
          setIsPlaying(true);
          setIsMuted(false);
        } catch (err) {
          console.log("Autoplay with sound failed, trying muted:", err);
          try {
            videoRef.current.muted = true;
            await videoRef.current.play();
            setIsPlaying(true);
            setIsMuted(true);
            setShowControls(true);
          } catch (mutedErr) {
            console.error("Muted autoplay failed:", mutedErr);
            setShowControls(true);
          }
        }
      };
      tryPlay();
    }
  }, [isVisible]);

  // Handle drag start (mouse or touch)
  const handleDragStart = (clientX: number, clientY: number) => {
    if (isFullscreen) return; // Disable dragging in fullscreen
    setIsDragging(true);
    setDragStart({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX, e.clientY);
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
    e.preventDefault();
  };

  // Handle drag move (mouse or touch)
  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || isFullscreen) return;
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
    e.preventDefault();
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Add global event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchend", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, dragStart]);

  const togglePlay = () => {
    if (!userInteracted) {
      setUserInteracted(true);
      if (videoRef.current) {
        videoRef.current.muted = false;
      }
    }

    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true));
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFullscreen(!isFullscreen);
  };

  const closeFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFullscreen(false);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const hideControls = () => {
      timeoutId = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    if (isPlaying && showControls) {
      hideControls();
    }

    return () => clearTimeout(timeoutId);
  }, [isPlaying, showControls]);

  useEffect(() => {
    if (!isVisible) {
      sessionStorage.setItem("video", "hidden");
    }
  }, [isVisible]);

  const getVideoWrapperStyles = () => {
    const baseStyle = {
      position: "absolute" as const,
      width: width < 480 ? "104px" : "180px",
      height: width < 480 ? "180px" : "324px",
      borderRadius: "4px",
      overflow: "hidden",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
      backgroundColor: "#000",
      transform: `translate(${position.x}px, ${position.y}px) scale(1)`,
      transition: isDragging ? "none" : "all 0.2s ease",
      cursor: isDragging ? "grabbing" : "pointer",
    };

    return baseStyle;
  };

  if (!isVisible || !redux?.common?.video_data) return null;

  return isFullscreen ? (
    <div className="fullscreenModal">
      <div className="fullscreenModalContent">
        <div className="fullscreenVideoContainer">
          <video
            poster={ThumbnailImg.src}
            ref={videoRef}
            className="fullscreenVideo"
            playsInline
            muted={isMuted}
            loop={false}
            autoPlay
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          >
            <source src={redux?.common?.video_data} type="video/mp4" />
            Your browser doesn't support HTML5 video
          </video>

          <div className="fullscreenControls">
            <button
              className="fullscreenControlButton"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
            <button
              className="fullscreenControlButton"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>
            <button
              className="fullscreenControlButton"
              onClick={closeFullscreen}
              aria-label="Exit fullscreen"
            >
              <Minimize size={20} />
            </button>
          </div>
        </div>

        <button
          onClick={closeFullscreen}
          className="fullscreenCloseButton"
          aria-label="Close fullscreen"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  ) : (
    <div className="videoContainer">
      <div
        ref={videoWrapperRef}
        style={getVideoWrapperStyles()}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => {
          if (isPlaying) {
            const timeout = setTimeout(() => setShowControls(false), 3000);
            return () => clearTimeout(timeout);
          } else {
            setShowControls(false);
          }
        }}
        onClick={togglePlay}
      >
        <div
          ref={dragRef}
          className="dragHandle"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        />
        <video
          poster={ThumbnailImg.src}
          ref={videoRef}
          className="videoPlayer"
          playsInline
          muted={isMuted}
          loop={false}
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        >
          <source src={redux?.common?.video_data} type="video/mp4" />
          Your browser doesn't support HTML5 video
        </video>

        <div
          className={`controlsContainer ${showControls ? "show" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="controlButton"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
          <button
            className="controlButton"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>

          <button
            className="controlButton fullscreenButton"
            onClick={toggleFullscreen}
            aria-label="Enter fullscreen"
          >
            ⛶
          </button>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }}
          className="closeButton"
          aria-label="Close video"
        >
          <X size={width < 480 ? 12 : 16} />
        </button>
      </div>
    </div>
  );
};

export default DI(VideoBox);

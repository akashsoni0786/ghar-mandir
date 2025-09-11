// components/ImageZoom.tsx
"use client"; // Mark as Client Component

import { useEffect, useRef, useState } from "react";
import { TextButton } from "./Buttons";
import { MinusCircle, PlusCircle } from "react-feather";

interface ImageZoomProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function ImageZoom({ src, alt, onClose }: ImageZoomProps) {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ left: 0, top: 0 });

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle wheel zoom
  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((prev: any) => {
        return Math.min(Math.max(0.5, prev + delta), 5);
      });
    }
  };

  // Mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;

    setIsDragging(true);
    setStartPos({
      x: e.pageX - (imageRef.current?.offsetLeft || 0),
      y: e.pageY - (imageRef.current?.offsetTop || 0),
    });
    setScrollPos({
      left: imageRef.current?.scrollLeft || 0,
      top: imageRef.current?.scrollTop || 0,
    });

    if (imageRef.current) {
      imageRef.current.style.cursor = "grabbing";
    }
  };

  // Mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageRef.current) return;

    e.preventDefault();
    const x = e.pageX - (imageRef.current.offsetLeft || 0);
    const y = e.pageY - (imageRef.current.offsetTop || 0);
    const walkX = (x - startPos.x) * 2;
    const walkY = (y - startPos.y) * 2;

    imageRef.current.scrollLeft = scrollPos.left - walkX;
    imageRef.current.scrollTop = scrollPos.top - walkY;
  };

  // Mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
    if (imageRef.current) {
      imageRef.current.style.cursor = "grab";
    }
  };

  // Zoom in/out functions
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 5));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  // Add event listeners
  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;

    img.addEventListener("wheel", handleWheel as EventListener);

    return () => {
      img.removeEventListener("wheel", handleWheel as EventListener);
    };
  }, [scale]);

  return (
    <div
      className="fixed inset-0 bg-black/90 z-5000 flex justify-center items-center overflow-auto"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <button
        className="absolute top-4 right-4 text-white text-3xl z-5000"
        onClick={onClose}
      >
        ×
      </button>

      <div className="absolute bottom-4 right-4 flex gap-2 z-5000">
        <TextButton
          children={
            <PlusCircle size={30}/>
          }
          onClick={zoomIn}
        />

        <TextButton
          children={
            <MinusCircle size={30}/>
          }
          onClick={zoomOut}
        />
      </div>

      <div
        ref={containerRef}
        className="max-w-[90vw] max-h-[90vh] overflow-auto"
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className="transition-transform duration-200 origin-top-left cursor-grab"
          style={{ transform: `scale(${scale})` }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        />
      </div>
    </div>
  );
}

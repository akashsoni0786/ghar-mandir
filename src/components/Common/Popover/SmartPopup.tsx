import { useState, useRef, useEffect } from "react";
import "./Popover.css";

export default function SmartPopover({ trigger, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState("bottom");
  const popoverRef:any = useRef(null);
  const triggerRef:any = useRef(null);

  // Calculate the best position for the popover
  const calculatePosition = () => {
    if (!triggerRef.current) return "bottom";

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = 200; // Approximate width
    const popoverHeight = 150; // Approximate height

    const space = {
      top: triggerRect.top,
      bottom: window.innerHeight - triggerRect.bottom,
      left: triggerRect.left,
      right: window.innerWidth - triggerRect.right,
    };

    // Choose the first position with enough space
    if (space.bottom >= popoverHeight) return "bottom";
    if (space.top >= popoverHeight) return "top";
    if (space.right >= popoverWidth) return "right";
    if (space.left >= popoverWidth) return "left";
    return "bottom"; // Fallback
  };

  // Toggle popover with position calculation
  const togglePopover = () => {
    if (!isOpen) {
      const newPosition = calculatePosition();
      setPosition(newPosition);
    }
    setIsOpen(!isOpen);
  };

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="smart-popover-container" ref={popoverRef}>
      <div className="popover-trigger" ref={triggerRef} onClick={togglePopover}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`popover popover-${position}`}>
          <div className="popover-content">{children}</div>
        </div>
      )}
    </div>
  );
}
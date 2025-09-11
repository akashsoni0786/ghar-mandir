import { useState, useRef, useEffect } from "react";
import "./Popover.css"; // Global CSS file (or use inline <style>)

export default function Popover({ trigger, children, position = "bottom" }) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef: any = useRef(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="popover-container" ref={popoverRef}>
      <div className="popover-trigger" onClick={() => setIsOpen(!isOpen)}>
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

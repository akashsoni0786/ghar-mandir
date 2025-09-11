import { CrossIcon } from "@/assets/svgs";
import React, { useEffect } from "react";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";

interface Props extends DIProps {
  setIsDrawerOpen: (open: boolean) => void;
  isDrawerOpen: boolean;
  component: React.ReactNode;
}

function BottomDrawer(props: Props) {
  const { isDrawerOpen, setIsDrawerOpen, component } = props;

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  return (
    <>
      
      <div
        className="drawer-section"
        style={{ display: isDrawerOpen ? "block" : "none" }}
      >
        {/* Backdrop - blur effect for the remaining 25% */}
        {isDrawerOpen && (
          <div className="drawer-backdrop" onClick={toggleDrawer} />
        )}

        {/* Drawer component */}
        <div
          className={`drawer ${isDrawerOpen ? "drawer-open" : "drawer-closed"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="cross-icon" onClick={toggleDrawer}>
            <CrossIcon />
          </div>
          <div className="drawer-content-container">
            <div className="drawer-scrollable-content">{component}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DI(BottomDrawer);

"use client";

import { useState } from "react";
import "./ToggleTab.css";

const ToggleTab = ({ tabs, isActive, setIsActive }: any) => {
  // Calculate active index for CSS transform
  const activeIndex = tabs.findIndex((tab) => tab === isActive);

  return (
    <div className="toggle-container">
      <div
        className="toggle-switch"
        style={{ "--active-index": activeIndex } as React.CSSProperties}
      >
        {tabs.map((tab, idx) => {
          return (
            <div
              key={idx}
              onClick={() => {
                setIsActive(tab);
              }}
              className={`toggle-tab ${
                isActive == tab ? "active-tab" : "unactive-tab"
              }`}
            >
              {tab}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ToggleTab;

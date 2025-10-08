import React, { useEffect, useState } from "react";
import { Eye } from "react-feather";

interface ViewerCountBadgeProps {
  minCount: number; // starting min
  maxCount: number; // upper cap
  intervalMs?: number; // update interval (ms)
}

export default function ViewerCountBadge({
  minCount,
  maxCount,
  intervalMs = 2000,
}: ViewerCountBadgeProps) {
  // start within min & max
  const [count, setCount] = useState(() =>
    Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        // always increment by 1–3
        const inc = Math.floor(Math.random() * 3) + 1;
        let next = prev + inc;
        if (next > maxCount) next = maxCount; // keep in range
        return next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [maxCount, intervalMs]);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "4px 8px",
        borderRadius: "30px",
        background:
          "linear-gradient(135deg, #af1e2e 0%, #dd9849cf 100%)", // blue → cyan gradient
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        fontWeight: 500,
        fontSize: "16px",
        color: "white",
        transition: "all 0.3s ease",
      }}
    >
      <Eye size={18} strokeWidth={2} />
      <span style={{ fontSize: "16px", color: "#fff" }}>
        {count.toLocaleString()}
      </span>
      <span style={{ fontSize: "12px", color: "#e0f7ff" }}>people watching now</span>
    </div>
  );
}

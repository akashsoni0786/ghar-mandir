"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./ViewCounter.module.css";

const ViewCounter = ({
  minCount = 100,
  maxCount = 100000000,
  intervalMs = 2000,
}) => {
  const [currentCount, setCurrentCount] = useState(() => {
    const maxInitial = minCount + 700;
    return Math.floor(Math.random() * (maxInitial - minCount + 1)) + minCount;
  });
  const [previousCount, setPreviousCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPreviousCount(currentCount);
      setCurrentCount((prev) => {
        const inc = Math.floor(Math.random() * 3) + 1;
        let next = prev + inc;
        if (next > maxCount) next = maxCount; // keep in range
        return next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [maxCount, intervalMs, currentCount]);

  const renderDigits = useCallback(() => {
    const newCountStr = currentCount.toString();
    const prevCountStr = previousCount
      .toString()
      .padStart(newCountStr.length, "0");
    return newCountStr.split("").map((digit, index) => {
      const shouldAnimate = newCountStr[index] !== prevCountStr[index];
      return (
        <div key={index} className={styles.counter}>
          <div
            className={styles.currentDigit}
            style={{
              transform: shouldAnimate ? "translateY(-100%)" : "translateY(0)",
              transition: shouldAnimate ? "transform 0.5s ease-out" : "none",
            }}
          >
            {prevCountStr[index] || "0"}
          </div>
          <div
            className={styles.newDigit}
            style={{
              transform: shouldAnimate ? "translateY(0)" : "translateY(100%)",
              transition: shouldAnimate ? "transform 0.5s ease-in" : "none",
            }}
          >
            {digit}
          </div>
        </div>
      );
    });
  }, [currentCount, maxCount, intervalMs]);

  return <div className={styles.container}>{renderDigits()}</div>;
};

export default ViewCounter;
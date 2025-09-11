// components/Marquee.tsx
import React from 'react';

interface MarqueeProps {
  content: React.ReactNode;
  speed?: number; // pixels per second
  direction?: 'left' | 'right';
  backgroundColor?: string;
  textColor?: string;
  height?: string;
  sticky?: boolean; // New prop to control sticky behavior
  stickyOffset?: string; // New prop for sticky position offset
}

const Marquee: React.FC<MarqueeProps> = ({ 
  content, 
  speed = 10, 
  direction = 'left',
  backgroundColor = '#f8f8f8',
  textColor = '#333',
  // height = '40px',
  sticky = false, // Default to non-sticky
  stickyOffset = '0' // Default offset
}) => {
  return (
    <div style={{
      position: sticky ? 'sticky' : 'relative', // Changed based on sticky prop
      top: sticky ? stickyOffset : 'auto', // Only apply top when sticky
      zIndex: sticky ? 1000 : 'auto', // Only high z-index when sticky
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      width: '100%',
      backgroundColor: backgroundColor,
      color: textColor,
      // height: height,
      display: 'flex',
      alignItems: 'center',
      boxShadow: sticky ? '0 2px 5px rgba(0,0,0,0.1)' : 'none' // Shadow only when sticky
    }}>
      <div style={{
        display: 'inline-block',
        paddingLeft: '100%',
        animation: `marquee ${speed}s linear infinite`,
        animationDirection: direction === 'left' ? 'normal' : 'reverse'
      }}>
        {content}
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default Marquee;
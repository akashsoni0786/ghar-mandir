import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="skeleton-loader">
      {/* Header Skeleton */}
      <div className="skeleton-header" />
      
      {/* Content Area Skeleton */}
      <div className="skeleton-content">
        {/* Sidebar Skeleton */}
        <div className="skeleton-sidebar" />
        
        {/* Main Content Skeleton */}
        <div className="skeleton-main">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-row" />
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .skeleton-loader {
          width: 100%;
          height: 100%;
        }
        
        .skeleton-header {
          height: 60px;
          background-color: #f0f0f0;
          margin-bottom: 20px;
          border-radius: 4px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .skeleton-content {
          display: flex;
          gap: 20px;
        }
        
        .skeleton-sidebar {
          width: 250px;
          height: 400px;
          background-color: #f0f0f0;
          border-radius: 4px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .skeleton-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .skeleton-row {
          height: 80px;
          background-color: #f0f0f0;
          border-radius: 4px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default SkeletonLoader;
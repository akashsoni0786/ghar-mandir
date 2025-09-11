import React, { createContext, useContext, useState } from "react";

// Define types for your context
type PoojaDetailsContextType = {
  activePackage: any;
  setActivePackage: (pkg: any) => void;
  addons: any;
  setAddons: (addons: any) => void;
  recommendedPrice: any;
  setRecommendedPrice: (data: any) => void;
};

// Create context
const PoojaDetailsContext = createContext<PoojaDetailsContextType | undefined>(
  undefined
);

// Create provider component
export const DetailsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activePackage, setActivePackage] = useState<any>(null);
  const [addons, setAddons] = useState<any>([]);
  const [recommendedPrice, setRecommendedPrice] = useState(0);

  const value = {
    activePackage,
    setActivePackage,
    addons,
    setAddons,
    recommendedPrice,
    setRecommendedPrice,
  };

  return (
    <PoojaDetailsContext.Provider value={value}>
      {children}
    </PoojaDetailsContext.Provider>
  );
};

// Custom hook for consuming the context
export const usePoojaContext = () => {
  const context = useContext(PoojaDetailsContext);
  if (context === undefined) {
    throw new Error("usePoojaContext must be used within a DetailsProvider");
  }
  return context;
};

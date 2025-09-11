"use client";
import React, { useEffect } from "react";
import { NotFound } from "@/assets/svgs";
import "../../styles/NoFound.css";
import { DarkBgButton } from "@/components/Common/Buttons";
import { useRouter } from "next/navigation";
const NotFoundPage = () => {
  const router = useRouter();

  useEffect(() => {
    const path = window.location.pathname;

    // If URL ends with a slash, try removing it
    if (path.endsWith("/")) {
      const newPath = path.slice(0, -1);
      router.replace(newPath);
    } else {
      router.replace("/"); // Fallback to home
    }
  }, []);
  return (
    <div className="container ph-16">
      <div className="content">
        <div className="notFoundSvg">
          <NotFound className="svg-width" />
        </div>
        <h1 className="title">Page Not Found</h1>
        <p className="message">
          Oops! The page you're looking for doesn't exist or might have been
          removed.
        </p>

        <div className="return-btn">
          <DarkBgButton
            onClick={() => {
              router.push("../");
            }}
          >{"Return to Homepage"}</DarkBgButton>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

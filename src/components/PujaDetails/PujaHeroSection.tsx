"use client";
import React, { useState } from "react";
import { CalenderIcon, RatingIconYellow, TempleIcon } from "@/assets/svgs";
import SliderCarousel from "../Common/SliderCarousel";
import useWindow from "@/customHooks/useWindows";
import { dummyImages } from "@/commonvaribles/constant_variable";
import ViewerCountBadge from "../Common/ViewerCounter";

interface Props {
  image: any;
  details: any;
  topBenefits: any;
  type: string;
  reviewData?: any;
}

const PujaHeroSection = ({
  image,
  details,
  topBenefits,
  type,
  reviewData,
}: Props) => {
  const width = typeof window !== "undefined" ? useWindow().width : 0;
  const [showMore, setShowMore] = useState(false);

  const handleReadToggle = () => {
    setShowMore(!showMore);
  };
  const renderDescription = () => {
    if (details?.description) {
      if (details?.description?.includes("<p")) {
        // Always show full description on desktop
        if (width > 768) {
          return (
            <p
              className="pujadetails-data--description"
              dangerouslySetInnerHTML={{ __html: details?.description || "" }}
            />
          );
        }

        // Mobile/tablet view with truncation
        if (width <= 768) {
          const showFullText = showMore || details?.description?.length <= 300;

          return (
            <span>
              <p
                className="pujadetails-data--description"
                dangerouslySetInnerHTML={{
                  __html: showFullText
                    ? details?.description
                    : `${details?.description?.slice(0, 300)}...`,
                }}
              />
              {details?.description?.length > 300 && (
                <span className="read-more" onClick={handleReadToggle}>
                  {showFullText ? " See Less" : " See More"}
                </span>
              )}
            </span>
            // <p className="pujadetails-data--description">
            //   {showFullText
            //     ? details?.description
            //     : `${details?.description?.slice(0, 250)}...`}
            //   {details?.description?.length > 250 && (
            //     <span className="read-more" onClick={handleReadToggle}>
            //       {showFullText ? " See Less" : " See More"}
            //     </span>
            //   )}
            // </p>
          );
        }

        return (
          <p className="pujadetails-data--description">
            {details?.description ?? ""}
          </p>
        );
      } else {
        if (width > 768) {
          return (
            <p className="pujadetails-data--description">
              {details?.description}
            </p>
          );
        }

        // Mobile/tablet view with truncation
        if (width <= 768) {
          const showFullText = showMore || details?.description?.length <= 200;

          return (
            <p className="pujadetails-data--description">
              {showFullText
                ? details?.description
                : `${details?.description?.slice(0, 250)}...`}
              {details?.description?.length > 250 && (
                <span className="read-more" onClick={handleReadToggle}>
                  {showFullText ? " See Less" : " See More"}
                </span>
              )}
            </p>
          );
        }

        return (
          <p className="pujadetails-data--description">
            {details?.description ?? ""}
          </p>
        );
      }
    }
  };

  return (
    <div className="pujadetails ">
      <div
        className={"ph-slider-16"}
        style={
          width <= 768 && width > 480
            ? { minWidth: "100%", padding: "0 12px" }
            : { padding: "0" }
        }
      >
        <SliderCarousel images={image?.length ? image : dummyImages} />
      </div>

      <div className="pujadetails-data ph-mob-16">
        <div className="puja-name-share">
          <p className="pujadetails-data-special">
            {details?.subHeading ?? ""}
          </p>
          {/* <span
            className="puja-share"
            onClick={() => {
              window.location.href = "https://dev.gharmandir.in/";
            }}
          >
            <ShareIcon2 />
          </span> */}
          {width <= 768 && (
            <div className="pujadetails-data--rating">
              <p className="pujadetails-data--rating-value">
                {reviewData?.rating ?? "5.0"}
              </p>
              <span className="pujadetails-data--rating-icon">
                <RatingIconYellow />
              </span>
              <p className="pujadetails-data--rating-count">
                ({reviewData?.userCount ?? "566"})
              </p>
            </div>
          )}
        </div>
        <h2 className="puja-heading">{details?.heading ?? ""} </h2>

        {width > 768 && (
          <div className="pujadetails-data--rating">
            <p className="pujadetails-data--rating-value">
              {reviewData?.rating ?? "5.0"}
            </p>
            <span className="pujadetails-data--rating-icon">
              <RatingIconYellow />
            </span>
            <p className="pujadetails-data--rating-count">
              ({reviewData?.userCount ?? "566"})
            </p>
          </div>
        )}

        {/* {topBenefits?.length > 0 && (
          <ul className="pujadetails-data--benefits">
            {topBenefits.map((item, key) => {
              return (
                <li key={key} className="pujadetails-data--benefits-list">
                  <img
                    className="benefit-icon"
                    src={item?.image}
                    alt={item?.title ?? item?.benefit ?? ''}
                  />
                  <p className="benefit-label">{item.title  ?? item?.benefit ?? ''}</p>
                </li>
              );
            })}
          </ul>
        )} */}

        <div className="pujadetails-data--horizontal"></div>

        <div className="pujadetails-data--temple-date">
          <div className="pujadetails-data--temple">
            <span>
              <TempleIcon className="temple-icon" />
            </span>
            <span>{details?.poojaTemple}</span>
          </div>
          <div className="pujadetails-data--date">
            <span>
              <CalenderIcon className="calender-icon" />
            </span>
            <span>{details?.poojaDay ?? ""}</span>
          </div>
        </div>

        <ViewerCountBadge minCount={400} maxCount={15000} intervalMs={2000} />

        <div className="pujadetails-data--horizontal"></div>
        <p className="pujadetails-data--description-heading">{type} Details</p>
        {renderDescription()}
        {width < 768 && <div className="horizontal-line-gray"></div>}
      </div>
    </div>
  );
};

export default PujaHeroSection;

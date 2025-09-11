import { HeartIcon, HeartIconFilled, ThumbIcon, UserIcon } from "@/assets/svgs";
import React from "react";
import Image from "next/image";

const TestimonialImage = ({ data }: any) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };
  return (
    <div className="testimonial-img-card">
      <div className="testimonial-card-quote">
        <ThumbIcon />
      </div>
      <Image
        alt="review"
        src={data.img}
        style={{
          border: "5px solid white",
          borderRadius: "4px",
          transform: "scale(1)",
        }}
      />
      <div className="testimonial-card-divider">
        <div className="testimonial-card-divider-usericons">
          <div className="testimonial-card-divider-usericons-1">
            <UserIcon className="usericons-1" />
          </div>
          <div className="testimonial-card-divider-usericons-2">
            <UserIcon className="usericons-2" />
          </div>
          <div className="testimonial-card-divider-usericons-3">
            <UserIcon className="usericons-3" />
          </div>
        </div>
        <div className="testimonial-card-divider-countcontent">
          {isLiked
            ? `You & ${data.likes} People liked this`
            : `${data.likes} People liked this`}
        </div>
        <div
          className="testimonial-card-divider-heart"
          onClick={handleLikeClick}
        >
          {isLiked ? <HeartIconFilled /> : <HeartIcon />}
        </div>
      </div>
    </div>
  );
};

export default TestimonialImage;

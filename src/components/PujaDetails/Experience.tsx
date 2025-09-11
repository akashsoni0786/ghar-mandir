import {
  HeartIcon,
  HeartIconFilled,
  StarIcon,
  StarIconFilled,
  ThumbIcon,
  UserIcon,
} from "@/assets/svgs";
import { generateId } from "@/constants/commonfunctions";
import React from "react";

const TestimonialCard = ({ data }: any) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };
  const StarRating = ({ rating, maxRating = 5 }) => {
    return (
      <div className="testimonial-card-rating-stars">
        {[...Array(maxRating)].map((val, index) => {
          const starValue = index + 1;
          return (
            <span key={generateId()}>
              {starValue <= rating ? <StarIconFilled /> : <StarIcon />}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="testimonial-card">
      <div className="testimonial-card-quote">
        <ThumbIcon />
      </div>
      <div>
        <h4 className="testimonial-card-heading">{`"${data?.title ?? ""}"`}</h4>
        <p className="testimonial-card-reviewcontent">
          {`"${data?.review ?? ""}"`}
        </p>
      </div>
      <div className="testimonial-card-rating">
        <img
          src={
            data?.profile_image.width > 0 && data?.profile_image.height > 0
              ? data?.profile_image
              : "https://digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png"
          }
          alt="user-image"
          className="testimonial-card-rating-userimg"
        />
        <div>
          <h4 className="testimonial-card-rating-username">
            {data?.author ?? ""}
          </h4>
          <StarRating rating={data?.rating ?? 5} maxRating={5} />
        </div>
      </div>
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

export default TestimonialCard;

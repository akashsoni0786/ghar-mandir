import { useEffect, useState } from "react";
import "./ReviewPage.css";
import { urlFetchCalls } from "@/constants/url";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import { Edit } from "react-feather";
import { StarFilled } from "@ant-design/icons";
import { login, updateProfileImage } from "@/store/slices/authSlice";
const {
  POST: { bookings_updateUserFeedback },
  GET: { users_getUserProfile },
} = urlFetchCalls;
interface BookingReviewProps extends DIProps {
  show: boolean;
  setShow: (show: boolean) => void;
  paramData: any;
  reviewData: any;
  reloadPage: () => void;
}
const BookingReview = ({
  show,
  setShow,
  request,
  toast,
  redux,
  paramData,
  reviewData,
  reloadPage,
  dispatch,
}: BookingReviewProps) => {
  const [formData, setFormData] = useState({
    rating: reviewData?.rating || "",
    review: reviewData?.comments || "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(Number(formData.rating ?? 0) >0){
    if (request) {
      request
        .POST(bookings_updateUserFeedback, {
          userId: redux?.auth?.authToken,
          rating: formData.rating,
          comments: formData.review,
          ...paramData,
        })
        .then((res) => {
          if (res.success) {
            toast?.show(
              res?.message ?? "Thank you for your review!",
              "success"
            );
            setFormData({
              rating: "",
              review: "",
            });
            setShow(true);
             reloadPage();
          }
        });
    }} else {
      toast?.show("Please provide a rating.", "error");
    }
  };

  const getUserData = () => {
    if (request) {
      request
        .GET(users_getUserProfile + "?userId=" + redux?.auth?.authToken)
        .then((res: any) => {
          if (res?.user) {
            if (dispatch) {
              dispatch(
                updateProfileImage({
                  profileImage:
                    res.user?.profileImage ||
                    "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg",
                })
              );
              dispatch(
                login({
                  username: res.user?.name || "",
                  mobile: res.user?.mobileNo || "",
                  countryCode: res.user?.countryCode || "",
                  authToken: redux?.auth?.authToken || "",
                })
              );
            }
          }
        });
    }
  };
  useEffect(() => {
    if (!redux?.auth?.username || redux?.auth?.username == "") getUserData();
  }, [redux?.auth]);
  return reviewData && Object.keys(reviewData ?? {}).length > 0 && show ? (
    <div className="add-review">
      <div className="review-header">
        <div className="review-avatar">
          <img src={redux?.auth?.profileImage} alt="User Avatar" />
        </div>
        <div className="review-user-info">
          <div className="review-user">
            <h3>{redux?.auth?.username ?? "You"}</h3>
            {/* <div className="review-date">June 15, 2023</div> */}
            <div className="review-rating">
              {[1, 2, 3, 4, 5].map((val) => {
                return (
                  <StarFilled
                    key={val}
                    className={
                      val <= reviewData.rating
                        ? "review-done"
                        : "review-notdone"
                    }
                  />
                );
              })}
            </div>
          </div>
          <div className="cursor-pointer" onClick={() => setShow(false)}>
            <Edit color="#af1e2e" size={18} />
          </div>
        </div>
      </div>
      {/* <div className="review-rating">
        {[1,2,3,4,5].map((val) => {
          return (
            <StarFilled
              key={val}
              className={val <= reviewData.rating ? "review-done" : "review-notdone"}
            />
          );
        })}
      </div> */}
      <div className="review-content">
        <p>{reviewData?.comments || ""}</p>
      </div>
    </div>
  ) : (
    <div className="add-review">
      <form id="reviewForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Rating</label>
          <div className="rating-input">
            <input
              type="radio"
              id="star5"
              name="rating"
              value="5"
              checked={formData.rating === "5"}
              onChange={handleChange}
            />
            <label htmlFor="star5" title="5 stars">
              ★
            </label>
            <input
              type="radio"
              id="star4"
              name="rating"
              value="4"
              checked={formData.rating === "4"}
              onChange={handleChange}
            />
            <label htmlFor="star4" title="4 stars">
              ★
            </label>
            <input
              type="radio"
              id="star3"
              name="rating"
              value="3"
              checked={formData.rating === "3"}
              onChange={handleChange}
            />
            <label htmlFor="star3" title="3 stars">
              ★
            </label>
            <input
              type="radio"
              id="star2"
              name="rating"
              value="2"
              checked={formData.rating === "2"}
              onChange={handleChange}
            />
            <label htmlFor="star2" title="2 stars">
              ★
            </label>
            <input
              type="radio"
              id="star1"
              name="rating"
              value="1"
              checked={formData.rating === "1"}
              onChange={handleChange}
            />
            <label htmlFor="star1" title="1 star">
              ★
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="review">Your Review</label>
          <textarea
            id="review"
            name="review"
            value={formData.review}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default DI(BookingReview);

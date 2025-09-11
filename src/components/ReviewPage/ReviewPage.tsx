import { useState } from "react";
import "./ReviewPage.css";
import ReviewGrid from "./ReviewGrid";

const ReviewPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "",
    review: "",
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
    alert("Thank you for your review! It will be visible after approval.");
    setFormData({
      name: "",
      email: "",
      rating: "",
      review: "",
    });
  };

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h1>Customer Reviews</h1>
        <p>
          Read what our customers say about our products and services. Share
          your experience with us!
        </p>
      </div>

      <div className="average-rating">
        <h2>Average Rating</h2>
        <div className="average-score">4.8</div>
        <div className="stars">
          <i
            className="fas fa-star"
            style={{ color: "var(--dark-orange)" }}
          ></i>
          <i
            className="fas fa-star"
            style={{ color: "var(--dark-orange)" }}
          ></i>
          <i
            className="fas fa-star"
            style={{ color: "var(--dark-orange)" }}
          ></i>
          <i
            className="fas fa-star"
            style={{ color: "var(--dark-orange)" }}
          ></i>
          <i
            className="fas fa-star-half-alt"
            style={{ color: "var(--dark-orange)" }}
          ></i>
        </div>
        <div className="total-reviews">Based on 124 reviews</div>
      </div>

      <div className="add-review">
        <h2>Add Your Review</h2>
        <form id="reviewForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

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

      <ReviewGrid />
    </div>
  );
};

export default ReviewPage;

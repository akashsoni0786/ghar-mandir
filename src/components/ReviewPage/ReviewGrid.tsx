import React from "react";
import "./ReviewPage.css";

const ReviewGrid = () => {
  return (
    <div className="reviews-grid">
      {/* Review Card 1 */}
      <div className="review-card">
        <div className="review-header">
          <div className="review-avatar">
            <img
              src="https://randomuser.me/api/portraits/women/43.jpg"
              alt="User Avatar"
            />
          </div>
          <div className="review-user">
            <h3>Sarah Johnson</h3>
            <div className="review-date">June 15, 2023</div>
          </div>
        </div>
        <div className="review-rating">
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
        </div>
        <div className="review-content">
          <p>
            Absolutely love this product! It exceeded all my expectations. The
            quality is outstanding and the customer service was exceptional.
            Will definitely purchase again.
          </p>
        </div>
      </div>

      {/* Review Card 2 */}
      <div className="review-card">
        <div className="review-header">
          <div className="review-avatar">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User Avatar"
            />
          </div>
          <div className="review-user">
            <h3>Michael Chen</h3>
            <div className="review-date">May 28, 2023</div>
          </div>
        </div>
        <div className="review-rating">
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="far fa-star"></i>
        </div>
        <div className="review-content">
          <p>
            Great product overall. The shipping was faster than expected. The
            only reason I'm not giving 5 stars is that the instructions could be
            clearer.
          </p>
        </div>
      </div>

      {/* Review Card 3 */}
      <div className="review-card">
        <div className="review-header">
          <div className="review-avatar">
            <img
              src="https://randomuser.me/api/portraits/women/65.jpg"
              alt="User Avatar"
            />
          </div>
          <div className="review-user">
            <h3>Emily Rodriguez</h3>
            <div className="review-date">April 10, 2023</div>
          </div>
        </div>
        <div className="review-rating">
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star-half-alt"></i>
        </div>
        <div className="review-content">
          <p>
            Very satisfied with my purchase. The product works exactly as
            described. The packaging was eco-friendly which I really appreciate.
            Would recommend to friends!
          </p>
        </div>
      </div>

      {/* Review Card 4 */}
      <div className="review-card">
        <div className="review-header">
          <div className="review-avatar">
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="User Avatar"
            />
          </div>
          <div className="review-user">
            <h3>David Wilson</h3>
            <div className="review-date">March 22, 2023</div>
          </div>
        </div>
        <div className="review-rating">
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
        </div>
        <div className="review-content">
          <p>
            This is my second purchase from this company and I continue to be
            impressed. The attention to detail and quality is unmatched in this
            price range.
          </p>
        </div>
      </div>

      {/* Review Card 5 */}
      <div className="review-card">
        <div className="review-header">
          <div className="review-avatar">
            <img
              src="https://randomuser.me/api/portraits/women/12.jpg"
              alt="User Avatar"
            />
          </div>
          <div className="review-user">
            <h3>Jennifer Lee</h3>
            <div className="review-date">February 5, 2023</div>
          </div>
        </div>
        <div className="review-rating">
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="far fa-star"></i>
          <i className="far fa-star"></i>
        </div>
        <div className="review-content">
          <p>
            Good product but arrived with minor cosmetic damage. Customer
            service was responsive and offered a partial refund which I
            appreciated.
          </p>
        </div>
      </div>

      {/* Review Card 6 */}
      <div className="review-card">
        <div className="review-header">
          <div className="review-avatar">
            <img
              src="https://randomuser.me/api/portraits/men/48.jpg"
              alt="User Avatar"
            />
          </div>
          <div className="review-user">
            <h3>Robert Taylor</h3>
            <div className="review-date">January 18, 2023</div>
          </div>
        </div>
        <div className="review-rating">
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
        </div>
        <div className="review-content">
          <p>
            Exceptional quality and value. I've compared similar products from
            other brands and this one stands out. The company clearly cares
            about their customers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewGrid;

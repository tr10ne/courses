import React, { useState, useRef } from "react";

const ReviewsScore = ({
  totalReviews,
  rating5,
  rating4,
  rating3,
  rating2,
  rating1,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const reviewsScoreRef = useRef(null);

  const calculatePercentage = (count, total) => {
    return total > 0 ? ((count / total) * 100).toFixed(2) : 0;
  };

  const ratings = { rating5, rating4, rating3, rating2, rating1 };
  const maxRating = Math.max(...Object.values(ratings));

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="reviews-score"
      ref={reviewsScoreRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`reviews-score__item ${
          rating5 === maxRating && !isHovered ? "highlighted" : ""
        }`}
      >
        <p className="item-score">5 звезд</p>
        <div className="progress-bar">
          <p className="item-value">{rating5} отзывов</p>
          <div
            className="progress"
            style={{ width: `${calculatePercentage(rating5, totalReviews)}%` }}
          ></div>
        </div>
      </div>

      <div
        className={`reviews-score__item ${
          rating4 === maxRating && !isHovered ? "highlighted" : ""
        }`}
      >
        <p className="item-score">4 звезды</p>
        <div className="progress-bar">
          <p className="item-value">{rating4} отзывов</p>
          <div
            className="progress"
            style={{ width: `${calculatePercentage(rating4, totalReviews)}%` }}
          ></div>
        </div>
      </div>

      <div
        className={`reviews-score__item ${
          rating3 === maxRating && !isHovered ? "highlighted" : ""
        }`}
      >
        <p className="item-score">3 звезды</p>
        <div className="progress-bar">
          <p className="item-value">{rating3} отзывов</p>
          <div
            className="progress"
            style={{ width: `${calculatePercentage(rating3, totalReviews)}%` }}
          ></div>
        </div>
      </div>

      <div
        className={`reviews-score__item ${
          rating2 === maxRating && !isHovered ? "highlighted" : ""
        }`}
      >
        <p className="item-score">2 звезды</p>
        <div className="progress-bar">
          <p className="item-value">{rating2} отзывов</p>
          <div
            className="progress"
            style={{ width: `${calculatePercentage(rating2, totalReviews)}%` }}
          ></div>
        </div>
      </div>

      <div
        className={`reviews-score__item ${
          rating1 === maxRating && !isHovered ? "highlighted" : ""
        }`}
      >
        <p className="item-score">1 звезда</p>
        <div className="progress-bar">
          <p className="item-value">{rating1} отзывов</p>
          <div
            className="progress"
            style={{ width: `${calculatePercentage(rating1, totalReviews)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsScore;

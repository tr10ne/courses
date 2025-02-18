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

  const ratings = [
    { rating: 5, count: rating5 },
    { rating: 4, count: rating4 },
    { rating: 3, count: rating3 },
    { rating: 2, count: rating2 },
    { rating: 1, count: rating1 },
  ];

  const maxCount = Math.max(...ratings.map((r) => r.count));

  const maxRatings = ratings.filter((r) => r.count === maxCount);

  const highestRating = maxRatings.reduce((prev, current) =>
    prev.rating > current.rating ? prev : current
  );

  const hasReviews = totalReviews > 0;

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
      {ratings.map(({ rating, count }) => (
        <div
          key={rating}
          className={`reviews-score__item ${
            hasReviews &&
            count === highestRating.count &&
            rating === highestRating.rating &&
            !isHovered
              ? "highlighted"
              : ""
          }`}
        >
          <p className="item-score">
            {rating} звезд
            {rating === 1 ? "" : rating >= 2 && rating <= 4 ? "ы" : ""}
          </p>
          <div className="progress-bar">
            <p className="item-value">{count} отзывов</p>
            <div
              className="progress"
              style={{ width: `${calculatePercentage(count, totalReviews)}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsScore;

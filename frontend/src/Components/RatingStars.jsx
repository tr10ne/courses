import React from "react";
import Stars from "./Stars";

const RatingStars = ({ rating }) => {
  const validRating = Math.min(Math.max(rating, 1), 5);

  return (
    <div
      className="review-rating__stars"
      role="img"
      aria-label={`Рейтинг: ${validRating} из 5`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Stars key={index} filled={index < validRating} />
      ))}
    </div>
  );
};

export default RatingStars;

import React from "react";

const Star = ({ filled }) => (
  <svg
    viewBox="0 0 14 13.3563"
    fill="none"
    className={`rating-stars ${filled ? "filled" : "empty"}`}
    aria-hidden="true"
  >
    <path d="M6.61 0.23C6.68 0.09 6.83 0 6.99 0C7.16 0 7.31 0.09 7.38 0.23L9.06 3.63C9.22 3.95 9.52 4.18 9.87 4.23L13.63 4.77C13.79 4.8 13.92 4.91 13.97 5.07C14.02 5.22 13.98 5.39 13.87 5.51L11.15 8.15C10.89 8.4 10.78 8.76 10.84 9.11L11.48 12.85C11.51 13.01 11.44 13.17 11.31 13.27C11.18 13.37 11 13.38 10.85 13.3L7.5 11.54C7.18 11.37 6.81 11.37 6.49 11.54L3.13 13.3C2.99 13.38 2.81 13.37 2.68 13.27C2.55 13.17 2.48 13.01 2.51 12.85L3.15 9.11C3.21 8.76 3.1 8.4 2.84 8.15L0.12 5.51C0.01 5.39 -0.03 5.22 0.02 5.07C0.07 4.91 0.2 4.8 0.36 4.77L4.12 4.23C4.47 4.18 4.77 3.95 4.93 3.63L6.61 0.23Z" />
  </svg>
);

const RatingStars = ({ rating }) => {
  const validRating = Math.min(Math.max(rating, 1), 5);

  return (
    <div
      className="review-rating__stars"
      role="img"
      aria-label={`Рейтинг: ${validRating} из 5`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} filled={index < validRating} />
      ))}
    </div>
  );
};

export default RatingStars;

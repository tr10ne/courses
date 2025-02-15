import React, { useState } from "react";
import ReviewRating from "./ReviewRating";

const ReviewItem = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Функция для получения первых двух предложений описания
  const getFirstTwoSentences = (text) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    if (sentences && sentences.length > 5) {
      return sentences.slice(0, 5).join(" ");
    }
    return text;
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const truncatedDescription = getFirstTwoSentences(review.text);

  return (
    <div className="review-list__item">
      <div className="item-head">
        <div className="review-raiting">
          <ReviewRating rating={review.rating} />
        </div>
        <div className="review-date">
          {new Date(review.created_at).toLocaleDateString()}
        </div>
      </div>
      <div className="item-body">
        <div className="review-text">
          <div
            dangerouslySetInnerHTML={{
              __html: isExpanded ? review.text : truncatedDescription,
            }}
          />
        </div>
      </div>
      <div className="item-foot">
        <div className="review-text__detail">
          {review.text.length > truncatedDescription.length && (
            <span
              onClick={(e) => {
                e.preventDefault();
                toggleExpand();
              }}
              className="review-text__detail__link"
            >
              {isExpanded ? "Свернуть" : "Читать полностью →"}
            </span>
          )}
        </div>
        <div className="review-autor">
          {review.user.name} ({review.user.email})
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;

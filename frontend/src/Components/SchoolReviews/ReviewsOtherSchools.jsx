import React from "react";
import RatingStars from "../RatingStars";

const ReviewsOtherSchools = ({ schools }) => {
  return (
    <div className="reviews-other-schools">
      <div className="reviews-other-schools__head">
        <p className="reviews-other-schools__title">Отзывы о других школах</p>
      </div>
      <div className="reviews-other-schools__body">
        {schools.map((school) => (
          <div key={school.id} className="reviews-other-schools__item">
            <p className="item-name">{school.name}</p>
            <p className="item-detail">{school.reviews} отзывов</p>
            <RatingStars rating={Math.round(school.rating || 0)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsOtherSchools;

import React from "react";

const ReviewItem = ({review}) => {
    if(review)
    return (
        <div className={`review ${review.rating === 5?'review_excelent':''}`}>
{review.rating}
        </div>
    );
};

export default ReviewItem;

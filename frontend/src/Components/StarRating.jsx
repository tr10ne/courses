import React from "react";
import Star from "./Star";


const StarRating = ({ rating }) => {
    const totalStars = 5; // Всего звезд
    const filledStars = Math.min(Math.max(rating, 0), totalStars); // Ограничиваем рейтинг от 0 до 5

    return (
        <div className="star-rating">
            {[...Array(totalStars)].map((_, index) => (
                <Star key={index} filled={index < filledStars} />
            ))}
        </div>
    );
};

export default StarRating;

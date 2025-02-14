import React, {  useState } from "react";
import StarRating from "./StarRating";
import moment from "moment";

const ReviewItem = ({ review }) => {
	const [isExpanded, setIsExpanded] = useState(false); // Состояние для управления разворачиванием

	if (!review) return null;

	return (
		<div
			className={`review ${review.rating === 5 ? "review_excelent" : ""} ${
				isExpanded ? "expanded" : ""
			}`}
		>
			<div className="review__details">
				<StarRating rating={review.rating} />
				<p className="review__user">
					{review.user.name}, {moment(review.created_at).format("DD/MM/YYYY")}
				</p>
			</div>
			<div
				className={`review__text`}
				dangerouslySetInnerHTML={{ __html: review.text }}
			/>

			<button
				className="expand-button"
				onClick={() => setIsExpanded(!isExpanded)} // Переключаем состояние
			>
				{isExpanded ? "Свернуть" : "Читать полностью →"}
			</button>
		</div>
	);
};

export default ReviewItem;

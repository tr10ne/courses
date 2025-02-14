import React from "react";
import Star from "../Star";

const SchoolInfo = ({ school }) => {
	return (
		<div className="course__cart course__cart_school">
			<h2 className="course__school-title">Информация о школе </h2>
			<h3 className="course__school-name"> {school.name}</h3>
			<div
				className="course__school-description"
				dangerouslySetInnerHTML={{ __html: school.description }}
			></div>

			<div className="course__school-details">
				<div className="course__school-raiting">
					<Star filled={true} />
					<span> {school.rating}</span>
				</div>
				<p className="course__school-reviews">отзывы о школе ({school.reviews})</p>
			</div>
		</div>
	);
};

export default SchoolInfo;

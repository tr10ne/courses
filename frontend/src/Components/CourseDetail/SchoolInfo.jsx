import React from "react";
import AvgRatingStar from "../AvgRatingStar";
import { Link } from "react-router-dom";

const SchoolInfo = ({ school }) => {
	return (
		<div className="course__cart course__cart_school">
			<h2 className="course__school-title">Информация о школе </h2>
			<h3 className="course__school-name">
				<Link to={`/schools/${school.url}`}>{school.name}</Link>
			</h3>
			<div
				className="course__school-description"
				dangerouslySetInnerHTML={{ __html: school.description }}
			></div>

			<div className="course__school-details">
				<AvgRatingStar className="info" value={school.rating} />
				<Link to={`/schools/${school.url}/reviews`}>
					<p className="course__school-reviews">
						отзывы о школе ({school.reviews})
					</p>
				</Link>
			</div>
		</div>
	);
};

export default SchoolInfo;

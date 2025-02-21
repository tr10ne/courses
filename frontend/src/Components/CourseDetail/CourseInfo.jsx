import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../js/formatPrice";

const CourseInfo = ({ course }) => {
	return (
		<div className="course__cart ">
            <div className="course__cart__header">
			<p className="course__price">{formatPrice(course.price)}</p>

            </div>
            <div className="course__cart__footer">

			<Link
				className="courses-item__more-link  course__more-link "
				target="_blank"
				to={course.link}
			>
				На сайт курса
			</Link>
            </div>
		</div>
	);
};

export default CourseInfo;

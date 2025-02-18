import React from "react";
import { Link } from "react-router-dom";

const CourseInfo = ({ course }) => {
	return (
		<div className="course__cart ">
            <div className="course__cart__header">
			<p className="course__price">{Math.floor(course.price)} ₽</p>

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

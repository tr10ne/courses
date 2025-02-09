import React from "react";
import { Link } from "react-router-dom";

const Course = ({ course }) => {
	return (
		<li className="courses-item courses-grid" >
			<Link to={`/courses/${course.course.url}`}>{course.course.name}</Link>

			<div className="courses-item__rating">
				<p>Количество отзывов: {course.review_count}</p>
				<p>
					Rating:{" "}
					{course.course_rating == null
						? "пока еще нет отзывов"
						: course.course_rating}
				</p>
			</div>

			<p>Price: {course.course.price}</p>

			<p>Школа: {course.school ? course.school.name : "Не указана"}</p>

			<div className="courses-item__controls">
				<Link className="courses-item__site" to={course.course.link}>
					На сайт курса
				</Link>
				<Link className="courses-item__site" to={course.course.link}>
					Подробнее
				</Link>
			</div>
		</li>
	);
};

export default Course;

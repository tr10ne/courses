// CourseDetail.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiUrl } from "../js/config.js";
import Breadcrumbs from "../Components/Breadcrumbs.jsx";
import Loading from "../Components/Loading.jsx";
import moment from "moment";
import ReviewItem from "../Components/ReviewItem.jsx";
import Course from "../Components/Courses/Course.jsx";

const CourseDetail = () => {
	const { url } = useParams(); // Получаем параметр `url` из URL
	const [course, setCourse] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Запрос к API для получения курса по его `url`
	useEffect(() => {
		axios
			.get(`${apiUrl}/api/courses/url/${url}`)
			.then((response) => {
				const result = response.data
					? response.data.data || response.data
					: null;

				if (result) {
					setCourse(result);
				} else {
					setError("Курс не найден");
				}
			})
			.catch((error) => {
				console.error("Ошибка при загрузке курса:", error);
				setError("Ошибка при загрузке данных курса");
			})
			.finally(() => {
				setLoading(false);
			});
	}, [url]);

	//отрисовываем отзыв
	const renderReview = () => {
		if (course.reviews.length === 0) return <p>Нет отзывов о курсе</p>;

		const randomIndex = Math.floor(Math.random() * course.reviews.length);

		return <ReviewItem review={course.reviews[randomIndex]} />;
	};

	const renderRelatedCourses = () => {
		if (course.related_courses.length === 0) return;
		return (
			<article className="course__block">
				<h2 className="course__title">Похожие курсы</h2>
				{course.related_courses.map((relatedCourse) => (
					<Course key={relatedCourse.id} course={relatedCourse} />
				))}
			</article>
		);
	};

	if (loading) {
		return <Loading />;
	}

	if (error) {
		return <div>{error}</div>;
	}

	const crumbs = [
		{ path: "/", name: "Главная" },
		{ path: "/courses", name: "Онлайн-курсы" },
		{ path: `/${course.url}`, name: course.name },
	];

	return (
		<section className="course">
			<div className="course__header">
				<div className="course__header__inner container">
					<Breadcrumbs crumbs={crumbs} />

					<h1 className="title">{course.name}</h1>
					<p className="course__updated-at">
						Последнее обновление{" "}
						{moment(course.updated_at).format("DD.MM.YYYY")}
					</p>
				</div>
			</div>

			<div className="course__main container">
				<div className="course__content text">
					<article className="course__block">
						<h2 className="course__title">О курсе</h2>
						<p className="course__description">{course.description}</p>
					</article>
					<article className="course__block">
						<h2 className="course__title">Отзывы о курсе</h2>
						{renderReview()}
					</article>
					{renderRelatedCourses()}
				</div>
				<aside className="course__sidebar">
					<p className="course__price">{course.price}</p>
				</aside>
			</div>
		</section>
	);
};

export default CourseDetail;

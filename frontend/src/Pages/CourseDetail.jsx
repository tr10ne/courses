import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { apiUrl } from "../js/config.js";
import Breadcrumbs from "../Components/Breadcrumbs.jsx";
import Loading from "../Components/Loading.jsx";
import moment from "moment";
import ReviewItem from "../Components/Reviews/ReviewItem.jsx";
import CourseItem from "../Components/CourseDetail/CourseItem.jsx";
import CourseInfo from "../Components/CourseDetail/CourseInfo.jsx";
import SchoolInfo from "../Components/CourseDetail/SchoolInfo.jsx";

const CourseDetail = () => {
	const navigate = useNavigate();
	const { categoryUrl, subcategoryUrl, courseUrl } = useParams();
	const [course, setCourse] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const headerRef = useRef(null);
	const [crumbs, setCrumbs] = useState([]);
	const [visibleReviews, setVisibleReviews] = useState(1);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	useEffect(() => {
		if (!course) return;
		setCrumbs([
			{ path: "/", name: "Главная" },
			{ path: "/courses", name: "Онлайн-курсы" },
			{
				path: `/courses/${course.category.url}`,
				name: course.category.name,
			},
			{
				path: `/courses/${course.category.url}/${course.subcategory.url}`,
				name: course.subcategory.name,
			},
			{
				path: `/courses/${course.category.url}/${course.subcategory.url}/${course.url}`,
				name: course.name,
			},
		]);
	}, [course]);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		handleResize();

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		const handleResize = () => {
			if (!course || windowWidth < 970) return;
			const headerHeight = headerRef.current.offsetHeight;
			const sidebar = document.querySelector(".course__sidebar");
			sidebar.style.top = `-${Math.floor(headerHeight / 2 + 40)}px`;
		};

		handleResize();

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [course, windowWidth]);

	// Запрос к API для получения курса по его `url`
	useEffect(() => {
		if (!courseUrl) return;
		axios
			.get(
				`${apiUrl}/api/courses/${categoryUrl}/${subcategoryUrl}/${courseUrl}`
			)
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
				if (error.response && error.response.status === 404) {
					navigate("/404"); // Перенаправляем на страницу 404
				} else {
					console.error("Ошибка при загрузке курса:", error);
				}
				setError("Ошибка при загрузке данных курса");
			})
			.finally(() => {
				setLoading(false);
			});
	}, [courseUrl, categoryUrl, subcategoryUrl, navigate]);

	//отрисовываем отзывы
	const renderReview = () => {
		if (course.reviews.length === 0) return <p>Нет отзывов о курсе</p>;

		const reviewsToShow = course.reviews.slice(0, visibleReviews);

		return (
			<>
				{reviewsToShow.map((review, index) => (
					<ReviewItem key={index} review={review} />
				))}
				{visibleReviews < course.reviews.length && (
					<button
						className="course__reviews-link"
						onClick={() => setVisibleReviews(visibleReviews + 3)}
					>
						Еще отзывы о курсе
					</button>
				)}
			</>
		);
	};

	const renderRelatedCourses = () => {
		if (!course) return;
		if (course.related_courses.length === 0) return;
		return (
			<article className="course__block">
				<h2 className="course__title">Похожие курсы</h2>
				{course.related_courses.map((relatedCourse) => (
					<CourseItem key={relatedCourse.id} course={relatedCourse} />
				))}
			</article>
		);
	};

	if (loading) {
		return <Loading />;
	}

	if (!error)
		return (
			<section className="course">
				<div className="course__header" ref={headerRef}>
					<div className=" container">
						<div className="course__header__inner">
							<Breadcrumbs crumbs={crumbs} />
							<h1 className="title">{course.name}</h1>
							<p className="course__updated-at">
								Последнее обновление{" "}
								{moment(course.updated_at).format("DD.MM.YYYY")}
							</p>
						</div>
					</div>
				</div>

				<div className="course__main container text">
					<div className="course__content">
						<article className="course__block">
							<h2 className="course__title">О курсе</h2>
							<p className="course__description ">{course.description}</p>
						</article>
						{windowWidth <= 680 && (
							<article className="course__block course__sidebar">
								<SchoolInfo school={course.school} />
							</article>
						)}
						<article className="course__block">
							<h2 className="course__title">Отзывы о курсе</h2>
							{renderReview()}
						</article>
						{renderRelatedCourses()}
					</div>
					<aside className="course__sidebar">
						<CourseInfo course={course} />
						{windowWidth > 680 && <SchoolInfo school={course.school} />}
					</aside>
				</div>
			</section>
		);
};

export default CourseDetail;

import React, { useEffect, useState, useCallback, useRef } from "react";
import CourseItem from "../../CourseDetail/CourseItem";
import axios from "axios";
import Loading from "../../Loading.jsx";
import { apiUrl } from "../../../js/config.js";

const PopularCourseList = ({ categoryId, page, setNextPage }) => {
	const recordsPerPage = 5;
	const [loading, setLoading] = useState(true);
	const [courses, setCourses] = useState();
	const [error, setError] = useState();
	const abortControllerRef = useRef(null);


	const fetchCourses = useCallback(() => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		const controller = new AbortController();
		abortControllerRef.current = controller;

		setLoading(true);

		const requestParams = {
			limit: recordsPerPage,
			page: page,
			selectedCategoryId: categoryId,
			sort_rating: false,
		};

		axios
			.get(`${apiUrl}/api/courses`, {
				params: requestParams,
				signal: controller.signal, // Передаем signal для отмены запроса
			})
			.then((response) => {
				console.log("Ответ от API:", response.data);
				const courses = Array.isArray(response.data)
					? response.data
					: response.data && Array.isArray(response.data.courses)
					? response.data.courses
					: null;

				if (courses) {
					setCourses(courses);
					if (response.data.links.next);
					setNextPage(page + 1);

				} else {
					console.error("Ожидались курсы, но получено:", response.data);
					setError("Не удалось загрузить курсы.");
				}
				setLoading(false);
			})
			.catch((error) => {
				if (error.name !== "CanceledError") {
					console.error("Ошибка при загрузке курсов:", error);
					setError("Не удалось загрузить курсы. Пожалуйста, попробуйте позже.");
				}
			})
			.finally(() => {});

		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};

		//  eslint-disable-next-line react-hooks/exhaustive-deps
	}, [categoryId, page]);

	//чтобы избежать утечек памяти.
	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	useEffect(() => {
		fetchCourses();
	}, [fetchCourses]);

	if (error) return <p>{error}</p>;

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<ul className="courses-list">
					{!courses || courses.length === 0 ? (
						<CourseItem foo={"Не найдено ни одно курса"} />
					) : (
						courses.map((course) => {
							return <CourseItem key={course.id} course={course} />;
						})
					)}
				</ul>
			)}
		</>
	);
};

export default PopularCourseList;

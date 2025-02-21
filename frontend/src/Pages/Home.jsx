import React, { useEffect, useState } from "react";
import Intro from "../Components/Home/Intro";
import About from "../Components/Home/About";
import Directions from "../Components/Home/Directions";
import axios from "axios";
import { apiUrl } from "../js/config.js";
import PopularCourses from "../Components/Home/PopularCourses/PopularCourses";

const Home = () => {
	const [categories,setCategories] = useState(null);

	useEffect(() => {
		axios
			.get(`${apiUrl}/api/categories`)
			.then((response) => {
				console.log("Ответ от API:", response.data);

				const result = Array.isArray(response.data)
					? response.data
					: response.data && Array.isArray(response.data.data)
					? response.data.data
					: null;

				if (Array.isArray(result)) {
					setCategories(result);
				} else {
					console.error("Ожидался массив, но получено:", response.data);
				}
			})
			.catch((error) => {
				console.error("Ошибка при загрузке категорий:", error);
			});
	}, []);


	return (
		<>
			<Intro />
			<About />
			<Directions categories={categories} />
			<PopularCourses categories={categories}/>
		</>
	);
};

export default Home;

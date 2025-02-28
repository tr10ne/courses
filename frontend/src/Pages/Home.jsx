import React, { useEffect, useState } from "react";
import Intro from "../Components/Home/Intro";
import About from "../Components/Home/About";
import Directions from "../Components/Home/Directions";
import { loadCategories } from "../js/loadCategories.js";
import PopularCourses from "../Components/Home/PopularCourses/PopularCourses";

const Home = () => {
	const [categories, setCategories] = useState(null);

	useEffect(() => {
			loadCategories()
				.then((loadedCategories) => {
					setCategories(loadedCategories);
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
			<PopularCourses categories={categories} />
		</>
	);
};

export default Home;

import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import Category from "./Category";
import { loadCategories } from "../../js/loadCategories";

const Categories = ({
	paramCategoryUrl,
	handleCategoryChange,
	disabledCategories,
	setSelectedCategory,
}) => {
	const [loading, setLoading] = useState(true);
	const [categories, setCategories] = useState([]);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
		loadCategories()
			.then((loadedCategories) => {
				setCategories(loadedCategories);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Ошибка при загрузке категорий:", error);
				setLoading(false);
			});
	}, []);

	return (
		<div className="categories-filter" name="categories">
			<div
				className={`${
					windowWidth <= 1024
						? " home-category-list scrollbar scrollbar_horizontal"
						: "categories-filter__inner container"
				} ${disabledCategories ? "disabled" : ""}`}
			>
				{loading ? (
					<Loading />
				) : (
					categories.map((category) => (
						<Category
							key={category.id}
							category={category}
							handleCategoryChange={handleCategoryChange}
							setSelectedCategory={setSelectedCategory}
							paramCategoryUrl={paramCategoryUrl}
						/>
					))
				)}
			</div>
		</div>
	);
};

export default Categories;

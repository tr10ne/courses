import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Loading";
import Category from "./Category";
import { apiUrl } from "../../js/config";

const Categories = ({
	paramCategoryUrl,
	handleCategoryChange,
	disabledCategories,
	setSelectedCategory,
}) => {
	const [loading, setLoading] = useState(true);
	const [categories, setCategories] = useState([]);

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
				setLoading(false);
			})
			.catch((error) => {
				console.error("Ошибка при загрузке категорий:", error);
				setLoading(false);
			})

	}, []);

	return (
		<div className="categories-filter" name="categories">
			<div
				className={`categories-filter__inner container ${
					disabledCategories ? "disabled" : ""
				}`}
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

import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Loading";
import Category from "./Category";
import { apiUrl } from "../../js/config";

const Categories = ({
	selectedCategoryId,
	handleCategoryChange,
	disabledCategories,
}) => {
	const [loadingCategories, setLoadingCategories] = useState(true);
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
			})
			.catch((error) => {
				console.error("Ошибка при загрузке категорий:", error);
			})
			.finally(() => {
				setLoadingCategories(false);
			});
	}, []);

	return (
		<div className="categories-filter">
			<div
				className={`categories-filter__inner container ${
					disabledCategories ? "disabled" : ""
				}`}
			>
				{loadingCategories ? (
					<Loading />
				) : (
					categories.map((category) => (
						<Category
							key={category.id}
							category={category}
							selectedCategoryId={selectedCategoryId}
							handleCategoryChange={handleCategoryChange}
						/>
					))
				)}
			</div>
		</div>
	);
};

export default Categories;
